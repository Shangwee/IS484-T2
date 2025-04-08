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
    Standalone RAG query endpoint for demonstration with topic-aware responses
    """
    try:
        # Start timing for performance tracking
        import time
        start_time = time.time()
        
        # Get request data
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query in request'
            }), 400
        
        # Extract parameters
        query = data['query']
        client_profile = data.get('clientProfile', 'moderate')
        entity_focus = data.get('entityFocus')
        time_range = data.get('timeRange', 'week')
        
        logger.info(f"RAG Query - Query: '{query}', Profile: {client_profile}, " + 
                   f"Entity Focus: {entity_focus}, Time Range: {time_range}")
        
        # Topic detection for smart response generation
        topic_keywords = {
            'trump': ['trump', 'tariff', 'tariffs', 'trade war', 'china'],
            'tesla': ['tesla', 'musk', 'electric vehicle', 'ev'],
            'crypto': ['crypto', 'bitcoin', 'ethereum', 'blockchain'],
            'inflation': ['inflation', 'cpi', 'federal reserve', 'interest rate']
        }
        
        # Find matching topic
        query_lower = query.lower()
        detected_topic = None
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in query_lower for keyword in keywords):
                detected_topic = topic
                break
                
        # Initialize Gemini (or use a mock if key not available)
        try:
            api_key = os.getenv("SW_GEMINI_API_KEY", "fake_key")
            genai.configure(api_key=api_key)
            gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            
            # Create risk-profile aware prompt
            profile_context = ""
            if client_profile == "conservative":
                profile_context = "The client has a conservative risk profile and prioritizes capital preservation."
            elif client_profile == "moderate":
                profile_context = "The client has a moderate risk profile with balanced growth and income objectives."
            elif client_profile == "aggressive":
                profile_context = "The client has an aggressive risk profile and prioritizes growth."
            
            # Generate a response
            prompt = f"""You are a UBS financial advisor assistant providing advice to clients.
{profile_context}
            
The client is asking: {query}

Provide a concise, professional response with specific insights based on recent market data.
Focus on actionable advice tailored to the client's {client_profile} risk profile.
Keep your response under 250 words and use a formal, professional tone.
"""
            response = gemini_model.generate_content(prompt)
            answer = response.text
            
        except Exception as e:
            logger.warning(f"Gemini error: {e}. Using mock response.")
            # Topic-specific mock responses based on client profile
            if detected_topic == 'trump':
                if client_profile == 'conservative':
                    answer = "Based on recent news about Trump's tariff announcements, we're seeing significant market volatility. For conservative portfolios, we recommend reducing exposure to companies with significant operations in China and Southeast Asia. Consider increasing allocation to domestic-focused businesses with limited international supply chain dependence. Singapore equities might be particularly exposed, so consider underweighting until policy details are clarified."
                elif client_profile == 'moderate':
                    answer = "With recent tariff announcements, markets are experiencing volatility but technology stocks (Apple +15.3, Nvidia +19.6) are showing resilience. For your moderate risk profile, maintain a balanced exposure with selective tech positions. Consider hedging strategies for international positions, particularly those with exposure to Cambodia (-49.1) and China (-32.7). We recommend monitoring Singapore's business task force developments before adjusting allocation."
                else:  # aggressive
                    answer = "Current market volatility from Trump's tariff announcements presents tactical opportunities for your aggressive portfolio. Consider positions in resilient tech companies (Nvidia +19.6, Apple +15.3, Tesla +12.8). With China vowing to 'fight to the end' against threatened additional 50% tariffs, maintain liquid positions to capitalize on further volatility. Pair trades shorting companies with high Cambodia exposure against US domestic manufacturers may offer strategic opportunities."
            elif detected_topic == 'tesla':
                if client_profile == 'conservative':
                    answer = "Our analysts have a positive outlook on Tesla, with sentiment scores of +42.5. However, for your conservative portfolio, we recommend limited exposure (max 3% of equity allocation) due to the company's volatility. Focus on established blue-chip companies with strong dividend histories for more stable returns. The electric vehicle sector broadly shows positive momentum but remains subject to significant regulatory and supply chain uncertainties."
                else:
                    answer = "Tesla sentiment indicators at +42.5 suggest continued positive momentum in the near term. Recent price cuts in US and China markets show the company's strategic response to slowing EV demand. For your portfolio, consider a moderate allocation (5-8%) as part of a diversified equity strategy. Their new battery technology unveiled at the recent Investor Day represents a potential competitive advantage that could support long-term growth prospects."
            elif detected_topic == 'crypto':
                answer = "Our sentiment analysis shows the cryptocurrency sector at -18.3, suggesting caution is warranted. For your " + client_profile + " risk profile, we " + ("recommend avoiding crypto exposure" if client_profile == "conservative" else "suggest limiting exposure to 2-5% of your portfolio, focusing on established cryptocurrencies") + ". SEC Chair Gensler's ongoing compliance concerns create regulatory uncertainty, despite Bitcoin briefly topping $70,000 and positive momentum for ETF approvals. This remains a highly speculative asset class."
            else:
                answer = "Based on your " + client_profile + " risk profile, here's our analysis of the current market situation related to your query. Our sentiment indicators show Tesla (+42.5) and Apple (+23.7) with positive momentum, while Energy (-12.6) and Cryptocurrencies (-18.3) show bearish signals. Federal Reserve sentiment is positive (+15.2), suggesting a favorable environment for high-quality bonds. We recommend " + ("defensive positioning with blue-chip stocks" if client_profile == "conservative" else "a balanced approach with selective tech exposure" if client_profile == "moderate" else "an overweight in technology with tactical flexibility") + "."
        
        # Generate topic-specific mock data
        if detected_topic == 'trump':
            sources = [
                {
                    "id": 1,
                    "title": "Dow Jones Futures Jump 1,200 Points On Trump Tariff News; Apple, Nvidia, Tesla Rally",
                    "source": "Investor's Business Daily",
                    "date": "2025-04-08",
                    "time": "45 minutes ago",
                    "url": "https://www.investors.com/market-trend/stock-market-today/dow-jones-futures-trump-tariff-news-nvidia-stock-tesla-stock/"
                },
                {
                    "id": 2,
                    "title": "Cambodia hit with highest Trump tariff, but manufacturing 'absolutely not' coming back to U.S., trade group says",
                    "source": "CNBC",
                    "date": "2025-04-08",
                    "time": "2 hours ago",
                    "url": "https://www.cnbc.com/2025/04/08/cambodia-hit-with-highest-trump-tariff-rate-by-far-at-49percent.html"
                },
                {
                    "id": 3,
                    "title": "China vows 'fight to the end' after Trump threatens extra 50% tariff",
                    "source": "Financial Times",
                    "date": "2025-04-08",
                    "time": "5 hours ago",
                    "url": "https://www.ft.com/content/trump-china-tariffs-2025"
                }
            ]
            entities = {
                "org": ["China", "Singapore", "Cambodia", "Apple", "Nvidia", "Tesla"],
                "person": ["Donald Trump", "Lawrence Wong"]
            }
            entity_sentiment = {
                "China": { "score": -32.7, "classification": "bearish" },
                "Singapore": { "score": -18.4, "classification": "bearish" },
                "Cambodia": { "score": -49.1, "classification": "bearish" },
                "Apple": { "score": 15.3, "classification": "bullish" }
            }
            context_sentiment = {
                "score": -15.6,
                "classification": "bearish",
                "confidence": 0.83,
                "agreement_rate": 0.77
            }
        elif detected_topic == 'tesla':
            sources = [
                {
                    "id": 1,
                    "title": "Tesla Cuts Prices in US and China Amid Slowing EV Demand",
                    "source": "Reuters",
                    "date": "2025-04-07",
                    "time": "1 day ago",
                    "url": "https://www.reuters.com/business/autos-transportation/tesla-cuts-prices-us-china-2025-04-07/"
                },
                {
                    "id": 2,
                    "title": "Tesla's Q1 Deliveries Beat Lowered Expectations But Still Show YoY Decline",
                    "source": "CNBC",
                    "date": "2025-04-03",
                    "time": "5 days ago",
                    "url": "https://www.cnbc.com/2025/04/03/tesla-tsla-q1-2025-vehicle-delivery-numbers.html"
                },
                {
                    "id": 3,
                    "title": "Musk Unveils New Battery Technology at Tesla Investor Day",
                    "source": "TechCrunch",
                    "date": "2025-03-25",
                    "time": "2 weeks ago",
                    "url": "https://techcrunch.com/2025/03/25/tesla-battery-technology-investor-day/"
                }
            ]
            entities = {
                "org": ["Tesla", "BYD", "Rivian"],
                "person": ["Elon Musk"]
            }
            entity_sentiment = {
                "Tesla": { "score": 18.2, "classification": "bullish" },
                "BYD": { "score": 24.5, "classification": "bullish" }
            }
            context_sentiment = {
                "score": 14.8,
                "classification": "bullish",
                "confidence": 0.72,
                "agreement_rate": 0.65
            }
        elif detected_topic == 'crypto':
            sources = [
                {
                    "id": 1,
                    "title": "Bitcoin Briefly Tops $70,000 as Spot ETF Inflows Accelerate",
                    "source": "CoinDesk",
                    "date": "2025-04-06",
                    "time": "2 days ago",
                    "url": "https://www.coindesk.com/markets/2025/04/06/bitcoin-tops-70000-etf-inflows/"
                },
                {
                    "id": 2,
                    "title": "Ethereum Rises Ahead of Expected ETF Approvals in May",
                    "source": "Bloomberg",
                    "date": "2025-04-04",
                    "time": "4 days ago",
                    "url": "https://www.bloomberg.com/news/articles/2025-04-04/ethereum-rises-etf-approvals"
                },
                {
                    "id": 3,
                    "title": "SEC Chair Gensler Reiterates Crypto Compliance Concerns",
                    "source": "Financial Times",
                    "date": "2025-04-01",
                    "time": "1 week ago",
                    "url": "https://www.ft.com/content/sec-gensler-crypto-compliance-2025"
                }
            ]
            entities = {
                "org": ["Bitcoin", "Ethereum", "SEC"],
                "person": ["Gary Gensler"]
            }
            entity_sentiment = {
                "Bitcoin": { "score": -15.2, "classification": "bearish" },
                "Ethereum": { "score": -8.4, "classification": "neutral" },
                "SEC": { "score": -22.5, "classification": "bearish" }
            }
            context_sentiment = {
                "score": -18.3,
                "classification": "bearish",
                "confidence": 0.68,
                "agreement_rate": 0.72
            }
        elif detected_topic == 'inflation':
            sources = [
                {
                    "id": 1,
                    "title": "CPI Report Shows Inflation Cooling to 3.2% in March",
                    "source": "Bloomberg",
                    "date": "2025-04-05",
                    "time": "3 days ago",
                    "url": "https://www.bloomberg.com/news/articles/2025-04-05/us-inflation-cpi-march-2025"
                },
                {
                    "id": 2,
                    "title": "Fed Officials Signal Rate Cuts May Be Delayed Amid Sticky Inflation",
                    "source": "CNBC",
                    "date": "2025-04-06",
                    "time": "2 days ago",
                    "url": "https://www.cnbc.com/2025/04/06/fed-officials-rate-cuts-inflation-concern.html"
                }
            ]
            entities = {
                "org": ["Federal Reserve", "US Treasury", "BLS"],
                "person": ["Jerome Powell", "Janet Yellen"]
            }
            entity_sentiment = {
                "Federal Reserve": { "score": 5.3, "classification": "neutral" },
                "Inflation": { "score": -8.7, "classification": "bearish" }
            }
            context_sentiment = {
                "score": -4.2,
                "classification": "neutral",
                "confidence": 0.78,
                "agreement_rate": 0.82
            }
        else:
            # Generic sources
            sources = [
                {
                    "id": 1,
                    "title": f"Latest Analysis: {query}",
                    "source": "Bloomberg",
                    "date": "2025-04-08",
                    "time": "3 hours ago",
                    "url": f"https://www.bloomberg.com/news/articles/2025-04-08/market-analysis-{query.lower().replace(' ', '-')}"
                },
                {
                    "id": 2,
                    "title": f"Market Implications of {query}",
                    "source": "Financial Times",
                    "date": "2025-04-07",
                    "time": "1 day ago",
                    "url": f"https://www.ft.com/content/market-implications-{query.lower().replace(' ', '-')}"
                }
            ]
            entities = {
                "org": ["JPMorgan", "Goldman Sachs", "Morgan Stanley"],
                "person": ["Jerome Powell", "Janet Yellen"]
            }
            entity_sentiment = {
                "JPMorgan": { "score": 8.5, "classification": "neutral" },
                "Goldman Sachs": { "score": 12.7, "classification": "bullish" }
            }
            context_sentiment = {
                "score": 5.2,
                "classification": "neutral",
                "confidence": 0.65,
                "agreement_rate": 0.7
            }
        
        # Generate follow-up questions based on topic
        if detected_topic == 'trump':
            follow_ups = [
                "How would a prolonged trade war affect my portfolio?",
                "Which sectors are most protected from tariff impacts?",
                "Should I adjust my international exposure given these developments?"
            ]
        elif detected_topic == 'tesla':
            follow_ups = [
                "How does Tesla compare to traditional automakers in this environment?",
                "What's the outlook for Tesla's energy business?",
                "Should I consider other EV manufacturers for diversification?"
            ]
        elif detected_topic == 'crypto':
            follow_ups = [
                "How would ETF approvals affect the crypto market?",
                "What regulatory changes should I monitor in the crypto space?",
                "Would stablecoins be a less volatile entry point?"
            ]
        else:
            follow_ups = [
                "How does this impact my portfolio allocation?",
                "What are the biggest risks to watch?",
                "How does this compare to historical trends?"
            ]
            
        # Build final result
        result = {
            "answer": answer,
            "summary": f"Insights on {query} tailored for {client_profile} investors",
            "sources": sources,
            "entities": entities,
            "entity_sentiment": entity_sentiment,
            "context_sentiment": context_sentiment,
            "follow_up_questions": follow_ups,
            "processing_time": time.time() - start_time
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