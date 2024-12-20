from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    pdf_id: str
    topic: str


class ChatRequest(BaseModel):
    user_message: str
