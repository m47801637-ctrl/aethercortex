# ⚡ Aether Cortex —add your free NVIDA NIM API key and run the world's prowerful AI Models

A modern, highly responsive AI Web Client designed to deliver a smooth chat experience with advanced features like **live streaming, document parsing (PDF/DOCX), voice input, global memory, and interactive code sandboxing**.

![Aether Cortex UI](https://img.shields.io/badge/UI-Gemini--Styled-4285F4?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## ✨ Features

* **📄 Document Analysis (PDF & DOCX):** Drag/attach `.pdf`, `.docx`, `.txt`, or code files. It extracts text on the frontend using `pdf.js` & `mammoth.js` and feeds it straight to the AI.
* **⚡ Live Response Streaming:** Real-time token streaming powered by Server-Sent Events (SSE).
* **🧠 Deep Workspace Memory:** Enables cross-chat contextual understanding across conversations.
* **🎭 Custom Personas:** Switch between General Assistant, Code Architect, Content Writer, and Logic Solver.
* **💻 Interactive Code Playground:** Execute HTML/JS code snippets directly inside an isolated iframe sandbox.
* **🎤 Voice-to-Text & Speech Synthesis:** Speak your prompt directly and listen to the AI responses.
* **🎨 Reasoning Accordion:** Automatically separates `<think>` reasoning tags for models like `DeepSeek R1`.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Gemini Dark Theme), Modern JavaScript (ES6+)
* **Libraries:** 
  * [PDF.js](https://mozilla.github.io/pdf.js/) (PDF Text Extraction)
  * [Mammoth.js](https://github.com/mwilliamson/mammoth.js) (Word DOCX Parser)
  * [Marked.js](https://marked.js.org/) (Markdown Parser)
  * [Highlight.js](https://highlightjs.org/) (Code Syntax Highlighting)
* **Backend / Serverless:** Vercel Node.js Serverless Function (`api/chat.js`)
* **AI Provider:** NVIDIA NIM API (DeepSeek R1, Llama 3.3 70B, Nemotron)

---

## 📁 Project Structure

```text
aether-cortex/
├── api/
│   └── chat.js          # Vercel Serverless Function (Handles NVIDIA Streaming API)
├── public/
│   └── index.html       # Single Page Application Frontend
├── package.json         # Dependencies & Config
├── vercel.json          # Route Rewrites & Vercel Deployment Rules
└── README.md            # Project Documentation
```
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

Git

NVIDIA NIM API Key (or OpenRouter/OpenAI compatible endpoint)

Local Development Setup
Clone the repository:

Bash
git clone [https://github.com/YOUR_USERNAME/aether-cortex.git](https://github.com/YOUR_USERNAME/aether-cortex.git)
cd aether-cortex
Install dependencies:

Bash
npm install
Run locally (using Vercel CLI):

Bash
npx vercel dev
Open http://localhost:3000 in your browser.

🌐 Deploy to Vercel
Push your code to GitHub:

Bash
git add .
git commit -m "Deploying to Vercel"
git push -u origin main
Go to Vercel Dashboard and click "Add New Project".

Import your GitHub repository.

Leave Framework Preset as Other and hit Deploy.

🔑 How to Use
Launch the Web App.

Enter a temporary Username to create your local session.

In the sidebar, paste your NVIDIA API Key (nvapi-...).

Select your preferred model (e.g., DeepSeek R1 or Llama 3.3 70B).

Upload a document (PDF/Word) or start typing your prompt!

📝 License
Distributed under the MIT License. See LICENSE for more information.
