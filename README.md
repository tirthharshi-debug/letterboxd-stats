# CineStats — Letterboxd Analytics Dashboard

> Analyze your Letterboxd export with comprehensive TMDB-enriched statistics and beautiful charts.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- TMDB API key (already in `.env`)

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the app

Visit **http://localhost:5173** → Upload your Letterboxd ZIP → View your analytics dashboard.

> **Export your data:** [Letterboxd Settings → Import & Export](https://letterboxd.com/settings/data/)

---

## Architecture

```
A_Project/
├── .env                    # TMDB_API_KEY (never committed)
├── backend/
│   ├── requirements.txt
│   ├── tmdb_cache.db       # Auto-created SQLite cache
│   ├── uploads/            # Temporary ZIP extraction
│   └── app/
│       ├── main.py         # FastAPI entry point + CORS
│       ├── routes/api.py   # /upload, /progress, /health, /cache-stats
│       ├── services/
│       │   ├── file_service.py   # ZIP + CSV parsing
│       │   ├── tmdb_service.py   # TMDB API with rate limiting
│       │   ├── stats_service.py  # All analytics computations
│       │   └── cache_service.py  # SQLite cache wrapper
│       ├── database/db.py  # SQLite schema + operations
│       └── models/
└── frontend/               # React + Vite + TailwindCSS
    └── src/
        ├── components/
        │   ├── UploadPage.jsx
        │   ├── Dashboard.jsx
        │   ├── Charts.jsx
        │   └── HeatmapCalendar.jsx
        └── services/api.js
```

## Analytics Included

| Tier | Stats |
|------|-------|
| **Basic** | Total films, diary entries, rewatches, avg rating, rating distribution, films/year, activity |
| **Pro** | Decade breakdown, streaks, rating trend, avg rating/year, highest/lowest rated year |
| **Patron** | Genre/Director/Actor/Runtime/Country/Language analytics (powered by TMDB) |
| **Advanced** | Taste profile, heatmap calendar, rating bias, genre combos, year-rating correlation |

## Security

- API key loaded from `.env` via `python-dotenv`
- All TMDB calls are server-side only
- API key is never exposed to the frontend

## Future Scaling Ideas

- **WebSocket** for real-time enrichment progress
- **Background workers** (Celery/RQ) for async TMDB fetching
- **Export** dashboard as PDF/PNG
- **Comparison mode** between users
- **Film recommendations** based on taste profile
