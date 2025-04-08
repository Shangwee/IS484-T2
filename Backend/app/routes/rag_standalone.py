"""
Standalone RAG (Retrieval-Augmented Generation) routes

This is a simplified version that works without database connections
"""

from flask import Blueprint, jsonify, request, Flask
import logging
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create blueprint
rag_bp = Blueprint('rag', __name__)

@rag_bp.route('/query', methods=['POST'])
def rag_query():
    """
    Simplified RAG query endpoint for demonstration
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query in request'
            }), 400
        
        query = data['query']
        
        # Initialize Gemini (or use a mock if key not available)
        try:
            api_key = os.getenv("SW_GEMINI_API_KEY", "fake_key")
            genai.configure(api_key=api_key)
            gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            
            # Generate a response
            prompt = f"You are a financial news assistant. Please respond to this query: {query}"
            response = gemini_model.generate_content(prompt)
            answer = response.text
            
        except Exception as e:
            logger.warning(f"Gemini error: {e}. Using mock response.")
            # Mock response for testing
            answer = f"This is a simulated answer to your query: '{query}'. In a real implementation, this would use the Gemini API."
        
        # Return mock result
        result = {
            "answer": answer,
            "summary": f"Response to: {query}",
            "sources": [
                {
                    "id": 1,
                    "title": "Sample Article 1",
                    "source": "Financial Times",
                    "date": "2024-03-15"
                },
                {
                    "id": 2,
                    "title": "Sample Article 2",
                    "source": "Bloomberg",
                    "date": "2024-03-10"
                }
            ],
            "entities": {
                "org": ["Tesla", "Apple"],
                "person": ["Elon Musk"]
            },
            "entity_sentiment": {
                "Tesla": {
                    "score": 42.5,
                    "classification": "bullish",
                    "snapshot_type": "context",
                    "disclaimer": "This is a snapshot from retrieved context only."
                }
            },
            "context_sentiment": {
                "score": 42.5,
                "classification": "bullish",
                "confidence": 0.85,
                "agreement_rate": 0.9
            }
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error processing RAG query: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# Standalone app for testing
if __name__ == "__main__":
    app = Flask(__name__)
    app.register_blueprint(rag_bp, url_prefix='/rag')
    
    # Enable CORS for development
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    app.run(debug=True, port=5001)