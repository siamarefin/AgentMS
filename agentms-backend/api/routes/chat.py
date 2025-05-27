from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

router = APIRouter()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model and tokenizer once globally
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat/")
async def chat_endpoint(request: ChatRequest):
    input_text = request.message

    # Encode and generate response tokens with attention_mask
    encoded = tokenizer(
        input_text + tokenizer.eos_token,
        return_tensors="pt",
        padding=True
    )
    inputs = encoded["input_ids"]
    attention_mask = encoded["attention_mask"]

    outputs = model.generate(
        inputs,
        attention_mask=attention_mask,
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
    return response