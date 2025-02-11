from flask import Blueprint, request, jsonify
from app.services.sentiment_analysis import load_finbert, get_sentiment

sentiment_bp = Blueprint('sentiment', __name__)

# Load FinBERT model once during initialization
sentiment_pipeline = load_finbert()

@sentiment_bp.route('/analyze', methods=['POST'])
def analyze():
    text = request.get_json().get('text', '')
    result = get_sentiment(text)
    return jsonify(result)
