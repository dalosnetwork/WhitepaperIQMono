from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf, chat
from app.services.chatgpt_client import start_clear_inactive_users_thread
from app.config import config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Bu kaynaklardan gelen isteklere izin ver
    allow_credentials=True,
    allow_methods=["*"],  # İzin verilen HTTP metotları, istersen POST, GET gibi belirleyebilirsin
    allow_headers=["*"],  # İzin verilen başlıklar
)

# Route'ları ekle
app.include_router(pdf.router)
app.include_router(chat.router)

if __name__ == "__main__":
    import uvicorn

    start_clear_inactive_users_thread(config.TEMP_RESPONSE_PATH, 5 * 60)
    uvicorn.run(app, host="0.0.0.0", port=8686)
