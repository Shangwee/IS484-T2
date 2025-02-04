# This script uses the Gemini API to summarise a given text to a specified length. The summarise_news function takes in the news_text and summary_length as arguments and returns the summarised text.

import os
from dotenv import load_dotenv
import google.generativeai as genai

def summarise_news(news_text, summary_length):
    # Load environment variables from .env file
    load_dotenv()

    api_key = os.getenv("GEMINI_API_KEY")  # Retrieve API key securely

    if not api_key:
        raise ValueError("API key not found. Please set the GEMINI_API_KEY in the .env file.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(f"summarise this in {summary_length} words or less: {news_text}")

    # Print the response object to inspect its structure
    print(response)

    # Return only the text of the response
    return response.candidates[0].content.parts[0].text

if __name__ == "__main__":
    summary = summarise_news(news_text, summary_length)
    print(summary)