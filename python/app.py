from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS

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

if __name__ == '__main__':
    app.run(port=5001, debug=True)
