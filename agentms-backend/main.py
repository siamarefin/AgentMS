from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Chatbot Backend", description="FastAPI backend for a chatbot using Qwen models")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Chatbot Backend!"}