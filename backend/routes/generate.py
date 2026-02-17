from flask import Blueprint, jsonify, request
from auth import token_required
from ai_service import generate_script, generate_hooks, generate_hashtags
from database import get_db_connection
import json

generate_bp = Blueprint('generate', __name__)

@generate_bp.route('/script', methods=['POST'])
@token_required
def create_script():
    data = request.json
    trend_keyword = data.get('keyword')
    content_type = data.get('type', 'video')
    use_style = data.get('use_style', False)
    
    if not trend_keyword:
        return jsonify({"error": "Keyword required"}), 400
    
    # Generate content (with optional style)
    script = generate_script(trend_keyword, content_type, request.user_id, use_style)
    hooks = generate_hooks(trend_keyword)
    hashtags = generate_hashtags(trend_keyword)
    
    # Save to database
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO generated_content (user_id, trend_keyword, content_type, script_text, hooks, hashtags)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (request.user_id, trend_keyword, content_type, json.dumps(script), hooks, hashtags))
    
    content_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({
        "content_id": content_id,
        "script": script,
        "hooks": hooks,
        "hashtags": hashtags
    })
