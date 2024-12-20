from fastapi import APIRouter
from pydantic import BaseModel
from app.services import chat_client

router = APIRouter()


class ChatRequest(BaseModel):
    user_message: str
    user_id: str


@router.post("/chat")
async def chat(request: ChatRequest):
    response = chat_client.chat_with(request.user_message, request.user_id)
    return {"response": response}
