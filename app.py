from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import requests
import os
import random
from io import BytesIO
from dotenv import load_dotenv
from PIL import Image
from fpdf import FPDF

# Load API key from .env file
load_dotenv()
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
print("Hugging Face API Key Loaded:", bool(HUGGINGFACE_API_KEY))  # Don't print full key for security

# Flask app setup
app = Flask(__name__)
CORS(app)

# Hugging Face API endpoint
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

# Folder to save generated images
IMAGE_FOLDER = "generated_images"
if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate-logo", methods=["POST"])
def generate_logo():
    try:
        print("Request received...")  # Debugging log

        if not request.is_json:
            return jsonify({"error": "Invalid request format. JSON expected."}), 400

        data = request.get_json()
        print("Received data:", data)  # Debugging log

        prompt = data.get("prompt", "").strip()
        if not prompt:
            return jsonify({"error": "Prompt is required."}), 400

        # Request 3 different logos
        image_paths = []
        for i in range(3):
            seed = random.randint(0, 99999)
            print(f"Generating image {i+1} with seed {seed}")  # Debug

            response = requests.post(
                API_URL,
                headers=HEADERS,
                json={
                    "inputs": prompt,
                    "parameters": {
                        "seed": seed,
                        "num_inference_steps": 30,
                        "guidance_scale": 7.5
                    }
                }
            )

            print("Response status:", response.status_code)

            if response.status_code == 200:
                # Handle binary image data directly
                image_data = response.content
                image = Image.open(BytesIO(image_data))
                image = image.resize((250, 250))  # Resize if needed
                image_path = os.path.join(IMAGE_FOLDER, f"logo_{i + 1}.png")
                image.save(image_path, format="PNG")
                image_paths.append(f"logo_{i + 1}.png")
                print(f"Saved image {i + 1} at {image_path}")  # Debug
            else:
                print("API Error:", response.text)  # Print full error for debugging
                return jsonify({"error": f"Failed to generate image {i+1}: {response.text}"}), response.status_code

        return jsonify({"image_files": image_paths})

    except Exception as e:
        print("Exception occurred:", str(e))  # Debug
        return jsonify({"error": str(e)}), 500


@app.route("/download-logo/<image_name>", methods=["GET"])
def download_logo(image_name):
    try:
        image_path = os.path.join(IMAGE_FOLDER, image_name)
        if os.path.exists(image_path):
            return send_file(image_path, as_attachment=True)
        else:
            return jsonify({"error": "Image not found."}), 404
    except Exception as e:
        print("Exception during download:", str(e))  # Debug
        return jsonify({"error": str(e)}), 500


@app.route("/download-logo-pdf", methods=["GET"])
def download_logo_pdf():
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        y_position = 10  # Initial Y position
        for idx in range(3):
            image_path = os.path.join(IMAGE_FOLDER, f"logo_{idx + 1}.png")
            if os.path.exists(image_path):
                pdf.image(image_path, x=10, y=y_position, w=100)
                y_position += 70  # Space for next image

        pdf_output = BytesIO()
        pdf.output(pdf_output)
        pdf_output.seek(0)

        return send_file(pdf_output, as_attachment=True, download_name="logos.pdf", mimetype="application/pdf")

    except Exception as e:
        print("Exception during PDF generation:", str(e))  # Debug
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
