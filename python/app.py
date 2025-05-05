from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image
import openai
import google.generativeai as genai
import json

app = Flask(__name__)
CORS(app)  # Enable CORS

# Configure Gemini
genai.configure(api_key="AIzaSyAVYm-oY0YNGeEMiJOea5wOkhU9GrHXrhU")  # Replace with your API key
gemini_model = genai.GenerativeModel('gemini-1.5-pro-latest')

# Load the facial expression model
model = load_model('fer_model.h5')

# Define emotion labels (edit based on your model's classes)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def preprocess_image(base64_str):
    image_data = base64.b64decode(base64_str.split(',')[1])
    image = Image.open(BytesIO(image_data)).convert('L')  # convert to grayscale
    image = image.resize((48, 48))  # FER size
    img_array = np.array(image) / 255.0
    img_array = img_array.reshape(1, 48, 48, 1)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        base64_img = data.get('image')

        if not base64_img:
            return jsonify({'error': 'No image provided'}), 400

        processed_img = preprocess_image(base64_img)

        predictions = model.predict(processed_img)
        predicted_index = np.argmax(predictions)
        predicted_emotion = emotion_labels[predicted_index]
        confidence_score = float(np.max(predictions))

        return jsonify({
            'emotion': predicted_emotion,
            'confidence': confidence_score
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    # ==== GET GEMINI QUESTION ====
@app.route('/get_questions', methods=['POST'])
def get_questions():
    data = request.get_json()
    role = data.get('role', 'Software Engineer')
    print(f"Role received: {role}")

    try:
      #  model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        prompt = f"Generate 5 mock interview questions for the role of a {role}.But that can be explainable not pseudo code "
        print("Prompt:", prompt)

        response = gemini_model.generate_content(prompt)
        print("Raw response:", response)

        raw_text = response.text.strip()
        questions = [line.strip("-•1234567890. ") for line in raw_text.split('\n') if line.strip()]

        return jsonify({'questions': questions})
    
    except Exception as e:
        import traceback
        print("Gemini error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500



@app.route('/evaluate_answer', methods=['POST'])
def evaluate_answer():
    try:
        data = request.get_json()
        question = data.get("question")
        answer = data.get("answer")

        prompt = f"""
        You are an AI interviewer. Evaluate the following candidate's answer.

        Question: "{question}"
        Answer: "{answer}"

        Provide a response with:
        1. A score out of 10.
        2. One short paragraph of feedback.

        Format:
        Score: <score>
        Feedback: <feedback>
        """

        response = gemini_model.generate_content(prompt)
        text = response.text.strip()

        # Extract score and feedback
        lines = text.splitlines()
        score_line = next((l for l in lines if l.lower().startswith("score:")), "Score: 0")
        feedback_line = next((l for l in lines if l.lower().startswith("feedback:")), "Feedback: No feedback.")

        score_str = score_line.split(":", 1)[-1].strip()
        feedback = feedback_line.split(":", 1)[-1].strip()

        try:
            score = float(score_str)
        except ValueError:
            score = 0.0

        return jsonify({
            "score": round(score, 2),
            "explanation": feedback
        })

    except Exception as e:
        print("Error in /evaluate_answer:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
