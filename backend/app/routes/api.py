"""
API routes for the Letterboxd analytics application.
Uses background processing to avoid HTTP timeouts during TMDB enrichment.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import asyncio
import traceback
import os
import shutil

from app.services.file_service import (
    extract_zip, parse_diary, parse_ratings, parse_watched,
    parse_watchlist, parse_lists, get_unique_movies
)
from app.services.tmdb_service import TMDBService
from app.services.stats_service import (
    compute_basic_stats, compute_pro_stats,
    compute_patron_stats, compute_advanced_stats,
    compute_community_comparison, compute_binge_stats,
    compute_monthly_activity, compute_decade_leaderboard
)
from app.services.cache_service import stats as cache_stats

router = APIRouter()

# ─── In-memory state for background processing ───
_state = {
    "status": "idle",       # idle | extracting | parsing | enriching | computing | done | error
    "current": 0,
    "total": 0,
    "result": None,
    "error": None,
    "basic_stats": None,    # Available early (before TMDB)
    "pro_stats": None,      # Available early (before TMDB)
}


def _reset_state():
    _state.update({
        "status": "idle",
        "current": 0,
        "total": 0,
        "result": None,
        "error": None,
        "basic_stats": None,
        "pro_stats": None,
    })


async def _process_in_background(file_bytes: bytes):
    """Run the full pipeline in the background."""
    extract_path = None
    try:
        _state["status"] = "extracting"

        # 1. Extract ZIP
        extract_path = extract_zip(file_bytes)

        _state["status"] = "parsing"

        # 2. Parse CSVs
        diary_df = parse_diary(extract_path)
        ratings_df = parse_ratings(extract_path)
        watched_df = parse_watched(extract_path)
        watchlist_df = parse_watchlist(extract_path)
        lists_data = parse_lists(extract_path)

        # 3. Compute basic + pro stats immediately (no TMDB needed)
        basic_stats = compute_basic_stats(diary_df, ratings_df, watched_df)
        pro_stats = compute_pro_stats(diary_df, ratings_df)

        # Make these available for early display while TMDB enrichment runs
        _state["basic_stats"] = basic_stats
        _state["pro_stats"] = pro_stats

        # 4. Get unique movies for TMDB enrichment
        unique_movies = get_unique_movies(diary_df, watched_df, ratings_df)
        _state["total"] = len(unique_movies)
        _state["status"] = "enriching"

        # 5. Enrich movies via TMDB (this is the slow part)
        tmdb_service = TMDBService()

        async def update_progress(current: int, total: int):
            _state["current"] = current
            _state["total"] = total

        try:
            enriched = await tmdb_service.enrich_batch(unique_movies, update_progress)
        finally:
            await tmdb_service.close()

        _state["status"] = "computing"

        # 6. Compute patron + advanced stats
        patron_stats = compute_patron_stats(enriched, diary_df, ratings_df)
        advanced_stats = compute_advanced_stats(enriched, diary_df, ratings_df)

        # 7. New feature stats
        community_comparison = compute_community_comparison(enriched, ratings_df)
        binge_stats = compute_binge_stats(diary_df)
        monthly_activity = compute_monthly_activity(enriched, diary_df)
        decade_leaderboard = compute_decade_leaderboard(
            enriched, pro_stats.get("_decade_ratings", {})
        )

        _state["status"] = "done"
        _state["result"] = {
            "success": True,
            "stats": {
                "basic": basic_stats,
                "pro": pro_stats,
                "patron": patron_stats,
                "advanced": advanced_stats,
                "community_comparison": community_comparison,
                "binge_stats": binge_stats,
                "monthly_activity": monthly_activity,
                "decade_leaderboard": decade_leaderboard,
            },
            "meta": {
                "total_unique_movies": len(unique_movies),
                "enriched_count": len([m for m in enriched if m.get("tmdb")]),
                "diary_entries": len(diary_df),
                "rated_films": len(ratings_df),
                "watched_films": len(watched_df),
                "lists_count": len(lists_data),
            }
        }

    except Exception as e:
        _state["status"] = "error"
        _state["error"] = str(e)
        traceback.print_exc()

    finally:
        # Clean up extracted files to prevent disk usage growth
        if extract_path and os.path.isdir(extract_path):
            shutil.rmtree(extract_path, ignore_errors=True)


@router.post("/upload")
async def upload_zip(file: UploadFile = File(...)):
    """
    Upload a Letterboxd export ZIP. Kicks off background processing
    and returns immediately. Poll /progress for status, /results for data.
    """
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Please upload a .zip file")

    if _state["status"] not in ("idle", "done", "error"):
        raise HTTPException(status_code=409, detail="A file is already being processed")

    _reset_state()

    contents = await file.read()

    # Fire and forget — runs in the background
    asyncio.create_task(_process_in_background(contents))

    return {"success": True, "message": "Processing started"}


@router.get("/progress")
async def get_progress():
    """Get current processing progress. Returns early stats when available."""
    resp = {
        "status": _state["status"],
        "current": _state["current"],
        "total": _state["total"],
    }
    if _state["error"]:
        resp["error"] = _state["error"]
    # Include early stats so frontend can show something while TMDB runs
    if _state["basic_stats"]:
        resp["basic_stats"] = _state["basic_stats"]
    if _state["pro_stats"]:
        resp["pro_stats"] = _state["pro_stats"]
    return resp


@router.get("/results")
async def get_results():
    """Fetch the final computed analytics. Only available after status=done."""
    if _state["status"] == "done" and _state["result"]:
        return _state["result"]
    elif _state["status"] == "error":
        raise HTTPException(status_code=500, detail=_state.get("error", "Processing failed"))
    else:
        raise HTTPException(status_code=202, detail="Still processing")


@router.get("/cache-stats")
async def get_cache_stats():
    """Get TMDB cache statistics."""
    return await cache_stats()


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@router.get("/export/pdf")
async def export_pdf():
    """Generate and download a CineStats PDF summary."""
    if _state["status"] != "done" or not _state["result"]:
        raise HTTPException(status_code=400, detail="No analysis data available. Upload and process a file first.")

    from app.services.export_service import generate_pdf
    pdf_buffer = generate_pdf(_state["result"])

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=CineStats_Report.pdf"}
    )
