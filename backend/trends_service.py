from pytrends.request import TrendReq
import time
from datetime import datetime
from database import get_db_connection

# Initialize PyTrends
pytrends = TrendReq(hl='en-US', tz=360)

NICHE_KEYWORDS = {
    'tech': ['AI', 'ChatGPT', 'iPhone', 'Tesla', 'cryptocurrency'],
    'finance': ['stocks', 'investing', 'real estate', 'crypto', 'trading'],
    'lifestyle': ['fitness', 'diet', 'fashion', 'travel', 'wellness'],
    'health': ['nutrition', 'mental health', 'workout', 'sleep', 'meditation']
}

def fetch_trends_for_niche(niche):
    """Fetch trending topics for a specific niche"""
    
    keywords = NICHE_KEYWORDS.get(niche.lower(), ['trending'])
    
    trends_data = []
    
    for keyword in keywords:
        try:
            # Build payload
            pytrends.build_payload([keyword], timeframe='now 7-d', geo='US')
            
            # Get interest over time
            interest = pytrends.interest_over_time()
            
            if not interest.empty:
                # Get related queries
                related = pytrends.related_queries()
                rising = related[keyword]['rising']
                
                if rising is not None and not rising.empty:
                    for _, row in rising.head(5).iterrows():
                        trends_data.append({
                            'keyword': row['query'],
                            'volume': int(row['value']) if row['value'] != 'Breakout' else 999999,
                            'velocity': 'rising_fast' if row['value'] == 'Breakout' else 'rising',
                            'niche': niche
                        })
            
            time.sleep(2)  # Rate limiting
            
        except Exception as e:
            print(f"Error fetching trends for {keyword}: {e}")
            continue
    
    return trends_data

def cache_trends_to_db(trends_data):
    """Save trends to database with virality scores"""
    from virality_scorer import calculate_virality_score
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    for trend in trends_data:
        # Calculate virality score
        virality_data = calculate_virality_score(trend)
        score = virality_data['score']
        
        try:
            cur.execute('''
                INSERT INTO trends (keyword, niche, volume, velocity, virality_score)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (keyword, niche, DATE(fetched_at)) DO UPDATE
                SET volume = EXCLUDED.volume, 
                    velocity = EXCLUDED.velocity,
                    virality_score = EXCLUDED.virality_score
            ''', (trend['keyword'], trend['niche'], trend['volume'], trend['velocity'], score))
        except Exception as e:
            print(f"Error caching trend: {e}")
    
    conn.commit()
    cur.close()
    conn.close()

def get_cached_trends(niche, max_age_hours=2):
    """Get trends from cache with virality scores"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        SELECT keyword, niche, volume, velocity, virality_score, fetched_at
        FROM trends
        WHERE niche = %s
        AND fetched_at > NOW() - INTERVAL '%s hours'
        ORDER BY virality_score DESC, volume DESC
        LIMIT 20
    ''', (niche, max_age_hours))
    
    trends = cur.fetchall()
    cur.close()
    conn.close()
    
    return [
        {
            'keyword': t[0],
            'niche': t[1],
            'volume': t[2],
            'velocity': t[3],
            'virality_score': t[4] or 0,
            'fetched_at': t[5].isoformat()
        }
        for t in trends
    ]
