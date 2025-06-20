from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

router = APIRouter()

# Load GPT-2 model and tokenizer once at startup
model_id = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)
generator = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=100)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat/")
async def chat_endpoint(request: ChatRequest):
    try:
        prompt = request.message
        result = generator(prompt, max_new_tokens=100, do_sample=True, temperature=0.7)
        response_text = result[0]["generated_text"][len(prompt):].strip()

        print(f"💬 gpt2: {response_text}")
        
        return {"response": response_text}
    except Exception as e:
        print(f"❌ Server error: {e}")
        return {"error": str(e)}
