"""
RAG (Retrieval-Augmented Generation) Services

This module provides RAG functionality for the financial news platform:
- Document embedding and retrieval
- Entity extraction from context 
- Context-based sentiment analysis
- Integration with Gemini for answer generation
"""

import os
from dotenv import load_dotenv
import logging
import numpy as np
import json
import spacy
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from app.services.sentiment_analysis import SentimentAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class RAGEngine:
    def __init__(self):
        # Initialize embedding model
        self.embedding_model = self._load_embedding_model()
        
        # Initialize Gemini model for answer generation
        self._load_gemini()
        
        # Initialize spaCy for entity extraction
        self.nlp = self._load_spacy()
        
        # Initialize sentiment analyzer
        self.sentiment_analyzer = SentimentAnalyzer()
        
        # Sample documents cache
        self.documents = None
        
        # Load documents for testing (in production will come from DB)
        self._load_documents()
        
        logger.info("RAG Engine initialized successfully")
    
    def _load_embedding_model(self):
        """Load the sentence transformer model for embeddings"""
        try:
            model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Embedding model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Error loading embedding model: {e}")
            raise
    
    def _load_gemini(self):
        """Initialize Gemini AI client"""
        try:
            # Get API key from environment
            api_key = os.getenv("SW_GEMINI_API_KEY")
                
            # Configure the Gemini API client
            genai.configure(api_key=api_key)
            self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            
            logger.info("Gemini AI model initialized successfully")
        except Exception as e:
            logger.error(f"Error loading Gemini model: {e}")
            raise
    
    def _load_spacy(self):
        """Load spaCy model for entity extraction"""
        try:
            nlp = spacy.load("en_core_web_sm")
            logger.info("spaCy model loaded successfully")
            return nlp
        except Exception as e:
            logger.error(f"Error loading spaCy model: {e}")
            raise
    
    def _load_documents(self):
        """Load sample documents for the RAG system"""
        try:
            # Use static sample documents instead of database
            self.documents = [
                {
                    'id': 1,
                    'title': 'Tesla Reports Strong Q4 Earnings',
                    'content': 'Tesla reported strong Q4 earnings, beating analyst expectations with revenue growth of 12% year-over-year. The company\'s automotive gross margins improved to 21.6%, and production is expected to increase significantly in 2025.',
                    'source': 'Financial Times',
                    'date': '2024-03-15',
                },
                {
                    'id': 2,
                    'title': 'Apple Launches New AI Features',
                    'content': 'Apple announced a series of new AI features coming to iPhone and iPad, leveraging on-device machine learning. The company emphasized privacy and security while delivering new capabilities to compete with Google and Microsoft.',
                    'source': 'TechCrunch',
                    'date': '2024-03-10',
                },
                {
                    'id': 3,
                    'title': 'Oil Prices Drop Amid Global Economic Concerns',
                    'content': 'Crude oil prices fell 3% today as investors worried about slowing economic growth in China and Europe. OPEC+ is considering production cuts to stabilize prices, but analysts remain pessimistic about demand recovery.',
                    'source': 'Bloomberg',
                    'date': '2024-03-05',
                },
                {
                    'id': 4,
                    'title': 'Microsoft Reports Record Cloud Revenue',
                    'content': 'Microsoft announced record revenue for its Azure cloud services, with 35% growth year-over-year. The company\'s strategic focus on AI integration across its product suite has accelerated enterprise adoption of cloud services.',
                    'source': 'Reuters',
                    'date': '2024-02-28',
                },
                {
                    'id': 5,
                    'title': 'Federal Reserve Signals Potential Rate Cut',
                    'content': 'The Federal Reserve indicated it may consider cutting interest rates later this year if inflation continues to moderate. Markets reacted positively, with major indices reaching new highs as investors anticipate improved economic conditions.',
                    'source': 'Wall Street Journal',
                    'date': '2024-03-20',
                }
            ]
            logger.info(f"Loaded {len(self.documents)} sample documents")
        except Exception as e:
            logger.error(f"Error loading sample documents: {e}")
            # Provide minimal fallback
            self.documents = [
                {
                    'id': 1,
                    'title': 'Sample Document',
                    'content': 'This is a sample document for testing the RAG system.',
                    'source': 'Internal',
                    'date': '2024-04-01',
                }
            ]
    
    def embed_text(self, text):
        """Create an embedding for a text string"""
        try:
            embedding = self.embedding_model.encode(text)
            return embedding
        except Exception as e:
            logger.error(f"Error creating embedding: {e}")
            return None
    
    def retrieve_documents(self, query, top_k=3):
        """Retrieve relevant documents based on query"""
        try:
            # Ensure documents are loaded
            if not self.documents:
                self._load_documents()
            
            # Create query embedding
            query_embedding = self.embed_text(query)
            
            # Create embeddings for documents if not cached
            if not hasattr(self, 'document_embeddings'):
                self.document_embeddings = []
                for doc in self.documents:
                    # Create embedding from title + content
                    text = doc['title'] + ". " + doc['content']
                    embedding = self.embed_text(text)
                    self.document_embeddings.append(embedding)
            
            # Calculate similarities
            similarities = []
            for i, doc_embedding in enumerate(self.document_embeddings):
                similarity = cosine_similarity(
                    [query_embedding], 
                    [doc_embedding]
                )[0][0]
                similarities.append((i, similarity))
            
            # Sort by similarity (descending)
            sorted_similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
            
            # Get top_k document indices
            top_indices = [idx for idx, _ in sorted_similarities[:top_k]]
            
            # Return top documents
            retrieved_docs = [self.documents[idx] for idx in top_indices]
            return retrieved_docs
        except Exception as e:
            logger.error(f"Error retrieving documents: {e}")
            return []
    
    def extract_entities(self, text):
        """Extract key entities (ORG, PERSON) from text"""
        try:
            doc = self.nlp(text)
            entities = {}
            
            # Extract organizations and people
            for ent in doc.ents:
                if ent.label_ in ["ORG", "PERSON"]:
                    # Use lowercase entity type as key
                    entity_type = ent.label_.lower()
                    if entity_type not in entities:
                        entities[entity_type] = []
                    
                    # Only add entity if not already in list
                    if ent.text not in entities[entity_type]:
                        entities[entity_type].append(ent.text)
            
            return entities
        except Exception as e:
            logger.error(f"Error extracting entities: {e}")
            return {"org": [], "person": []}
    
    def analyze_context_sentiment(self, text):
        """Analyze sentiment of context text"""
        try:
            # Use the existing sentiment analyzer
            result = self.sentiment_analyzer.analyze_sentiment(text, use_openai=False)
            
            # Return simplified result
            return {
                'score': result['numerical_score'],
                'classification': result['classification'],
                'confidence': result['confidence'],
                'agreement_rate': result.get('agreement_rate', 0.0)
            }
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return {
                'score': 0,
                'classification': 'neutral',
                'confidence': 0.0,
                'agreement_rate': 0.0
            }
    
    def generate_answer(self, query, context):
        """Generate an answer using Gemini model"""
        try:
            # Create prompt for Gemini
            prompt = f"""
            You are a financial news assistant. Answer the following query based on the provided context.
            
            Context:
            {context}
            
            Query: {query}
            
            Respond with JSON in this format:
            {{
                "answer": "Your detailed answer here, based on the context",
                "summary": "A 1-2 sentence concise summary of your answer"
            }}
            
            If you cannot find the information in the context, respond with:
            {{
                "answer": "I couldn't find specific information about that in the available context.",
                "summary": "Information not available in context"
            }}
            """
            
            # Call Gemini model
            response = self.gemini_model.generate_content(prompt)
            response_text = response.text
            
            # Parse JSON response
            try:
                # Handle case where response includes code blocks
                if "```json" in response_text:
                    json_content = response_text.split("```json")[1].split("```")[0].strip()
                    result = json.loads(json_content)
                elif "```" in response_text:
                    json_content = response_text.split("```")[1].split("```")[0].strip()
                    result = json.loads(json_content)
                else:
                    result = json.loads(response_text)
                
                return result
            except json.JSONDecodeError:
                # Fallback if response is not valid JSON
                logger.warning("Invalid JSON response from Gemini, using fallback parsing")
                
                # Extract answer and summary using string manipulation
                if "answer" in response_text and "summary" in response_text:
                    answer_start = response_text.find('"answer"') + 10
                    answer_end = response_text.find('"', answer_start)
                    answer = response_text[answer_start:answer_end]
                    
                    summary_start = response_text.find('"summary"') + 11
                    summary_end = response_text.find('"', summary_start)
                    summary = response_text[summary_start:summary_end]
                    
                    return {
                        "answer": answer,
                        "summary": summary
                    }
                else:
                    return {
                        "answer": response_text,
                        "summary": "Generated response (JSON parsing failed)"
                    }
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return {
                "answer": "Sorry, I encountered an error while generating an answer.",
                "summary": "Error in processing"
            }
    
    def process_query(self, query, top_k=3):
        """
        Main RAG processing function that combines:
        - Document retrieval
        - Context building
        - Entity extraction
        - Sentiment analysis
        - Answer generation
        """
        try:
            # 1. Retrieve relevant documents
            retrieved_docs = self.retrieve_documents(query, top_k=top_k)
            
            if not retrieved_docs:
                return {
                    "answer": "I couldn't find any relevant information to answer your question.",
                    "summary": "No relevant information found",
                    "sources": [],
                    "entities": {},
                    "context_sentiment": {
                        "score": 0,
                        "classification": "neutral",
                        "confidence": 0
                    }
                }
            
            # 2. Build context from retrieved documents
            context = ""
            sources = []
            
            for doc in retrieved_docs:
                context += f"Title: {doc['title']}\n"
                context += f"Source: {doc['source']}\n"
                context += f"Date: {doc['date']}\n"
                context += f"Content: {doc['content']}\n\n"
                
                # Add source info
                sources.append({
                    "id": doc.get('id'),
                    "title": doc.get('title'),
                    "source": doc.get('source'),
                    "date": doc.get('date'),
                    "url": doc.get('url', '')
                })
            
            # 3. Extract entities from context and query
            combined_text = query + " " + context
            entities = self.extract_entities(combined_text)
            
            # 4. Analyze sentiment of context
            context_sentiment = self.analyze_context_sentiment(context)
            
            # 5. Generate answer using Gemini
            generation_result = self.generate_answer(query, context)
            
            # 6. Build entity-sentiment snapshot
            entity_sentiment = {}
            
            # Map entity names to context sentiment for "Copilot" feature
            for entity_type, entity_list in entities.items():
                for entity in entity_list:
                    entity_sentiment[entity] = {
                        "score": context_sentiment['score'],
                        "classification": context_sentiment['classification'], 
                        "snapshot_type": "context",
                        "disclaimer": "This is a snapshot of sentiment from the retrieved context only. For true entity sentiment analysis, multiple articles over time should be analyzed."
                    }
            
            # 7. Combine everything into final result
            result = {
                "answer": generation_result.get("answer", "No answer generated"),
                "summary": generation_result.get("summary", "No summary available"),
                "sources": sources,
                "entities": entities,
                "entity_sentiment": entity_sentiment,
                "context_sentiment": context_sentiment
            }
            
            return result
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return {
                "error": str(e),
                "answer": "Sorry, I encountered an error while processing your query.",
                "summary": "Error in processing",
                "sources": [],
                "entities": {},
                "context_sentiment": {
                    "score": 0,
                    "classification": "neutral",
                    "confidence": 0
                }
            }

# Function for direct access from routes
def process_rag_query(query, top_k=3):
    """Process a RAG query with the RAGEngine"""
    engine = RAGEngine()
    return engine.process_query(query, top_k=top_k)