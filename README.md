# 🎬 CineStats

A cinematic Letterboxd analytics dashboard built with React, Vite, FastAPI, and TMDB.

Analyze your Letterboxd export and discover detailed insights about your movie-watching habits, ratings, genres, monthly activity, favorites, and more.

> This project is currently in an early/basic version. More advanced analytics, animations, social features, and wrapped-style storytelling will be added over time.

🌐 Live Demo: https://cinestats.vercel.app/

---

# ✨ Features

* 📊 Detailed movie analytics
* 🎞️ Monthly film strip view
* 🔥 Watch activity heatmap
* ⭐ Ratings analysis
* 🎭 Genre insights
* 📈 Viewing trends
* ⚡ Fast React + FastAPI architecture
* 🎬 Cinematic UI inspired by film culture

---

# 📸 Screenshots

<img width="867" height="432" alt="image" src="https://github.com/user-attachments/assets/ed9fd977-6fe6-45f9-8316-3c02c9e88498" />

<img width="1917" height="897" alt="image" src="https://github.com/user-attachments/assets/212694ad-df82-4f09-bc64-b578aa47a684" />

<img width="1911" height="843" alt="image" src="https://github.com/user-attachments/assets/4a8aff1f-a77a-4683-8977-a20ab7077700" />

<img width="1903" height="842" alt="image" src="https://github.com/user-attachments/assets/a0d7aadf-2d37-499b-a3c1-3130ca1eccd7" />




---

# 📦 How To Download Your Letterboxd Data

1. Open Letterboxd
2. Visit:
   https://letterboxd.com/data/export/
3. Export your data ZIP
4. Upload it into CineStats

The app automatically processes:

* diary.csv
* watched.csv
* ratings.csv
* reviews.csv
* and more

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* CSS

## Backend

* FastAPI
* Python

## APIs

* TMDB API

---

# 🚀 Local Setup

Clone repository:

```bash
git clone https://github.com/tirthharshi-debug/letterboxd-stats.git
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

# ⚠️ Environment Variables

Create `.env` inside backend:

```env
TMDB_API_KEY=your_api_key
```

---

# 📌 Current Status

CineStats is currently in its early version.

Planned future improvements:

* 🎬 Better cinematic UI/UX
* 📱 Improved mobile experience
* 📤 Shareable wrapped cards
* ⚡ Faster processing
* 🌍 Public profile analysis
* 🎨 Improved animations

---

# ⭐ Support

If you like the project, consider starring the repository.


## 🤝 Contributions

Suggestions, feedback, and contributions are welcome.
