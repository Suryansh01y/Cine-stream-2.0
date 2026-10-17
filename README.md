# 🎬 Cine-Stream Media Explorer

Cine-Stream Media Explorer is a React-based Single Page Application (SPA) for discovering and searching movies using the TMDB REST API.

The application provides a Netflix-like movie discovery experience with popular movies, debounced search, infinite scrolling, favorites persistence, lazy-loaded images, and an AI-powered Mood Matcher.

---

## 🚀 Features

- 🎬 Browse popular movies from TMDB
- 🔎 Search movies using the TMDB Search API
- ⏱️ 500ms search input debouncing
- ♾️ Infinite scrolling using `IntersectionObserver`
- ❤️ Add and remove movies from Favorites
- 💾 Persist favorites using browser `localStorage`
- 📁 Dedicated `/favorites` route
- 🖼️ Lazy loading for movie poster images
- ⏳ Loading states
- 📭 Empty states
- ⚠️ API error handling
- 🤖 AI Mood Matcher using Google Gemini
- 📱 Responsive design for different screen sizes

---

## Links

- **Frontend Repository:** https://github.com/Suryansh01y/Cine-stream-2.0
- **Backend Repository:** https://github.com/Suryansh01y/cine-stream-2.0-API
- **Live Application:** https://cine-stream-2-0.vercel.app/
- **Backend API:**  https://cine-stream-2-0-api.onrender.com
-- **Video:** https://drive.google.com/drive/folders/13y59ZjZU_pn_lZDy5C12zTnJaH3DOMRh?usp=sharing



---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- React Router

### APIs & Browser APIs

- TMDB REST API
- Google Gemini API
- IntersectionObserver API
- Browser localStorage

---

## 📂 Project Structure

```text
cine-stream-media-explorer/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── EmptyState.jsx
│   │   ├── Header.jsx
│   │   ├── Loader.jsx
│   │   ├── MoodMatcher.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── hooks/
│   │   └── useDebounce.js
│   │
│   ├── pages/
│   │   ├── Favorites.jsx
│   │   └── Home.jsx
│   │
│   ├── services/
│   │   ├── ai.js
│   │   └── tmdb.js
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── utils/
│   │   └── storage.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── prompts.md
└── README.md