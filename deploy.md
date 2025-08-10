# Deploying to Vercel

## Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- Git repository with your code

## Deployment Steps

### 1. **Install Vercel CLI** (Optional)
```bash
npm i -g vercel
```

### 2. **Deploy via Vercel Dashboard** (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Python project
5. Click "Deploy"

### 3. **Deploy via CLI**
```bash
# In your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [your-username]
# - Link to existing project? N
# - What's your project's name? scrap-angspe
# - In which directory is your code located? ./
# - Want to override the settings? N
```

### 4. **Environment Variables** (if needed)
- No environment variables required for basic deployment
- Data files are included in the repository

### 5. **Custom Domain** (Optional)
- Add custom domain in Vercel dashboard
- Configure DNS settings as instructed

## Project Structure for Vercel
```
scrap-angspe/
├── app/                    # FastAPI application
├── static/                 # CSS, JS, images
├── templates/              # HTML templates
├── data/                   # JSON data files
├── vercel.json            # Vercel configuration
├── requirements.txt        # Python dependencies
└── README.md
```

## API Endpoints Available
- `GET /` - Main web interface
- `GET /api/publications` - Publications data
- `GET /api/analysis` - Analysis summary
- `GET /api/status` - System status
- `GET /health` - Health check

## Troubleshooting

### Common Issues
1. **Build Error**: Check `requirements.txt` has all dependencies
2. **Import Error**: Ensure all Python files have correct imports
3. **Data Not Loading**: Verify data files are in the `data/` directory

### Local Testing
```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
cd app
python -m uvicorn main:app --reload

# Visit http://localhost:8000
```

## Post-Deployment
- Your app will be available at `https://your-project.vercel.app`
- API endpoints will be accessible at `https://your-project.vercel.app/api/*`
- Data updates require redeployment (or implement live scraping)

## Maintenance
- Update data by running scraper locally and redeploying
- Monitor Vercel dashboard for performance metrics
- Check logs for any errors
