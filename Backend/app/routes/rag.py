"""
RAG (Retrieval-Augmented Generation) routes

This module provides API endpoints for the RAG system, including:
- Query processing with document retrieval and answer generation
- Integration with sentiment analysis for context evaluation
"""

from flask import Blueprint, jsonify, request
from app.services.rag_services import process_rag_query
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
rag_bp = Blueprint('rag', __name__)

@rag_bp.route('/query', methods=['POST'])
def rag_query():
    """
    Process a RAG query with document retrieval and answer generation
    
    Request JSON:
    {
        "query": "String with user's question",
        "top_k": 3  // Optional: number of documents to retrieve
    }
    
    Response JSON:
    {
        "answer": "Generated answer based on retrieved context",
        "summary": "1-2 sentence summary of the answer",
        "sources": [
            {
                "id": "document_id",
                "title": "Document title",
                "source": "Source name",
                "date": "Publication date",
                "url": "URL if available"
            }
        ],
        "entities": {
            "org": ["Organization1", "Organization2"],
            "person": ["Person1", "Person2"]
        },
        "entity_sentiment": {
            "Organization1": {
                "score": 42.5,
                "classification": "bullish",
                "snapshot_type": "context",
                "disclaimer": "..."
            }
        },
        "context_sentiment": {
            "score": 42.5,
            "classification": "bullish",
            "confidence": 0.85,
            "agreement_rate": 0.9
        }
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query in request'
            }), 400
        
        query = data['query']
        top_k = data.get('top_k', 3)
        
        # Process the query
        result = process_rag_query(query, top_k=top_k)
        
        # Return the result
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error processing RAG query: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500