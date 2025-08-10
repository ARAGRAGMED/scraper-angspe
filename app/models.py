from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class Publication(BaseModel):
    title: str
    download_url: str
    file_size: str
    date_posted: str
    category: str
    file_type: str

class LatestPublication(BaseModel):
    title: str
    download_url: str
    file_size: str
    date_posted: str
    category: str
    file_type: str

class Analysis(BaseModel):
    total_publications: int
    categories: Dict[str, int]
    file_types: Dict[str, int]
    publications_by_year: Dict[str, int]
    average_file_size: str
    latest_publication: LatestPublication
    publications_list: List[Publication]

class Status(BaseModel):
    status: str
    timestamp: str
    last_scrape: str
    data_freshness: str
    total_publications: int
    version: str
    uptime: str
