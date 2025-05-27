from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat API router (only once)
app.include_router(chat.router)