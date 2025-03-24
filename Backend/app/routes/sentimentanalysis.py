from flask import Blueprint, request, jsonify
from app.services.sentiment_analysis import get_sentiment

sentiment_bp = Blueprint('sentiment', __name__)

@sentiment_bp.route('/analyze', methods=['POST'])
def analyze():
    text = request.get_json().get('text', '')
    result = get_sentiment(text, False)
    return jsonify(result)
