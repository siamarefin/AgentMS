from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

# Configure Gemini API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyBhR8sZEibkB2TWMTiAy2YCWpBL85eyp_E"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Load Gemini model
model = genai.GenerativeModel("gemini-pro")

class ChatRequest(BaseModel):
    message: str

@router.post("/chat/")
async def chat_endpoint(request: ChatRequest):
    try:
        prompt = request.message
        response = model.generate_content(prompt)

        response_text = response.text.strip()
        print(f"💬 gemini: {response_text}")

        return {"response": response_text}
    except Exception as e:
        print(f"❌ Server error: {e}")
        return {"error": str(e)}
