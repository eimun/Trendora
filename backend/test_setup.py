#!/usr/bin/env python3
"""
Test script to verify Trendora setup
Run: python test_setup.py
"""

import os
import sys
from dotenv import load_dotenv

def check_env_vars():
    """Check required environment variables"""
    load_dotenv()
    
    required = ['DATABASE_URL', 'GEMINI_API_KEY', 'YOUTUBE_API_KEY', 'SECRET_KEY']
    missing = []
    
    for var in required:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        print("💡 Create a .env file with these variables")
        return False
    
    print("✅ All environment variables set")
    return True

def check_database():
    """Test database connection"""
    try:
        from database import get_db_connection
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        conn.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def check_api_keys():
    """Test API keys"""
    load_dotenv()
    
    # Test Gemini
    try:
        import google.generativeai as genai
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Say 'API works'")
        print("✅ Gemini API key valid")
    except Exception as e:
        print(f"❌ Gemini API key invalid: {e}")
        return False
    
    # Test YouTube
    try:
        from googleapiclient.discovery import build
        youtube = build('youtube', 'v3', developerKey=os.getenv('YOUTUBE_API_KEY'))
        youtube.search().list(part='snippet', q='test', maxResults=1).execute()
        print("✅ YouTube API key valid")
    except Exception as e:
        print(f"❌ YouTube API key invalid: {e}")
        return False
    
    return True

def check_dependencies():
    """Check if all packages are installed"""
    required_packages = [
        'flask', 'flask_cors', 'psycopg2', 'pytrends', 
        'google.generativeai', 'googleapiclient',
        'pandas', 'sklearn', 'bcrypt', 'jwt'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print("💡 Run: pip install -r requirements.txt")
        return False
    
    print("✅ All dependencies installed")
    return True

def main():
    print("🔍 Trendora Setup Verification\n")
    
    checks = [
        ("Dependencies", check_dependencies),
        ("Environment Variables", check_env_vars),
        ("Database", check_database),
        ("API Keys", check_api_keys)
    ]
    
    results = []
    for name, check in checks:
        print(f"\n--- {name} ---")
        results.append(check())
    
    print("\n" + "="*50)
    if all(results):
        print("✅ ALL CHECKS PASSED! You're ready to run Trendora")
        print("\nNext steps:")
        print("1. Start backend: python app.py")
        print("2. Start frontend: cd ../frontend && npm start")
    else:
        print("❌ SOME CHECKS FAILED. Fix issues above before running")
        sys.exit(1)

if __name__ == '__main__':
    main()
