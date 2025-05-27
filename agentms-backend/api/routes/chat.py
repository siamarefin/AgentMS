from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

router = APIRouter()

# Load model and tokenizer once globally
model_name = "Qwen/Qwen2.5-Math-1.5B"  # Replace with your Qwen model name if available
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat/")
async def chat_endpoint(request: ChatRequest):
    input_text = request.message

    # Encode and generate response tokens
    inputs = tokenizer.encode(input_text + tokenizer.eos_token, return_tensors="pt")
    outputs = model.generate(
        inputs,
        max_length=100,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7,
        num_return_sequences=1,
    )

    # Decode generated tokens to string
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Return the part generated after the input
    return {"response": response[len(input_text):].strip()}
