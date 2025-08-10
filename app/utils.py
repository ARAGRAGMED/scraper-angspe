import json
import os
from datetime import datetime, timezone
from pathlib import Path

def load_json_data(filename: str) -> dict:
    """Load JSON data from the data directory"""
    data_path = Path("data") / filename
    if data_path.exists():
        with open(data_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def get_data_freshness() -> str:
    """Calculate how fresh the data is"""
    analysis_path = Path("data") / "angspe_analysis_2025.json"
    if not analysis_path.exists():
        return "No data available"
    
    # Get file modification time
    mtime = analysis_path.stat().st_mtime
    file_time = datetime.fromtimestamp(mtime, tz=timezone.utc)
    now = datetime.now(timezone.utc)
    
    diff = now - file_time
    hours = diff.total_seconds() / 3600
    
    if hours < 1:
        minutes = int(diff.total_seconds() / 60)
        return f"{minutes} minutes ago"
    elif hours < 24:
        return f"{int(hours)} hours ago"
    else:
        days = int(hours / 24)
        return f"{days} days ago"

def get_uptime() -> str:
    """Get application uptime (simplified for Vercel)"""
    return "Running on Vercel"

def get_status_data() -> dict:
    """Generate status data for the status endpoint"""
    analysis = load_json_data("angspe_analysis_2025.json")
    
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "last_scrape": get_data_freshness(),
        "data_freshness": get_data_freshness(),
        "total_publications": analysis.get("total_publications", 0),
        "version": "1.0.0",
        "uptime": get_uptime()
    }
