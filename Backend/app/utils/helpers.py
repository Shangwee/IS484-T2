from flask import jsonify
import time
from newspaper import article
from googlenewsdecoder import new_decoderv1
import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
import json

# ** General-purpose helper functions for common tasks like formatting responses or handling dates.

def format_response(data, message="Success", status_code=200):
    return jsonify({
        "status": status_code,
        "message": message,
        "data": data
    }), status_code

def calculate_percentage(part, whole):
    if whole == 0:
        return 0
    return (part / whole) * 100

def password_rule_checker(password):
    # Check if password is at least 8 characters long
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    # Check if password has at least one uppercase letter
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    # Check if password has at least one lowercase letter
    if not any(char.islower() for char in password):
        return False, "Password must contain at least one lowercase letter"
    # Check if password has at least one digit
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    # Check if password has at least one special character
    if not any(char in "!@#$%^&*()-_=+[]{}|;:,.<>?/~" for char in password):
        return False, "Password must contain at least one special character"
    return True, "Password meets all requirements"


def format_date_into_tuple_for_gnews(date):
    date = date.split("-")
    return (int(date[0]), int(date[1]), int(date[2]))

def URL_decoder(url):
    # Decode the URL
    try: 
        decoded_url = new_decoderv1(url)
        if decoded_url.get("status"):
            return decoded_url
        else:
            print("Error:", decoded_url["message"])
    except Exception as e:
        print(f"Error occurred: {e}")

def get_article_details(url, article_html):
    from app.services.sentiment_analysis import get_sentiment  # Move import here to avoid circular import
    try:
        time.sleep(10)
        # Fetch the article details
        article_result = article(url, input_html=article_html)
        article_result.nlp()

        # Summarise the article text
        interpreted_news = news_interpreter(article_result.text, 100)

        # extract the metadata from the interpreted news
        metadata = interpreted_news.get("metadata", {})
        companies = metadata.get("companies", [])
        regions = metadata.get("regions", [])
        sectors = metadata.get("sectors", [])

        # Extract the summary from the interpreted news
        summary = interpreted_news.get("summary", "No summary available")
        if not summary:
            summary = article_result.summary

        # get the sentiment of the article
        sentiment = get_sentiment(article_result.title + summary, False)

        keyword = article_result.keywords
    
        return {
            "text": article_result.text,
            "summary": summary,
            'numerical_score': sentiment['numerical_score'],
            'finbert_score': sentiment['finbert_score'],
            'second_model_score': sentiment['second_model_score'],
            'classification': sentiment['classification'],
            'confidence': sentiment['confidence'],
            'agreement_rate': sentiment['agreement_rate'],
            'keywords': keyword,
            'companies': companies,
            'regions': regions,
            'sectors': sectors,
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            "text": "An error occurred while fetching the article details",
            "summary": "An error occurred while fetching the article details",
            'numerical_score': 0,
            'finbert_score': 0,
            'second_model_score': 0,
            'classification': "neutral",
            'confidence': 0,
            'agreement_rate': 0,
            'keywords': [],
            'companies': [],
            'regions': [],
            'sectors': [],
        }


def news_interpreter(news_text, summary_length):

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("API key not found. Please set the GEMINI_API_KEY in the .env file.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
        You are a financial news assistant.

        Given the news article below, do the following:

        1. Summarize the article in {summary_length} words or less.
        2. Extract the involved company names, regions, and sectors.

        {news_text}

        Output format:
        {{
            "summary": "your summary here (within {summary_length} words)",
            "metadata": {{
                "companies": "...", 
                "regions": "...", 
                "sectors": "..."
            }}
        }}

        Important rules:
        - Return ONLY the JSON object with no other text, markdown formatting, or code block markers.
        - When returning company names, use their full security names (e.g. Taiwan Semiconductor Manufacturing Company Limited, not TSM).
        - For sectors, return their full GICS sector names only.
        - For regions, include both country name and World Bank region (e.g. United States, North America).
        - Respond strictly in a single valid JSON object. Do not include any explanations, line breaks outside JSON, or extra characters. Invalid formats will be rejected.
    """

    response = model.generate_content(prompt)

    # Check if we have a valid response
    if not response or not response.candidates or not response.candidates[0].content.parts:
        print("Error: No valid response received from the model")
        return None
    
    # Process the response
    news_summary = response.candidates[0].content.parts[0].text
    
    # Clean the text of any markdown or extra formatting
    clean_text = re.sub(r'```json\s*|\s*```$', '', news_summary)
    clean_text = clean_text.strip()

    # check if the response is a valid JSON object
    parsed_response = safe_parse_gemini_response(clean_text)

    if parsed_response:
        summary = parsed_response.get("summary")
        metadata = parsed_response.get("metadata")

        companies = ensure_list(metadata.get("companies", []))
        regions = ensure_list(metadata.get("regions", []))
        sectors = ensure_list(metadata.get("sectors", []))

        return {
            "summary": summary,
            "metadata": {
                "companies": companies,
                "regions": regions,
                "sectors": sectors
            }
        }
    else:
        print("Error: Invalid JSON format in response")
        return None

def safe_parse_gemini_response(text):
    try:
        result = json.loads(text)
        if all(key in result for key in ("summary", "metadata")):
            meta = result["metadata"]
            if all(k in meta for k in ("companies", "regions", "sectors")):
                return result
            else:
                raise ValueError("Missing keys in metadata")
        else:
            raise ValueError("Missing top-level keys")
    except Exception as e:
        print("❌ Invalid format:", e)
        return None

def ensure_list(item):
    if isinstance(item, str):
        return [i.strip() for i in item.split(',')]
    elif isinstance(item, list):
        return [i.strip() for i in item]
    else:
        return []