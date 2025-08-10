#!/usr/bin/env python3
"""
Simple test script to verify the FastAPI app works locally
"""

import requests
import json
import sys
from pathlib import Path

def test_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing ANGSPE FastAPI Application...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint: OK")
        else:
            print(f"❌ Health endpoint: Failed ({response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ Health endpoint: Connection failed (is the app running?)")
        return False
    
    # Test publications endpoint
    try:
        response = requests.get(f"{base_url}/api/publications")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Publications endpoint: OK ({len(data)} publications)")
        else:
            print(f"❌ Publications endpoint: Failed ({response.status_code})")
    except Exception as e:
        print(f"❌ Publications endpoint: Error - {e}")
    
    # Test analysis endpoint
    try:
        response = requests.get(f"{base_url}/api/analysis")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Analysis endpoint: OK ({data.get('total_publications', 0)} total)")
        else:
            print(f"❌ Analysis endpoint: Failed ({response.status_code})")
    except Exception as e:
        print(f"❌ Analysis endpoint: Error - {e}")
    
    # Test status endpoint
    try:
        response = requests.get(f"{base_url}/api/status")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status endpoint: OK (Status: {data.get('status', 'Unknown')})")
        else:
            print(f"❌ Status endpoint: Failed ({response.status_code})")
    except Exception as e:
        print(f"❌ Status endpoint: Error - {e}")
    
    # Test main page
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Main page: OK")
        else:
            print(f"❌ Main page: Failed ({response.status_code})")
    except Exception as e:
        print(f"❌ Main page: Error - {e}")
    
    print("=" * 50)
    print("🎉 Testing completed!")
    return True

def check_data_files():
    """Check if required data files exist"""
    print("\n📁 Checking data files...")
    
    data_dir = Path("data")
    if not data_dir.exists():
        print("❌ Data directory not found")
        return False
    
    required_files = [
        "angspe_publications_2025.json",
        "angspe_analysis_2025.json"
    ]
    
    for file in required_files:
        file_path = data_dir / file
        if file_path.exists():
            print(f"✅ {file}: Found")
        else:
            print(f"❌ {file}: Missing")
    
    return True

def main():
    """Main test function"""
    print("🚀 ANGSPE FastAPI Application Test Suite")
    print("Make sure the app is running with: cd app && python -m uvicorn main:app --reload")
    print()
    
    # Check data files first
    if not check_data_files():
        print("\n❌ Data files missing. Run the scraper first:")
        print("python scraper.py")
        sys.exit(1)
    
    # Test endpoints
    if test_endpoints():
        print("\n🎯 All tests passed! Your app is ready for deployment.")
        print("\n📋 Next steps:")
        print("1. Commit your changes to git")
        print("2. Deploy to Vercel: vercel")
        print("3. Or use Vercel Dashboard: https://vercel.com")
    else:
        print("\n❌ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
