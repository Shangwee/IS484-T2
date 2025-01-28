from nltk.sentiment.vader import SentimentIntensityAnalyzer
from app.models.news import News
from app import db
import nltk

nltk.download('vader_lexicon')

def get_sentiment(text):
    sia = SentimentIntensityAnalyzer()

    # Get the sentiment of the article
    sentiment = sia.polarity_scores(text)

    # Get the compound score
    compound = sentiment["compound"]

    # Return the sentiment
    return compound