from qwen import Qwen  # (replace with the actual import from your SDK)

# Initialize the model once
qwen_model = Qwen()

def generate_response(prompt: str) -> str:
    # Call the Qwen model to generate a response for the prompt
    output = qwen_model.chat(prompt)
    return output.text  # Or adapt depending on the API
