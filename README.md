# 🎵 Song Recommendation App

A web application that provides personalized song recommendations using OpenAI's API, built with Tailwind CSS and JavaScript.

![App Screenshot](./public/how-it-works.png)

## 🚀 Quick Start

1. Clone the repository

```bash
git clone https://github.com/your-username/song-recommendation-app.git
cd song-recommendation-app
```

2. Install dependencies

```bash
npm install
```

3. Configure environment

```bash
# Add your OpenAI API key to .env file
VITE_OPENAI_API_KEY=your-api-key-here
```

4. Start the server

```bash
node server/server.js
```

5. In a new terminal, start the client

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- Frontend: HTML5, Tailwind CSS, JavaScript
- API: OpenAI GPT
- Build Tools: Vite, npm

## 📁 Project Structure

```
song-recommendation-app/
├── dist/           # Compiled assets
├── src/
│   ├── input.css   # Tailwind input
│   └── main.js     # Core logic
├── index.html      # Entry point
└── config files    # Various configurations
```

## 💡 How to Use

1. Enter your favorite songs in the input field
2. Click "Get Recommendations"
3. Wait for AI to generate personalized suggestions
4. Explore your new song recommendations

---
