import os
import shutil
import tempfile

import fitz
from fastapi import HTTPException


def extract_text_from_pdf(user_id, filename):
    pdf_path = f"temp/{user_id}-{filename}"
    """with open(pdf_path, "wb+") as f:
        f.write(file.file.read())"""

    doc = fitz.open(pdf_path)

    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    delete_pdf_file(f"temp/{user_id}-{filename}")
    return text


def upload_document(user_id, file_name, file):
    # PDF kaydetme ve okuma kısmı
    file_location = f"temp/{user_id}-{file_name}"

    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object, length=1024 * 1024)
            file_object.flush()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload error: {str(e)}")
    return {
        "user_id": user_id,
        "file_name": file_name,
        "file_location": file_location
    }


def delete_pdf_file(pdf_path):
    os.remove(pdf_path)
