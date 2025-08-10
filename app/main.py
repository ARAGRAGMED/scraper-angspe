from fastapi import FastAPI, Request, BackgroundTasks, HTTPException, Depends, Header
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
from datetime import datetime, timezone
import os
import subprocess
import sys
import json


from app.models import Analysis, Status

# API Key for authentication (in production, use environment variables)
API_KEY = os.getenv("ANGSPE_API_KEY", "angspe_refresh_2025")



def verify_api_key(x_api_key: str = Header(None)):
    """Verify the API key for protected endpoints"""
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key. Use X-API-Key header."
        )
    return x_api_key

# Create FastAPI app
app = FastAPI(
    title="ANGSPE Publications API",
    description="API for ANGSPE publications data",
    version="1.0.0"
)

# Setup templates and static files
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Main page with publications table"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/publications")
async def get_publications():
    """Get all publications data"""
    try:
        # Get the project root directory
        project_root = Path(__file__).parent.parent
        data_path = project_root / "data" / "angspe_publications_2025.json"
        
        if not data_path.exists():
            raise HTTPException(status_code=404, detail="Publications data not found")
        
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get('publications', [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading publications: {str(e)}")

@app.get("/api/analysis")
async def get_analysis():
    """Get publications analysis data"""
    try:
        # Get the project root directory
        project_root = Path(__file__).parent.parent
        data_path = project_root / "data" / "angspe_publications_2025.json"
        
        if not data_path.exists():
            raise HTTPException(status_code=404, detail="Analysis data not found")
        
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get('analysis', {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading analysis: {str(e)}")

@app.get("/api/status")
async def get_status():
    """Get application status and data freshness"""
    try:
        # Get the project root directory
        project_root = Path(__file__).parent.parent
        data_path = project_root / "data" / "angspe_publications_2025.json"
        
        if not data_path.exists():
            raise HTTPException(status_code=404, detail="Status data not found")
        
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Calculate data freshness
        scraped_at = data.get('scraped_at', '')
        total_publications = data.get('total_unique_publications', 0)
        
        # Check for cron job status
        cron_status_path = project_root / "data" / "cron_status.json"
        cron_error_path = project_root / "data" / "cron_error.json"
        
        cron_info = {}
        if cron_status_path.exists():
            try:
                with open(cron_status_path, 'r', encoding='utf-8') as f:
                    cron_info = json.load(f)
            except:
                pass
        
        if cron_error_path.exists():
            try:
                with open(cron_error_path, 'r', encoding='utf-8') as f:
                    cron_error = json.load(f)
                    cron_info['last_error'] = cron_error
            except:
                pass
        
        status_info = {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "last_scrape": scraped_at,
            "last_cron_run": cron_info.get('last_cron_run'),
            "cron_status": cron_info.get('status'),
            "data_freshness": "current",
            "total_publications": total_publications,
            "version": "1.0.0",
            "uptime": "running",
            "automation": "Vercel Cron Job (daily at 6:00 AM UTC)"
        }
        
        return status_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading status: {str(e)}")







@app.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy"}

@app.post("/refresh")
async def refresh_data(background_tasks: BackgroundTasks, api_key: str = Depends(verify_api_key)):
    """Trigger a fresh data scrape from ANGSPE (requires API key)"""
    try:
        # Run the scraper in the background
        background_tasks.add_task(run_scraper)
        
        return JSONResponse(
            content={
                "status": "success",
                "message": "Data refresh started in background",
                "note": "Data will be updated in the background. Check /api/status for latest data freshness.",
                "started_at": datetime.now(timezone.utc).isoformat(),
                "estimated_completion": "10-30 seconds"
            },
            status_code=202
        )
    except Exception as e:
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Failed to start refresh: {str(e)}"
            },
            status_code=500
        )

def run_scraper():
    """Run the scraper script to get fresh data"""
    try:
        # Get the project root directory
        project_root = Path(__file__).parent.parent
        scraper_path = project_root / "scraper.py"
        
        # Run the scraper
        result = subprocess.run(
            [sys.executable, str(scraper_path)],
            capture_output=True,
            text=True,
            cwd=str(project_root)
        )
        
        if result.returncode == 0:
            print(f"✅ Scraper completed successfully")
            print(f"📊 Output: {result.stdout}")
        else:
            print(f"❌ Scraper failed with return code {result.returncode}")
            print(f"🔴 Error: {result.stderr}")
            
    except Exception as e:
        print(f"💥 Error running scraper: {e}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Not found", "message": "The requested resource was not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": "Something went wrong"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
