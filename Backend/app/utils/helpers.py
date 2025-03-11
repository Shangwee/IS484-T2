from flask import jsonify
import time
from newspaper import article
from googlenewsdecoder import new_decoderv1
import os
from dotenv import load_dotenv
import google.generativeai as genai

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
        summary = summarise_news(article_result.text, 100)

        # get the sentiment of the article
        sentiment = get_sentiment(article_result.title + summary)

        keyword = article_result.keywords

        print("Keywords:", keyword)
    
        return {
            "text": article_result.text,
            "summary": summary,
            'numerical_score': sentiment['numerical_score'],
            'classification': sentiment['classification'],
            'keywords': keyword
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            "text": "An error occurred while fetching the article details",
            "summary": "An error occurred while fetching the article details",
            'numerical_score': 0,
            'classification': "Neutral"}


def summarise_news(news_text, summary_length):
    # Load environment variables from .env file
    load_dotenv()

    api_key = os.getenv("GEMINI_API_KEY")  # Retrieve API key securely

    if not api_key:
        raise ValueError("API key not found. Please set the GEMINI_API_KEY in the .env file.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(f"summarise this in {summary_length} words or less: {news_text}")

    # Return only the text of the response
    return response.candidates[0].content.parts[0].text