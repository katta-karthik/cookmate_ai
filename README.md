# 🍳 CookMate AI - Intelligent Kitchen Assistant

![CookMate AI Banner](https://img.shields.io/badge/CookMate-AI-orange?style=for-the-badge&logo=chef)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat&logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat&logo=javascript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)
![PyTorch](https://img.shields.io/badge/PyTorch-Qwen_VL-EE4C2C?style=flat&logo=pytorch)

**CookMate AI** is a next-generation, hybrid web application designed to be your smart cooking companion. Unlike traditional recipe apps, CookMate leverages **Vision-Language Models (VLM)** to *see* your ingredients and guide you through the cooking process with real-time feedback.

---

## 🚀 Key Features

### 👁️ AI-Powered Vision
- **Ingredient Recognition**: Takes a photo of your countertop and uses the **Qwen2.5-VL** model (running on Google Colab) to identify ingredients with high accuracy, establishing a connection via **Ngrok**.
- **Cooking Stage Analysis**: Uses a local, real-time color analysis algorithm to detect if your food is **Raw**, **Cooking**, **Done**, or **Burnt**.

### 👨‍🍳 Smart Assistance
- **Recipe Generation**: Suggests recipes based *only* on the ingredients you have.
- **Voice Control**: Hands-free operation! Say *"Next step"*, *"Repeat"*, or *"Start timer"* while your hands are messy.
- **Step-by-Step Guidance**: Interactive cooking mode that reads instructions aloud.

### 🎮 Gamified Experience
- **Achievements**: Unlock badges like "Master Chef" or "Speed Cook" as you use the app.
- **Stats Tracking**: Keeps track of meals cooked, time spent, and recipes mastered.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **HTML5 & Vanilla JavaScript (ES6+)**: Lightweight, fast, and runs directly in the browser.
- **Tailwind CSS v4**: Modern, responsive styling with glassmorphism effects.
- **Web APIs**: Uses `SpeechSynthesis` (TTS), `SpeechRecognition` (STT), and `MediaDevices` (Camera).

### Backend (AI Server)
- **Google Colab (Free Tier)**: Hosts the heavy AI model.
- **Python & PyTorch**: Runs the inference engine.
- **Qwen2.5-VL-3B**: A state-of-the-art Vision-Language model for image understanding.
- **Flask & Ngrok**: Exposes the Colab environment as a secure public API endpoint.

---

## ⚙️ Installation & Setup

This project uses a **Hybrid Architecture**. The frontend runs locally on your machine, while the AI runs on Google Colab.

### 1. 🧠 Start the AI Brain (Google Colab)
Since the AI model requires a GPU, we run it on Google Colab.

1.  Open the `model.ipynb` file in this repository.
2.  Upload it to [Google Colab](https://colab.research.google.com/).
3.  **Runtime** > **Change runtime type** > Select **T4 GPU**.
4.  Run all cells.
5.  Copy the **Ngrok URL** generated in the last cell (e.g., `https://xxxx-xx-xx-xx-xx.ngrok-free.app`).

### 2. 💻 Run the Frontend (Local)
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/cookmate-ai.git
    cd cookmate-ai
    ```
2.  Open `index.html` in your browser.
    - *Recommended*: Use a simple local server extension (like Live Server in VS Code) or Python:
    ```bash
    python -m http.server 8000
    ```
    Then visit `http://localhost:8000`.

### 3. 🔗 Connect Them
1.  In the CookMate web app, click the **Settings (⚙️)** icon.
2.  Paste your **Ngrok URL** into the "AI Connection URL" field.
3.  The status indicator should turn **Green (AI Ready)**.

---

## 📂 Project Structure

```bash
CookMate-AI/
├── assets/                 # Static assets (images, icons)
├── src/
│   ├── ai/                 # AI Logic
│   │   ├── analyzer.js     # Local color analysis algorithm
│   │   ├── detection.js    # Remote API communication
│   │   └── loader.js       # Model connection status
│   ├── features/           # App Features
│   │   ├── camera.js       # Webcam handling & image capture
│   │   ├── cooking.js      # Recipe step logic
│   │   ├── voice.js        # Speech recognition & synthesis
│   │   └── storage.js      # LocalStorage management
│   ├── data/
│   │   └── recipes.js      # JSON Recipe Database
│   ├── config.js           # Global app configuration
│   └── app.js              # Main entry point & initialization
├── model.ipynb             # Python Notebook for Colab (The Brain)
├── index.html              # Main Application File
└── README.md               # You are here!
```

---

## 📸 Usage Guide

1.  **Dashboard**: Upload an image or start the camera to scan your ingredients.
2.  **Detection**: The AI will list found ingredients (e.g., "Tomato, Onion, Garlic").
3.  **Recipes**: Click on a suggested recipe based on your ingredients.
4.  **Cooking Mode**: Follow the large step-by-step display.
    - *Voice Commands*: "Hey Chef (wait for beep)... Next Step".
5.  **Monitor**: Point the camera at your pan to see if it's "Cooking" or "Done".

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Qwen Team** for the incredible Qwen2.5-VL model.
- **Tailwind Labs** for the CSS framework.
- **Google Colab** for providing free GPU resources.

---

<p align="center">Made with ❤️ by [Your Name]</p>
