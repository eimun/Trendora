"""
Daily cron job to archive trend snapshots for historical analysis
Run this daily at midnight: python cron_archiver.py
"""

from trends_service import fetch_trends_for_niche
from database import get_db_connection
import schedule
import time
from datetime import datetime

NICHES = ['tech', 'finance', 'lifestyle', 'health']

def archive_daily_trends():
    """Fetch and archive today's trends"""
    print(f"[{datetime.now()}] Starting daily trend archival...")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    for niche in NICHES:
        print(f"Archiving {niche} trends...")
        
        try:
            trends = fetch_trends_for_niche(niche)
            
            for trend in trends:
                cur.execute('''
                    INSERT INTO trends_history (keyword, niche, volume, velocity)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (keyword, niche, snapshot_date) DO UPDATE
                    SET volume = EXCLUDED.volume, velocity = EXCLUDED.velocity
                ''', (trend['keyword'], niche, trend['volume'], trend['velocity']))
            
            conn.commit()
            print(f"✅ Archived {len(trends)} {niche} trends")
            
        except Exception as e:
            print(f"❌ Error archiving {niche}: {e}")
            continue
    
    cur.close()
    conn.close()
    print(f"[{datetime.now()}] Daily archival complete!\n")

# Schedule for midnight daily
schedule.every().day.at("00:00").do(archive_daily_trends)

def run_scheduler():
    """Keep the script running"""
    print("🤖 Trend Archiver started. Waiting for scheduled runs...")
    print("Next run: midnight")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == '__main__':
    # Run once immediately for testing
    print("Running initial archival...")
    archive_daily_trends()
    
    # Then start scheduler
    run_scheduler()
