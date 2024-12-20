import os


class Config:
    CHAT_API_URL = os.getenv("CHAT_API_URL")
    CHAT_API_KEY = os.getenv("CHAT_API_KEY")
    PDF_STORAGE_PATH = "temp/"
    TEMP_RESPONSE_PATH = "temp/responses/temp-response.json"


config = Config()
