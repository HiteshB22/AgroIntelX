import google.genai as genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ✅ 1. Check connection and list available models
print("✅ Connected to Gemini successfully!\n")

models = client.models.list()
print("Available Models:")
for m in models:
    print("•", m.name)

# ✅ 2. Simple text generation test
response = client.models.generate_content(
    model="models/gemini-2.5-flash",  # ✅ updated model name
    contents="Explain soil fertility in 2 lines."
)

print("\nGemini Response:")
print(response.text)
