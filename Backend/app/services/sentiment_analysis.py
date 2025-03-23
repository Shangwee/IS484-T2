from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import numpy as np
import re
import logging
import json
import requests
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
MAX_SEGMENT_LENGTH = 512  # Maximum length for text segments
AGREEMENT_THRESHOLD = 0.7  # 70% agreement required between models
SENTIMENT_THRESHOLD = 0.1  # Threshold for determining positive/negative sentiment

class SentimentAnalyzer:
    def __init__(self):
        self.finbert_pipeline = self._load_finbert()
        self.gemini_client = None
        self.openai_client = None
        logger.info("Sentiment Analyzer initialized with FinBERT model")
    
    def _load_finbert(self):
        """Initialize and load the FinBERT model"""
        model_name = "yiyanghkust/finbert-tone"
        try:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForSequenceClassification.from_pretrained(model_name)
            return pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
        except Exception as e:
            logger.error(f"Error loading FinBERT model: {e}")
            raise
    
    def _load_gemini(self):
        """Initialize Gemini AI client"""
        try:
            # Direct API key for testing purposes
            api_key = "AIzaSyCoFKaRY6MmS-nUQ0EUWX3iJ3laHIIBh3Q"  # REPLACE WITH YOUR ACTUAL API KEY
                
            # Configure the Gemini API client
            genai.configure(api_key=api_key)
            self.gemini_client = genai.GenerativeModel("gemini-1.5-flash")
            
            logger.info("Gemini AI client initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Error loading Gemini client: {e}")
            raise
            
    def _load_openai(self):
        """Initialize OpenAI client"""
        try:
            # Direct API key for testing purposes
            self.openai_api_key = "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"  # REPLACE WITH YOUR ACTUAL API KEY
                        

            # We're not using the client library directly anymore, just storing the API key
            logger.info("OpenAI API key stored successfully")
            return True
        except Exception as e:
            logger.error(f"Error storing OpenAI API key: {e}")
            raise
    
    def preprocess_text(self, text):
        """
        Preprocess the input text for sentiment analysis
        - Entity extraction
        - Text summarization
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
            if not hasattr(self, 'openai_api_key'):
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
            
            # Prepare request
            import requests
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.openai_api_key}'
            }
            
            body = {
                'model': 'gpt-4-turbo-preview',  # or gpt-3.5-turbo for faster, cheaper analysis
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
        Implement the Weighted Integration Algorithm (WIP)
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

# Expose a simple interface for external use
def get_sentiment(text, use_openai=True):
    """
    Analyze the sentiment of a financial text using the SentimentAnalyzer
    
    Parameters:
    - text: The text to analyze
    - use_openai: Whether to use OpenAI as the second model (if False, uses Gemini)
    
    Returns a dictionary with sentiment analysis results
    """
    analyzer = SentimentAnalyzer()
    result = analyzer.analyze_sentiment(text, use_openai=use_openai)
    
    # Return a simplified result object for external use
    return {
        'numerical_score': result['numerical_score'],
        'classification': result['classification'],
        'confidence': result['confidence'],
        'agreement_rate': result['agreement_rate']
    }

# Example usage
if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    
    sample_text = """
    Tesla reported strong Q4 earnings, beating analyst expectations with revenue growth of 12% year-over-year. 
    The company's automotive gross margins improved to 21.6%, and the company expects to increase production significantly in 2025.
    However, some analysts remain concerned about increasing competition in the electric vehicle market.
    """
    
    # Test with just FinBERT for simplicity
    finbert_only = analyzer.analyze_with_finbert(sample_text)
    print("=== FinBERT Analysis Only ===")
    print(f"Sentiment: {finbert_only['classification']}")
    print(f"Score: {finbert_only['numerical_score']:.2f}")
    print(f"Details: {finbert_only['detailed_scores']}")
    
    # Uncomment to test with Gemini (replace YOUR_GEMINI_API_KEY_HERE with your actual key)
    """
    # Compare FinBERT + Gemini results
    gemini_result = analyzer.analyze_sentiment(sample_text, use_openai=False)
    
    print("\n=== FinBERT + Gemini Analysis ===")
    print(f"Sentiment: {gemini_result['classification']}")
    print(f"Score: {gemini_result['numerical_score']:.2f}")
    print(f"Confidence: {gemini_result['confidence']:.2f}")
    print(f"Agreement rate: {gemini_result['agreement_rate']:.2f}")
    print(f"Segments analyzed: {gemini_result['segment_count']}")
    """
    
    # Test comparison between FinBERT and both models
    try:
        finbert_result = analyzer.analyze_with_finbert(sample_text)
        
        # Set your API keys here for quick testing
        analyzer.gemini_client = None  # Reset to force initialization
        analyzer._load_gemini()
        gemini_result = analyzer.analyze_with_gemini(sample_text)
        
        print("\n=== Model Comparison ===")
        print(f"FinBERT Classification: {finbert_result['classification']}")
        print(f"FinBERT Score: {finbert_result['numerical_score']:.2f}")
        print(f"Gemini Classification: {gemini_result['classification']}")
        print(f"Gemini Score: {gemini_result['numerical_score']:.2f}")
        
        # Uncomment to also test OpenAI (replace YOUR_OPENAI_API_KEY_HERE with your actual key)
       
        openai_result = analyzer.analyze_with_openai(sample_text)
        print(f"OpenAI Classification: {openai_result['classification']}")
        print(f"OpenAI Score: {openai_result['numerical_score']:.2f}")
       
        
        # Integrated results
        integrated = analyzer.weighted_integration(finbert_result, gemini_result)
        print("\n=== Integrated Result ===")
        print(f"Classification: {integrated['classification']}")
        print(f"Score: {integrated['numerical_score']:.2f}")
        print(f"Models agree: {integrated['models_agree']}")
        print(f"Confidence: {integrated['confidence']:.2f}")
        
    except Exception as e:
        print(f"Error during comparison test: {e}")