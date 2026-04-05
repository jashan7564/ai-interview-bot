# 🤖 AI Interview Bot

A smart AI-powered interview practice platform that helps users prepare for technical interviews by generating questions, analyzing answers, and providing real-time feedback.

---

## 🚀 Features

* 🧠 AI-generated interview questions
* ✍️ Real-time answer evaluation
* 📊 Feedback with score & improvement tips
* ⚡ Fast and responsive UI
* 🔌 Powered by OpenRouter API

---

## 🛠 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **AI API:** OpenRouter

---

## 📂 Project Structure

```
ai-interview-bot/
│
├── client/        # Frontend (UI)
│   └── index.html
│
├── server/        # Backend (API)
│   ├── server.js
│   └── .env
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/ai-interview-bot.git
cd ai-interview-bot
```

---

### 2. Install backend dependencies

```
cd server
npm install
```

---

### 3. Configure environment variables

Create a `.env` file inside the `server` folder:

```
OPENROUTER_API_KEY=your_api_key_here
```

> ⚠️ Never share your API key publicly

---

### 4. Run the server

```
node server.js
```

Server will start at:

```
http://localhost:3000
```

---

### 5. Run the frontend

Open:

```
client/index.html
```

in your browser
(or use Live Server extension in VS Code)

---

## 🧪 How It Works

1. User inputs an answer
2. Frontend sends request to backend
3. Backend calls OpenRouter AI API
4. AI analyzes response
5. Feedback is returned and displayed

---

## 🌐 Future Improvements

* 🎤 Voice-based interview system
* 👨‍💻 Multiple job roles (Frontend, Backend, AI)
* 🏆 Score tracking & leaderboard
* 🔐 User authentication system

---

## 📌 Disclaimer

This project uses third-party AI APIs. Ensure you follow API usage policies and keep your keys secure.

---

## 👨‍💻 Author

**Your Name**
GitHub: https://github.com/jashan7564

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!
