# LogocraftGenAI - AI-Powered Logo Generation✨

![Logocraft Demo GIF](https://your-link-to-a-demo-gif.com/demo.gif)

Logocraft is a generative AI application that empowers users to create unique, professional logos in seconds. By providing simple inputs like brand name, colors, and style, Logocraft intelligently crafts detailed prompts for a state-of-the-art text-to-image model to generate stunning logo variations.

---

## 📚 Table of Contents

* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [How It Works](#-how-it-works)
* [Setup and Installation](#-setup-and-installation)
* [Future Improvements](#-future-improvements)
* [Contact](#-contact)

---

## ✨ Features

* **Intuitive UI**: A clean, simple form built with React to capture user ideas effortlessly.
* **Dynamic Prompt Engineering**: The Flask backend intelligently combines user inputs into a rich, descriptive prompt tailored for logo generation.
* **State-of-the-Art AI**: Leverages a powerful Stable Diffusion model from Hugging Face to generate high-quality images.
* **Multiple Variations**: Produces up to four distinct logo options from a single request, giving users a range of choices.
* **Full-Stack Architecture**: Demonstrates a complete end-to-end application flow from a modern web frontend to a Python backend and AI model API.

---

## 🛠️ Tech Stack

* **Frontend**: React, CSS
* **Backend**: Flask (Python)
* **AI Model**: Hugging Face Inference API (`stabilityai/stable-diffusion-xl-base-1.0`)
* **API Communication**: REST API (Axios on frontend)

---

## 🌊 How It Works

The application follows a simple but powerful data flow from user idea to final logo:

1.  **User Input**: The user fills out the logo details (brand name, colors, elements, style, keywords) in the React frontend.
2.  **API Request**: The React app sends the form data as a POST request to the Flask backend server.
3.  **Prompt Crafting**: The Flask server receives the data and constructs a detailed prompt. For example:
    > *"A minimalist, modern logo for 'Logocraft', featuring a paintbrush and a circuit board. Primary colors: deep blue and vibrant orange. Clean lines, vector art, high resolution."*
4.  **Hugging Face Inference**: The backend sends this prompt to the Stable Diffusion model via the Hugging Face Inference API.
5.  **Image Generation**: The AI model generates four logo images based on the prompt.
6.  **Display Results**: The backend receives the image data (or URLs) and sends them back to the React frontend, which then displays the generated logos to the user.

---

## ⚙️ Setup and Installation

To run this project locally, you will need to set up both the backend and frontend services.

### Prerequisites

* Python
* Node.js and npm (or yarn)
* Git
* A Hugging Face account and API Token

### 1. Clone the Repository
```sh
git clone [https://github.com/Srinidhi945/LogoCraft_GenAI.git](https://github.com/Srinidhi945/LogoCraft_GenAI.git)
cd LogoCraft_GenAI
2. Backend Setup (Flask)
The backend server handles the logic and communication with the AI model.

Bash

# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies from requirements.txt
pip install -r requirements.txt

# Create a .env file for your API key
# IMPORTANT: Create a new file named .env in the /backend folder
# Add your Hugging Face API Token to it:
HUGGING_FACE_API_TOKEN="hf_YourSecretTokenHere"

# Start the Flask server
# It will typically run on [http://127.0.0.1:5000](http://127.0.0.1:5000)
python app.py
3. Frontend Setup (React)
The frontend provides the user interface.

Bash

# Open a new terminal window
# Navigate to the frontend directory from the root folder
cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
# It will typically run on http://localhost:3000
npm start
4. Usage
Once both servers are running:

Open your web browser and go to http://localhost:3000.

Fill in the details for the logo you want to create.

Click "Generate" and wait for the logos to appear!

🚀 Future Improvements
User Accounts: Allow users to sign up and save their generated logos.

Higher Resolution: Add an option to upscale a chosen logo to a higher resolution.

More Model Choices: Integrate different text-to-image models to offer a variety of artistic styles.

Interactive Editing: Allow users to make minor edits (e.g., change text position) on a generated logo.

📞 Contact
LinkedIn Profile: www.linkedin.com/in/srinidhi-poreddy

Project Link: https://github.com/Srinidhi945/LogoCraft_GenAI
