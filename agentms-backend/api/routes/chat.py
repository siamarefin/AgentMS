from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import logging
import re 

router = APIRouter()

OLLAMA_URL = "http://localhost:11434/api/completions"  # Ollama API endpoint
OLLAMA_MODEL = "qwen3:1.7b"  # Change to your Ollama model

logging.basicConfig(level=logging.INFO)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat/")
async def chat_endpoint(request: ChatRequest):
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": request.message,
        "stream": False
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"Error calling Ollama API: {e}")
        raise HTTPException(status_code=500, detail=f"Error calling Ollama API: {str(e)}")

    data = response.json()
    logging.info(f"Ollama response data: {data}")


    # Find everything after the closing </think> tag
    raw_text = data["choices"][0].get("text", "")

    # Remove everything before and including </think>
    main_output = re.sub(r"(?is)^.*?</think>\s*", "", raw_text).strip()

    return {"response": "siam"}

