import json
import os
import threading
import time
import uuid
import requests
from app.config import config

chat_history = {}
chat_date = {}


def analyze_text(text, user_id):
    headers = {
        "Authorization": f"Bearer {config.CHAT_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "wpiq1",
        "messages": [{"role": "system", "content": PROMPT_MESSAGE}, {"role": "user", "content": text}]
    }
    response = requests.post(config.CHAT_API_URL, headers=headers, json=data)
    full_response = response.json()
    # Extract the 'content' from the 'choices'
    analysis_content = None
    choices = full_response.get("choices", [])

    if choices and "message" in choices[0]:
        analysis_content = choices[0]["message"].get("content")

    # No filename in the response, so only return the content
    processed_response = {
        "analysis": analysis_content,
        "user_id": user_id
    }
    save_response_to_file(processed_response, config.TEMP_RESPONSE_PATH)
    set_chat_date(user_id)
    save_chat_history(user_id, processed_response)
    return processed_response


def chat_with(user_message, user_id):
    full_user_message = read_response_from_file(config.TEMP_RESPONSE_PATH, user_id)
    full_user_message.update({"user_message": user_message})
    text_message = json.dumps(full_user_message)
    save_response_to_file(full_user_message, config.TEMP_RESPONSE_PATH)
    headers = {
        "Authorization": f"Bearer {config.CHAT_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "wpiq1",
        "messages": [{"role": "user", "content": text_message}]
    }
    response = requests.post(config.CHAT_API_URL, headers=headers, json=data)
    full_response = response.json()
    # Extract the 'content' from the 'choices'
    analysis_content = None
    choices = full_response.get("choices", [])

    if choices and "message" in choices[0]:
        analysis_content = choices[0]["message"].get("content")

    # No filename in the response, so only return the content
    processed_response = {
        "analysis": analysis_content,
        "user_id": user_id
    }
    full_user_message.update({"analysis": full_user_message["analysis"] + "\n" + analysis_content})
    save_response_to_file(full_user_message, config.TEMP_RESPONSE_PATH)
    set_chat_date(user_id)
    save_chat_history(user_id, full_user_message)
    return processed_response


def save_response_to_file(response, file_path):
    # Dosya var mı kontrol et
    if os.path.exists(file_path):
        # Var olan dosyayı oku
        with open(file_path, "r") as file:
            try:
                data = json.load(file)
                # Eğer veri bir liste değilse, boş bir listeye çevir
                if not isinstance(data, list):
                    data = []
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    # Var olan user_id'yi bul ve güncelle
    user_exists = False
    for i, entry in enumerate(data):
        if isinstance(entry, dict) and entry.get("user_id") == response["user_id"]:
            data[i] = response  # Eski kaydın üzerine yaz
            user_exists = True
            break

    # Yeni user_id ise ekle
    if not user_exists:
        data.append(response)

    # Güncellenmiş veriyi dosyaya yaz
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)


def read_response_from_file(file_path, user_id):
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            try:
                data = json.load(file)
                # Eğer veri bir liste değilse, boş liste oluştur BURAYA BİR DİKKAT EDELİM
                if not isinstance(data, list):
                    data = []
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    # İlgili user_id'yi bul
    for entry in data:
        if entry.get("user_id") == user_id:
            return entry
    raise ValueError("This user ID is not found : " + user_id)


def set_chat_date(user_id):
    if user_id not in chat_date:
        chat_date[user_id] = {}
    chat_date[user_id] = time.time()


def save_chat_history(user_id, history):
    if user_id not in history:
        chat_history[user_id] = {}
    chat_history[user_id] = history


def generate_userid():
    user_id = str(uuid.uuid4())
    return user_id


def clear_inactive_users(file_path, timeout):
    while True:
        # Dosya varsa ve chat_date içinde kayıtlı kullanıcılar varsa kontrol et
        if os.path.exists(file_path) and chat_date:
            current_time = time.time()
            inactive_users = []
            print("chat date " + chat_date.items().__str__())

            # Her kullanıcı için son aktif zamanını kontrol et
            for user_id, last_active_time in chat_date.items():
                print(f"Checking user {user_id}...")
                if current_time - last_active_time > timeout:
                    inactive_users.append(user_id)
            # Inaktif kullanıcıların chat_history ve chat_date verilerini temizle
            for user_id in inactive_users:
                print(f"User {user_id} inactive, data cleaning...")
                chat_history.pop(user_id, None)  # chat_history'den sil
                chat_date.pop(user_id, None)  # chat_date'den sil

            # response.json dosyasını da güncelle
            with open(file_path, 'r+') as file:
                try:
                    data = json.load(file)
                    # Eğer veri bir liste değilse, boş liste oluştur
                    if not isinstance(data, list):
                        data = []
                except json.JSONDecodeError:
                    data = []

                data = [entry for entry in data if entry.get("user_id") not in inactive_users]

                # Dosyayı temizleyip güncel veriyi yaz
                file.seek(0)
                file.truncate()  # Dosyanın içeriğini tamamen temizle
                json.dump(data, file)
        time.sleep(30)  # 30 saniyede bir kontrol et


def start_clear_inactive_users_thread(file_path, timeout):
    print("Creating thread for clearing inactive users...")
    thread = threading.Thread(target=clear_inactive_users, args=(file_path, timeout))
    thread.daemon = True  # Program kapandığında thread de kapansın
    thread.start()


PROMPT_MESSAGE = """You will be provided with a whitepaper in PDF format. Your task is to evaluate this whitepaper based 
on specific categories. For each category, provide strengths (Green Flags) and weaknesses (Red Flags), and score the whitepaper out of 100.
Please only give the output in response format in below. Do not give any comments for it.

If a category has multiple Green Flags and no Red Flags, assign a score of 100. Otherwise, 
score the category based on the balance of Green and Red Flags. 

The categories are:

1. Technology & Innovation
2. Financial Model & Tokenomics
3. Applicability & Use Cases
4. Problem & Solution
5. Market Potential
6. Security & Compliance
7. Market & Audience Strategy

Evaluate the whitepaper based on these criteria:

Red Flags
* Unclear Objectives: The project lacks a clear purpose or goal.
* Missing Technical Details: Technical details are insufficient or unclear.
* Anonymous Team: Lack of information about the project team or an anonymous team.
* Inconsistencies: Inconsistencies or contradictions in the stated information.
* Overly Ambitious Claims: Unrealistic or overly ambitious claims.
* Missing Financial Information: Financial model or revenue plan is missing or unclear.
* Weak Roadmap: Future plans of the project are unclear or not detailed.
* Insufficient Security Measures: The project does not adequately explain its security measures.

Green Flags
* Clear and Distinct Objectives: The project has clear and distinct goals.
* Detailed Technical Explanations: Technical details are comprehensive and understandable.
* Transparent and Experienced Team: The project team is transparent and consists of experienced individuals.
* Consistent and Accurate Information: The stated information is consistent and verifiable.
* Realistic Claims: The project's claims are reasonable and realistic.
* Detailed Financial Information: The financial model and revenue plan are clear and detailed.
* Strong Roadmap: Future plans are clear and well-detailed.
* Robust Security Measures: The project comprehensively explains its security measures.

Your response should be in the following dictionary format:
{
    "Technology & Innovation": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0},
    "Financial Model & Tokenomics": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0},
    "Applicability & Use Cases": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0},
    "Problem & Solution": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0},
    "Market Potential": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0},
    "Security & Compliance": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0},
    "Market & Audience Strategy": {"Red Flag": ["redflag1", "redflag2"], "Green Flag": ["green flag1", "green flag2"], "point": 0}
}

}"""
