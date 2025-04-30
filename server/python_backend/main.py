from fastapi import FastAPI, File, UploadFile, Form
import base64
import os
import io
from dotenv import load_dotenv
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import pdf2image
import google.generativeai as genai
import markdown

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React origin specify karna ho to change karo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_pdf(uploaded_file):
    images = pdf2image.convert_from_bytes(uploaded_file,
                                            poppler_path=r"C:\Users\yashi\Release-24.08.0-0\poppler-24.08.0\Library\bin")
    first_page = images[0]

    # Convert image to base64
    img_byte_arr = io.BytesIO()
    first_page.save(img_byte_arr, format="JPEG")
    img_byte_arr = img_byte_arr.getvalue()

    return [{
        "mime_type": "image/jpeg",
        "data": base64.b64encode(img_byte_arr).decode()
    }]


def get_gemini_response(job_desc, pdf_content, prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content([job_desc, pdf_content[0], prompt])

    # Convert Markdown response to HTML
    html_response = markdown.markdown(response.text, extensions=['extra', 'nl2br'])

    print("Converted HTML Response:", html_response)  # Debugging

    return html_response



@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/analyze_resume/")
async def analyze_resume(file: UploadFile = File(...), job_desc: str = Form(...), mode: str = Form(...)):
    pdf_content = process_pdf(await file.read())

    if mode == "summary":
        prompt = "You are an experienced HR Manager. Review the resume against the job description and provide a summary in short and concise way."
    elif mode == "match":
        prompt = "You are an ATS scanner. Evaluate the resume against the job description and provide a match percentage give response in short and concise way."
    else:
        return {"error": "Invalid mode"}

    response = get_gemini_response(job_desc, pdf_content, prompt)
    return {"result": response}
