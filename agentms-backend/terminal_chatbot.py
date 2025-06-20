import requests

API_URL = "http://localhost:8000/chat/"  # Adjust if your FastAPI is hosted differently

def chat_with_bot(prompt):
    response = requests.post(API_URL, json={"message": prompt})
    response.raise_for_status()
    return response.text.strip('"')  # strip quotes from JSON string

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            print("Chatbot: Goodbye!")
            break

        try:
            response = chat_with_bot(user_input)
            print("Chatbot:", response)
        except Exception as e:
            print("Error:", e)
