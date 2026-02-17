#!/usr/bin/env python3
"""
Verify demo data is properly seeded
Run: python verify_demo.py
"""

from database import get_db_connection
from dotenv import load_dotenv

load_dotenv()

def check_data():
    conn = get_db_connection()
    cur = conn.cursor()

    # Check trends
    cur.execute("SELECT COUNT(*) FROM trends")
    trend_count = cur.fetchone()[0]
    print(f"{'✅' if trend_count > 0 else '❌'} Trends seeded: {trend_count}")

    # Check historical data
    cur.execute("SELECT COUNT(*) FROM trends_history")
    history_count = cur.fetchone()[0]
    print(f"{'✅' if history_count > 0 else '❌'} Historical snapshots: {history_count}")

    # Check predictions
    cur.execute("SELECT COUNT(*) FROM predicted_trends")
    prediction_count = cur.fetchone()[0]
    print(f"{'✅' if prediction_count > 0 else '❌'} Predictions generated: {prediction_count}")

    # Check demo user
    cur.execute("SELECT email FROM users WHERE email = 'demo@trendora.com'")
    demo_user = cur.fetchone()
    if demo_user:
        print(f"✅ Demo account ready: {demo_user[0]}")
    else:
        print("❌ Demo account not found — register via /api/auth/register")

    cur.close()
    conn.close()

    if trend_count > 0 and history_count > 0 and prediction_count > 0:
        print("\n🎉 Demo environment is READY!")
    else:
        print("\n⚠️ Run: python seed_data.py")

if __name__ == '__main__':
    check_data()
