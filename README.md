## LogocraftGenAI - AI-Powered Logo Generation✨

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

Follow these steps sequentially to get the project running locally.

>Prerequisites
* Python
* Node.js and npm (or yarn)
* Git
* A Hugging Face account and API Token

>Step 1: Clone the Repository

git clone [https://github.com/Srinidhi945/LogoCraft_GenAI.git](https://github.com/Srinidhi945/LogoCraft_GenAI.git)
cd LogoCraft_GenAI

>Step 2: Set Up Python Environment and Dependencies
This installs the necessary packages for the Flask backend.

 >Navigate to the backend directory
cd backend

 >Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

>Install Python dependencies
pip install -r requirements.txt

>Step 3: Configure API Keys
You need to provide your Hugging Face API key for the AI model to work.

While still in the /backend directory, create a new file named .env.

Open the .env file and add your token in the following format:
HUGGING_FACE_API_TOKEN="hf_YourSecretTokenHere"
Important: The .gitignore file should already be configured to ignore .env, but always ensure your keys are not committed to Git.

>Step 4: Set Up Node Environment
This installs the packages for the React frontend. Open a new terminal window and navigate to the project's root directory again.

>In your new terminal, navigate to the frontend directory
cd path/to/your/LogoCraft_GenAI/frontend

>Install Node.js dependencies
npm install

>Step 5: Run the Application
You need to have both terminals open to run the full application.

In your first terminal (for the Backend):
# Make sure you are in the /backend directory and your virtual environment is active
python app.py
The backend server will start, typically on http://127.0.0.1:5000.

In your second terminal (for the Frontend):
# Make sure you are in the /frontend directory
npm start
The frontend development server will start and should open a new browser tab.

>Step 6: View the App
Open your web browser and navigate to http://localhost:3000 to use Logocraft.
---

## Future Improvements

* **User Accounts**: Allow users to sign up and save their generated logos.
* **Higher Resolution**: Add an option to upscale a chosen logo to a higher resolution.
* **More Model Choices**: Integrate different text-to-image models to offer a variety of artistic styles.
* **Interactive Editing**: Allow users to make minor edits (e.g., change text position) on a generated logo.

---

## 📞 Contact

* **LinkedIn Profile**: [www.linkedin.com/in/srinidhi-poreddy](https://www.linkedin.com/in/srinidhi-poreddy)
* **Project Link**: [https://github.com/Srinidhi945/LogoCraft_GenAI](https://github.com/Srinidhi945/LogoCraft_GenAI)
