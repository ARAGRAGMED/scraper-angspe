# ANGSPE Publications Scraper & Web API

This project scrapes and analyzes publications from the ANGSPE (Agence Nationale de Gestion Stratégique des Participations de l'État) publications page at [https://angspe.ma/les-publications](https://angspe.ma/les-publications) and provides a modern web API and interface.

## About ANGSPE

ANGSPE is the National Agency for Strategic Management of State Participations and Performance Monitoring of Public Establishments and Enterprises in Morocco.

## 🚀 New Features

### **FastAPI Web Application**
- **Modern Web Interface**: Beautiful, responsive dashboard with real-time updates
- **RESTful API**: Easy access to scraped data with comprehensive endpoints
- **Real-time Status**: System health monitoring and data freshness tracking
- **Search & Filter**: Interactive publications table with advanced filtering
- **Data Refresh**: One-click data refresh with background processing
- **API Documentation**: Built-in Swagger UI and ReDoc documentation

### **API Endpoints**
- `GET /` - Main web dashboard
- `GET /api/publications` - Publications data (JSON)
- `GET /api/analysis` - Analysis summary (JSON)
- `GET /api/status` - System status & health (JSON)
- `GET /health` - Simple health check
- `POST /refresh` - Trigger data refresh (requires API key)
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

### **Data Refresh System**
- **Background Processing**: Non-blocking data updates
- **Real-time Status**: Live monitoring of refresh progress
- **Intelligent Polling**: Automatic detection of completion
- **Error Handling**: Comprehensive error reporting and recovery
- **API Key Protection**: Secure refresh endpoint access

## Scraping Results

### Summary Statistics
- **Total Publications**: 2 (duplicates removed)
- **Average File Size**: 4.32 MB
- **Publication Year**: All from 2025
- **File Format**: All PDF documents
- **Last Updated**: Real-time timestamp tracking

### Publications by Category
- **Rapport d'activités** (Activity Reports): 1 publication
- **Autres rapports** (Other Reports): 1 publication

### Latest Publication
**Rapport sur l'État actionnaire 2023 - 2024**
- Date: June 26, 2025
- Size: 6.92 Mo
- Category: Activity Report
- [Download Link](https://api.angspe.ma/uploads/RA_ANGSPE_A4_VF_2_075083f4569.pdf)

## Complete Publications List

### 1. Rapport sur l'État actionnaire 2023 - 2024
- **Date Posted**: 26/06/2025
- **Category**: Rapport d'activités
- **File Size**: 6.92 Mo (6.92 MB)
- **File Type**: PDF
- **Download URL**: https://api.angspe.ma/uploads/RA_ANGSPE_A4_VF_2_075083f4569.pdf

### 2. Charte de gouvernance pour les EEP
- **Date Posted**: 22/05/2025
- **Category**: Autres rapports
- **File Size**: 1755 ko (1.71 MB)
- **File Type**: PDF
- **Download URL**: https://api.angspe.ma/uploads/Charte_Gouvernance_EEP_ANGSPE_VDEF_QR_a6ff5f4569.pdf

## 🏗️ Project Structure

```
scrap-angspe/
├── app/                    # FastAPI application
│   ├── __init__.py
│   ├── main.py            # Main FastAPI app with all endpoints
│   ├── models.py          # Pydantic data models
│   └── utils.py           # Utility functions
├── static/                 # Static assets
│   ├── css/style.css      # Modern styling with responsive design
│   └── js/app.js          # Frontend logic with real-time updates
├── templates/              # HTML templates
│   ├── base.html          # Base template with navigation
│   └── index.html         # Main dashboard template
├── data/                   # Scraped data storage
│   ├── angspe_publications_2025.json  # Main publications data
│   └── angspe_analysis_2025.json      # Analysis summary
├── scraper.py             # Enhanced scraper with proper file handling
├── requirements.txt        # Python dependencies
├── vercel.json            # Vercel deployment configuration
└── README.md
```

## 🚀 Quick Start

### **Local Development**
```bash
# Install dependencies
pip install -r requirements.txt

# Run the FastAPI app
cd app
python -m uvicorn main:app --reload --port 8000

# Visit: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### **Run Scraper Only**
```bash
# Update data manually
python scraper.py

# Data will be saved to data/ directory with proper timestamps
```

### **Data Refresh via API**
```bash
# Trigger data refresh (requires API key)
curl -X POST http://localhost:8000/refresh \
  -H "X-API-Key: angspe_refresh_2025"

# Check status
curl http://localhost:8000/api/status
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or use Vercel Dashboard (recommended)
# Visit: https://vercel.com
```

## 🌐 Web Interface Features

### **Dashboard**
- **Real-time Statistics**: Live publication counts and file sizes
- **Data Freshness**: Accurate "Last Refresh" timestamps with time-ago display
- **Publications Table**: Searchable, filterable data with download links
- **API Documentation**: Direct access to interactive endpoint testing
- **Responsive Design**: Optimized for all devices and screen sizes

### **Interactive Elements**
- **Smart Search**: Real-time publication search with instant results
- **Category Filtering**: Click categories to filter publications
- **Download Links**: Direct access to PDF files with file size info
- **Status Monitoring**: System health and data freshness information
- **Refresh Button**: One-click data update with progress indication

### **Navigation**
- **Home**: Main dashboard with overview
- **API**: Direct access to publications data
- **Status**: System health and data freshness
- **Analysis**: Detailed publication analysis
- **Docs**: Interactive API documentation
- **Refresh Data**: Update publications with background processing

## 🔧 Technical Implementation

### **Backend (FastAPI)**
- **Modern Web Framework**: FastAPI with async support and automatic validation
- **Data Models**: Pydantic schemas for robust data validation
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Static File Serving**: Efficient serving of CSS, JS, and template files
- **Background Tasks**: Non-blocking data refresh operations
- **API Key Authentication**: Secure refresh endpoint protection

### **Frontend**
- **Vanilla JavaScript**: Lightweight, framework-free implementation
- **Modern CSS**: Grid layouts, smooth animations, and responsive design
- **Font Awesome Icons**: Professional iconography throughout the interface
- **Progressive Enhancement**: Graceful degradation without JavaScript
- **Real-time Updates**: Live data refresh and status monitoring
- **Intelligent Polling**: Automatic detection of background task completion

### **Data Management**
- **Structured Storage**: JSON files with consistent schema
- **Timestamp Tracking**: Accurate recording of data freshness
- **Duplicate Detection**: Smart handling of repeated publications
- **File Path Management**: Proper organization in data/ subdirectory
- **Error Recovery**: Graceful handling of data loading failures

### **Dependencies**
- `fastapi` - Modern, fast web framework
- `uvicorn` - Lightning-fast ASGI server
- `jinja2` - Powerful template engine
- `requests` - HTTP client for web scraping
- `beautifulsoup4` - Robust HTML parsing
- `lxml` - Fast XML/HTML parser
- `pydantic` - Data validation and settings management

## 📊 Data Quality & Features

### **Strengths**
- ✅ All publications have complete metadata
- ✅ Direct download links are functional and verified
- ✅ Consistent date format (DD/MM/YYYY)
- ✅ Clear categorization system with proper French labels
- ✅ File sizes provided for all documents
- ✅ JSON API for programmatic access
- ✅ Real-time data freshness tracking
- ✅ Duplicate detection and removal

### **Data Freshness**
- ✅ Automatic timestamp updates on each refresh
- ✅ Time-ago display (e.g., "2 minutes ago")
- ✅ Background refresh with progress monitoring
- ✅ Intelligent completion detection
- ✅ Fallback handling for failed updates

### **Observations**
- ✅ Duplicate detection successfully removed 1 duplicate
- 📅 All publications are from 2025 (recent content)
- 🏛️ Focus on governance and state shareholding
- 📄 Exclusively PDF format for all publications
- 🔄 Data can be refreshed on-demand via API

## 🚀 Deployment & Scaling

### **Vercel (Recommended)**
- **Automatic Python Detection**: Vercel recognizes FastAPI automatically
- **Global CDN**: Fast loading worldwide with edge caching
- **Free Tier**: Generous free hosting for development
- **Easy Updates**: Git-based deployments with automatic builds
- **Environment Variables**: Secure configuration management

### **Other Platforms**
- **Heroku**: Add `Procfile` for web process definition
- **Railway**: Direct Git integration with automatic deployments
- **DigitalOcean App Platform**: Container-based deployment
- **AWS Lambda**: Serverless deployment with API Gateway

## 🔮 Future Enhancements

1. **Automated Scraping**: Schedule regular data updates with cron jobs
2. **Content Analysis**: Extract and analyze PDF content for insights
3. **Historical Tracking**: Monitor publication patterns over time
4. **Multi-language Support**: Handle Arabic content and localization
5. **Enhanced Categorization**: More granular document classification
6. **Real-time Updates**: WebSocket notifications for new publications
7. **Data Export**: CSV, Excel, and other format exports
8. **User Authentication**: Role-based access control
9. **Monitoring Dashboard**: Advanced system health metrics
10. **Mobile App**: Native mobile application for publications

## 🐛 Recent Fixes & Improvements

### **Data Refresh System**
- ✅ Fixed file path issues causing stale data display
- ✅ Improved background task handling
- ✅ Added intelligent completion polling
- ✅ Enhanced error handling and recovery
- ✅ Better user feedback during refresh operations

### **API Endpoints**
- ✅ Restored missing `/api/publications` endpoint
- ✅ Restored missing `/api/analysis` endpoint  
- ✅ Restored missing `/api/status` endpoint
- ✅ Enhanced refresh endpoint with better feedback
- ✅ Improved error handling and status codes

### **Frontend Improvements**
- ✅ Fixed "Last Refresh" metric display
- ✅ Added real-time data freshness tracking
- ✅ Improved refresh button states and feedback
- ✅ Enhanced navigation with additional links
- ✅ Better error handling and user notifications

## 📞 Contact Information (ANGSPE)

**Address**: Angle rue Arroz et rue Arram, Secteur 11, Hay Riad, Rabat, Morocco  
**Phone**: +212 5 37 54 27 66  
**Fax**: +212 5 37 56 40 91  

---

*Last updated: August 10, 2025*  
*Data source: https://angspe.ma/les-publications*  
*Web API: FastAPI + Vercel deployment ready*  
*Status: All systems operational with real-time data refresh capability*
