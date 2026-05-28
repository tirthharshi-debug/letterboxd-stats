# 🎬 Letterboxd Stats

A cinematic Letterboxd analytics dashboard built with React, Vite, and Python.

Analyze your Letterboxd export and discover detailed insights about your movie-watching habits, ratings, monthly activity, favorites, genres, watch streaks, and more.

> This project is currently in an early/basic version. More advanced analytics, animations, social features, and wrapped-style storytelling will be added over time.

---

## ✨ Features

* 📊 Detailed movie statistics
* 🎞️ Monthly film strip view
* 🔥 Watch activity heatmap
* ⭐ Ratings analysis
* 📈 Watching trends
* 🎭 Genre insights
* 🧠 Personalized analytics
* ⚡ Fast React + Vite frontend
* 🐍 Python backend processing
* 🎬 Cinematic UI inspired by film culture

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Python
* Flask/FastAPI
* CSV processing

### APIs

* TMDB API

---

# 📦 How To Download Your Letterboxd Data

1. Open Letterboxd
2. Go to:

   ```bash
   Settings → Data → Import Your Data 
   ```
   Or directly visit:

   https://letterboxd.com/data/export/

3. Click:

   ```bash
   Export Your Data
   ```
4. Letterboxd will prepare a ZIP file
5. Download the ZIP
6. Upload it into this app

The app automatically processes:

* diary.csv
* watched.csv
* ratings.csv
* reviews.csv
* and other export files

---

## 🚀 Local Setup

Clone the repository:

```bash
git clone https://github.com/tirthharshi-debug/letterboxd-stats.git
```

Move into the project folder:

```bash
cd letterboxd-stats
```

---

## 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔹 Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app/main.py
```

---

## ⚠️ Environment Variables

Create a `.env` file in the root directory:

```env
TMDB_API_KEY=your_api_key_here
```

---

## 📌 Current Status

This is currently the first public/basic version of the project.

Planned future improvements:

* 🎬 Better cinematic UI/UX
* 📱 Improved mobile experience
* 📤 Shareable wrapped cards
* 🌍 Public profile analysis
* 🤝 Social comparison features
* 📊 Advanced recommendation engine
* ⚡ Faster processing and caching
* 🎨 Improved animations and transitions

---

## 📸 Screenshots

Screenshots and demo previews will be added soon.

---

## 🌐 Live Demo

Coming soon.

---

## 🤝 Contributions

Suggestions, feedback, and contributions are welcome.

---

## ⭐ Support

If you like the project, consider starring the repository.
