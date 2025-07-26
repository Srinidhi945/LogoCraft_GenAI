import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
from dotenv import load_dotenv
import time # Import time for sleep

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all origins during development.
CORS(app)

# --- Hugging Face API Configuration ---
HF_API_TOKEN = os.getenv("HF_API_TOKEN") 
# HF_API_URL for stabilityai/stable-diffusion-xl-base-1.0
HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

# Headers for Hugging Face API request
headers = {"Authorization": f"Bearer {HF_API_TOKEN}"} 

# Function to query the Hugging Face Inference API
def query_huggingface_api(payload):
    """
    Sends a payload to the Hugging Face Inference API and returns the raw image bytes.
    """
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    response.raise_for_status() 
    return response.content 

@app.route('/generate_logo', methods=['POST'])
def generate_logo():
    """
    Endpoint to generate logos based on user prompt using Hugging Face API.
    Expects a JSON payload with 'prompt'.
    """
    data = request.get_json()
    user_prompt = data.get('prompt')
    
    num_images_to_generate = 1 

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    if not HF_API_TOKEN:
        return jsonify({"error": "Hugging Face API token not configured in .env. Please use your HF token."}), 500
    
    generated_images_base64 = []

    for i in range(num_images_to_generate): 
        try:
            # SDXL Base takes 'inputs' for the prompt.
            # Optimal resolution for SDXL is 1024x1024 for best results.
            image_bytes = query_huggingface_api({
                "inputs": user_prompt,
                "parameters": {
                    "width": 1024, # Optimal for SDXL
                    "height": 1024, # Optimal for SDXL
                    "num_inference_steps": 50 # Good quality for SDXL
                }
            })
            
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            generated_images_base64.append(base64_image)
            
            # --- FIX: Replaced JavaScript await with Python's time.sleep() ---
            time.sleep(5) # 5 second delay between each image generation

        except requests.exceptions.RequestException as e:
            app.logger.error(f"Hugging Face API request failed: {e}")
            if e.response and e.response.status_code == 402:
                return jsonify({"error": "AI model requires payment or free tier limit exceeded. Try a simpler prompt or a different model."}), 402
            elif e.response and e.response.status_code == 503:
                return jsonify({"error": "AI model is currently overloaded or unavailable. Please try again in a moment."}), 503
            elif e.response and e.response.status_code == 429: # Too Many Requests
                    return jsonify({"error": "Too many requests to AI model. Please wait a moment and try again."}), 429
            return jsonify({"error": f"Failed to generate image from AI: {str(e)}"}), 500
        except Exception as e:
            app.logger.error(f"An unexpected error occurred: {e}")
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

    return jsonify({"images": generated_images_base64}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
