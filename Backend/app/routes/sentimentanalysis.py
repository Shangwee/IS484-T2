
from flask import Blueprint, request, jsonify
from services.sentiment_analysis import load_finbert, analyze_sentiment

sentiment_bp = Blueprint('sentiment', __name__)
sentiment_pipeline = load_finbert()

@sentiment_bp.route('/analyze', methods=['POST'])
def analyze():
    text = request.get_json().get('text', '')
    result = analyze_sentiment(text, sentiment_pipeline)
    return jsonify(result)