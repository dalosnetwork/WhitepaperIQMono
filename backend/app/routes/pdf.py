from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services import pdf_parser, chatgpt_client
from app.services.chatgpt_client import generate_userid


router = APIRouter()


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="File not provided")

    user_id = generate_userid()
    x = pdf_parser.upload_document(user_id, file.filename, file)
    text = pdf_parser.extract_text_from_pdf(x['user_id'], x['file_name'])
    analysis_result = chatgpt_client.analyze_text(text, user_id)
    return {"filename": file.filename, "analysis": analysis_result}
