from flask import Blueprint, request, jsonify
from app.services.sentiment_analysis import get_sentiment

sentiment_bp = Blueprint('sentiment', __name__)

@sentiment_bp.route('/analyze', methods=['POST'])
def analyze():
    text = request.get_json().get('text', '')
    result = get_sentiment(text, False)
    return jsonify(result)


@sentiment_bp.route('/entity', methods=['POST'])
def analyze_entity():
    data = request.get_json()
    entity_name = data.get('entity_name', '')
    articles = data.get('articles', [])
    weights = data.get('weights', {})
    
    # Import locally to avoid circular imports
    from app.services.entity_sentiment_analyzer import EntitySentimentAnalyzer
    
    # Initialize entity analyzer
    entity_analyzer = EntitySentimentAnalyzer()
    
    # Generate unified sentiment
    result = entity_analyzer.generate_unified_sentiment_scores(
        entity_name,
        articles,
        weights
    )
    
    return jsonify(result)