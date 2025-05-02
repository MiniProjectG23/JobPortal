# chat.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_chat_response(user_input: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-pro")

    # Start chat with initial instruction
    chat = model.start_chat(history=[
        {
            "role": "user",
            "parts": ["From now on, respond to all inputs in no more than 50 words. Be brief, clear, and helpful."]
        },
        {
            "role": "model",
            "parts": ["Understood. I will keep all responses concise and under 50 words."]
        }
    ])

    response = chat.send_message(user_input)
    return response.text
