from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import numpy as np
import re
import logging
import json
import requests
import os
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
MAX_SEGMENT_LENGTH = 512  # Maximum length for text segments
AGREEMENT_THRESHOLD = 0.7  # 70% agreement required between models
SENTIMENT_THRESHOLD = 0.1  # Threshold for determining positive/negative sentiment

# API Keys - replace with your actual keys or add to environment
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

# Global variable to hold the loaded model
finbert_pipeline = None

def load_finbert():
    """Initialize and load the FinBERT model - this is the function your routes are expecting"""
    model_name = "yiyanghkust/finbert-tone"
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        return pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
    except Exception as e:
        logger.error(f"Error loading FinBERT model: {e}")
        raise

def get_finbert_pipeline():
    """Get or initialize the FinBERT pipeline"""
    global finbert_pipeline
    if finbert_pipeline is None:
        finbert_pipeline = load_finbert()
    return finbert_pipeline

class SentimentAnalyzer:
    def __init__(self, config=None):
        """
        Initialize the SentimentAnalyzer with optional configuration
        
        Parameters:
        - config: Dictionary with configuration options
            - gemini_api_key: API key for Gemini
            - openai_api_key: API key for OpenAI
            - openai_model: OpenAI model to use (default: gpt-4-turbo-preview)
        """
        self.config = config or {}
        self.finbert_pipeline = get_finbert_pipeline()  # Use the global pipeline
        self.gemini_client = None
        self.openai_api_key = None
    
    def _load_gemini(self):
        """Initialize Gemini AI client"""
        try:
            # Get API key from config or environment
            api_key = self.config.get('gemini_api_key', GEMINI_API_KEY)
            
            if not api_key:
                raise ValueError("Gemini API key not found in environment variables or config")
                
            # Configure the Gemini API client
            genai.configure(api_key=api_key)
            self.gemini_client = genai.GenerativeModel("gemini-1.5-flash")
            
            logger.info("Gemini AI client initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Error loading Gemini client: {e}")
            raise
            
    def _load_openai(self):
        """Initialize OpenAI API key"""
        try:
            # Get API key from config or environment
            api_key = self.config.get('openai_api_key', OPENAI_API_KEY)
            
            if not api_key:
                raise ValueError("OpenAI API key not found in environment variables or config")
            
            self.openai_api_key = api_key
            logger.info("OpenAI API key stored successfully")
            return True
        except Exception as e:
            logger.error(f"Error storing OpenAI API key: {e}")
            raise
    
    def preprocess_text(self, text):
        """
        Preprocess the input text for sentiment analysis
        - Remove URLs
        - Clean special characters while preserving sentiment-related punctuation
        - Normalize whitespace
        """
        # Remove URLs
        text = re.sub(r'http\S+', '', text)
        
        # Remove special characters but keep punctuation important for sentiment
        text = re.sub(r'[^\w\s.,!?:;\'"-]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        logger.debug(f"Preprocessed text: {text[:100]}...")
        return text
    
    def split_text(self, text):
        """
        Split the text into segments for processing
        - Handle character limits
        - Preserve context between segments
        """
        if len(text) <= MAX_SEGMENT_LENGTH:
            return [text]
        
        # Split by sentences to preserve context
        sentences = re.split(r'(?<=[.!?])\s+', text)
        segments = []
        current_segment = ""
        
        for sentence in sentences:
            if len(current_segment) + len(sentence) <= MAX_SEGMENT_LENGTH:
                current_segment += " " + sentence if current_segment else sentence
            else:
                if current_segment:
                    segments.append(current_segment.strip())
                current_segment = sentence
        
        if current_segment:
            segments.append(current_segment.strip())
        
        logger.info(f"Split text into {len(segments)} segments")
        return segments
    
    def analyze_with_finbert(self, text):
        """
        Analyze sentiment using FinBERT model
        Returns a dictionary with sentiment scores
        """
        try:
            results = self.finbert_pipeline(text)
            
            # Extract scores and convert to proper format
            scores_dict = {item['label'].lower(): item['score'] for item in results}
            
            # Calculate numerical score (-1.0 to +1.0)
            numerical_score = scores_dict.get('positive', 0) - scores_dict.get('negative', 0)
            
            classification = 'positive' if numerical_score > SENTIMENT_THRESHOLD else 'negative' if numerical_score < -SENTIMENT_THRESHOLD else 'neutral'
            
            return {
                'numerical_score': numerical_score,
                'classification': classification,
                'detailed_scores': scores_dict
            }
        except Exception as e:
            logger.error(f"Error analyzing with FinBERT: {e}")
            return {'numerical_score': 0, 'classification': 'neutral', 'detailed_scores': {}}
    
    def analyze_with_gemini(self, text):
        """
        Analyze sentiment using Gemini AI
        Returns a dictionary with sentiment scores
        """
        try:
            # Ensure Gemini client is initialized
            if not self.gemini_client:
                self._load_gemini()
            
            # Create prompt for sentiment analysis
            prompt = f"""
            Analyze the sentiment of the following financial news text. 
            Rate the sentiment on a scale from 0.0 to 1.0, where:
            - 0.0 is extremely negative/bearish
            - 0.5 is neutral
            - 1.0 is extremely positive/bullish
            
            Respond with a JSON object containing:
            - positive_score: a float value between 0 and 1
            - negative_score: a float value between 0 and 1
            - neutral_score: a float value between 0 and 1
            - overall_score: a float value between 0 and 1 (where 0.5 is neutral)
            - classification: one of "positive", "negative", or "neutral"
            
            Text to analyze: {text}
            """
            
            # Call Gemini API
            response = self.gemini_client.generate_content(prompt)
            response_text = response.text
            
            # Parse the response - handling the possibility that it might not be valid JSON
            try:
                # Extract JSON from response if it's enclosed in code blocks
                if "```json" in response_text:
                    json_content = response_text.split("```json")[1].split("```")[0].strip()
                    result = json.loads(json_content)
                elif "```" in response_text:
                    json_content = response_text.split("```")[1].split("```")[0].strip()
                    result = json.loads(json_content)
                else:
                    result = json.loads(response_text)
                
                # Ensure we have the expected keys
                positive_score = result.get('positive_score', 0.0)
                negative_score = result.get('negative_score', 0.0)
                neutral_score = result.get('neutral_score', 0.0)
                overall_score = result.get('overall_score', 0.5)
                classification = result.get('classification', 'neutral')
                
                # Convert overall_score to numerical_score (-1.0 to 1.0 scale)
                numerical_score = (overall_score - 0.5) * 2
                
            except (json.JSONDecodeError, KeyError) as e:
                logger.warning(f"Could not parse Gemini response as JSON: {e}. Using fallback parsing.")
                
                # Fallback parsing - extract scores using regex
                positive_match = re.search(r'positive_score["\s:]+([0-9.]+)', response_text)
                positive_score = float(positive_match.group(1)) if positive_match else 0.0
                
                negative_match = re.search(r'negative_score["\s:]+([0-9.]+)', response_text)
                negative_score = float(negative_match.group(1)) if negative_match else 0.0
                
                overall_match = re.search(r'overall_score["\s:]+([0-9.]+)', response_text)
                overall_score = float(overall_match.group(1)) if overall_match else 0.5
                
                # Calculate numerical_score (-1.0 to 1.0 scale)
                numerical_score = (overall_score - 0.5) * 2
                
                # Determine classification
                if "positive" in response_text.lower():
                    classification = "positive"
                elif "negative" in response_text.lower():
                    classification = "negative"
                else:
                    classification = "neutral"
            
            return {
                'numerical_score': numerical_score,
                'classification': classification,
                'detailed_scores': {
                    'positive': positive_score,
                    'negative': negative_score,
                    'neutral': neutral_score,
                    'overall': overall_score
                }
            }
        except Exception as e:
            logger.error(f"Error analyzing with Gemini: {e}")
            return {'numerical_score': 0, 'classification': 'neutral', 'detailed_scores': {}}
            
    def analyze_with_openai(self, text):
        """
        Analyze sentiment using OpenAI API directly
        Returns a dictionary with sentiment scores
        """
        try:
            # Ensure OpenAI API key is initialized
            if not self.openai_api_key:
                self._load_openai()
            
            # API endpoint for OpenAI
            API_URL = "https://api.openai.com/v1/chat/completions"
            
            # Create prompt for sentiment analysis
            system_prompt = """
            You are a financial sentiment analysis system. Analyze the sentiment of financial news text.
            Rate the sentiment on a scale from 0.0 to 1.0, where:
            - 0.0 is extremely negative/bearish
            - 0.5 is neutral
            - 1.0 is extremely positive/bullish
            
            Respond with ONLY a JSON object containing:
            - positive_score: a float value between 0 and 1
            - negative_score: a float value between 0 and 1
            - neutral_score: a float value between 0 and 1
            - overall_score: a float value between 0 and 1 (where 0.5 is neutral)
            - classification: one of "positive", "negative", or "neutral"
            """
            
            user_prompt = f"Text to analyze: {text}"
            
            # Get model from config or use default
            model = self.config.get('openai_model', 'gpt-4-turbo-preview')
            
            # Prepare request
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.openai_api_key}'
            }
            
            body = {
                'model': model,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'response_format': {'type': 'json_object'},
                'max_tokens': 150,
                'temperature': 0.3  # Low temperature for more consistent results
            }
            
            # Call OpenAI API
            response = requests.post(API_URL, headers=headers, json=body)
            
            # Check for successful response
            if response.status_code != 200:
                logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
                raise Exception(f"OpenAI API returned status code {response.status_code}")
            
            # Parse the response
            response_data = response.json()
            result_text = response_data['choices'][0]['message']['content']
            result = json.loads(result_text)
            
            # Extract the values
            positive_score = result.get('positive_score', 0.0)
            negative_score = result.get('negative_score', 0.0)
            neutral_score = result.get('neutral_score', 0.0)
            overall_score = result.get('overall_score', 0.5)
            classification = result.get('classification', 'neutral')
            
            # Convert overall_score to numerical_score (-1.0 to 1.0 scale)
            numerical_score = (overall_score - 0.5) * 2
            
            return {
                'numerical_score': numerical_score,
                'classification': classification,
                'detailed_scores': {
                    'positive': positive_score,
                    'negative': negative_score,
                    'neutral': neutral_score,
                    'overall': overall_score
                }
            }
        except Exception as e:
            logger.error(f"Error analyzing with OpenAI: {e}")
            return {'numerical_score': 0, 'classification': 'neutral', 'detailed_scores': {}}
    
    def weighted_integration(self, finbert_result, second_model_result):
        """
        Implement the Weighted Integration Algorithm
        - Model consensus evaluation (70% agreement required)
        - Confidence score calculation based on model agreement
        - Normalization to scale of -100 (bearish) to +100 (bullish)
        """
        # Check model agreement
        models_agree = finbert_result['classification'] == second_model_result['classification']
        
        # Calculate base score (average of the two models)
        # FinBERT range: -1.0 to +1.0, Second model range is similar for our purposes
        base_score = (finbert_result['numerical_score'] + second_model_result['numerical_score']) / 2
        
        # Calculate confidence score based on model agreement and score differences
        score_difference = abs(finbert_result['numerical_score'] - second_model_result['numerical_score'])
        confidence = 1.0 if models_agree else max(0.0, 1.0 - score_difference)
        
        # Apply confidence to score
        adjusted_score = base_score * confidence
        
        # Normalize to -100 to +100 scale
        normalized_score = adjusted_score * 100
        
        # Final classification with financial terminology
        if normalized_score > 10:
            classification = 'bullish'
        elif normalized_score < -10:
            classification = 'bearish'
        else:
            classification = 'neutral'
        
        return {
            'numerical_score': normalized_score,
            'classification': classification,
            'models_agree': models_agree,
            'confidence': confidence,
            'model_scores': {
                'finbert': finbert_result['numerical_score'],
                'second_model': second_model_result['numerical_score']
            }
        }
    
    def analyze_sentiment(self, text, use_openai=True):
        """
        Main function to analyze sentiment of financial text
        - Preprocessing
        - Text splitting
        - Model processing
        - Score integration
        
        Parameters:
        - text: The text to analyze
        - use_openai: Whether to use OpenAI as the second model (if False, uses Gemini)
        
        Returns a dictionary with integrated sentiment analysis
        """
        # Preprocess the text
        preprocessed_text = self.preprocess_text(text)
        
        # Split the text into manageable segments
        text_segments = self.split_text(preprocessed_text)
        
        # Process each segment with both models
        finbert_results = []
        second_model_results = []
        
        for segment in text_segments:
            finbert_results.append(self.analyze_with_finbert(segment))
            
            # Use either OpenAI or Gemini as the second model
            if use_openai:
                second_model_results.append(self.analyze_with_openai(segment))
            else:
                second_model_results.append(self.analyze_with_gemini(segment))
        
        # Integrate scores for each segment
        integrated_results = []
        for i in range(len(text_segments)):
            integrated_results.append(
                self.weighted_integration(finbert_results[i], second_model_results[i])
            )
        
        # Aggregate results from all segments
        if not integrated_results:
            return {
                'numerical_score': 0,
                'classification': 'neutral',
                'confidence': 0,
                'segment_count': 0
            }
        
        # Calculate weighted average based on confidence
        total_weight = sum(result['confidence'] for result in integrated_results)
        if total_weight == 0:
            total_weight = 1  # Avoid division by zero
            
        final_score = sum(result['numerical_score'] * result['confidence'] for result in integrated_results) / total_weight
        
        # Final classification
        if final_score > 10:
            final_classification = 'bullish'
        elif final_score < -10:
            final_classification = 'bearish'
        else:
            final_classification = 'neutral'
        
        # Calculate average confidence
        avg_confidence = sum(result['confidence'] for result in integrated_results) / len(integrated_results)
        
        # Calculate agreement rate
        agreement_count = sum(1 for result in integrated_results if result['models_agree'])
        agreement_rate = agreement_count / len(integrated_results)
        
        return {
            'numerical_score': final_score,
            'classification': final_classification,
            'confidence': avg_confidence,
            'agreement_rate': agreement_rate,
            'segment_count': len(text_segments),
            'segment_results': integrated_results
        }

# Expose a simple interface for external use - this is the function your routes are expecting
def get_sentiment(text, use_openai=False, use_gemini=True, config=None):
    """
    Analyze the sentiment of a financial text using the SentimentAnalyzer
    
    Parameters:
    - text: The text to analyze
    - use_openai: Whether to use OpenAI as the second model
    - use_gemini: Whether to use Gemini as the second model (ignored if use_openai is True)
    - config: Optional configuration dictionary for API keys and settings
    
    Returns a dictionary with sentiment analysis results
    """
    # If neither OpenAI nor Gemini is specified, just use FinBERT
    if not use_openai and not use_gemini:
        pipeline = get_finbert_pipeline()
        results = pipeline(text)
        
        # Extract scores and convert to proper format
        scores_dict = {item['label'].lower(): item['score'] for item in results}
        
        # Calculate numerical score (-1.0 to +1.0)
        numerical_score = scores_dict.get('positive', 0) - scores_dict.get('negative', 0)
        
        # Determine classification
        if numerical_score > 0.1:
            classification = 'positive'
        elif numerical_score < -0.1:
            classification = 'negative'
        else:
            classification = 'neutral'
        
        return {
            'numerical_score': numerical_score * 100,  # Scale to match the -100 to 100 scale
            'classification': classification,
            'confidence': 1.0,  # Single model, so confidence is always 1.0
            'agreement_rate': 1.0,
            'detailed_scores': scores_dict
        }
    
    # Use the full analyzer with a second model
    analyzer = SentimentAnalyzer(config)
    result = analyzer.analyze_sentiment(text, use_openai=use_openai)
    
    # Return the full result for comprehensive analysis
    return result