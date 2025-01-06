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

def get_sentiment_from_entity(entity):
    # Get all news related to the entity
    news = News.query.filter_by(entity=entity).all()

    # Get the sentiment of each news
    for n in news:
        # Get description and title
        text = n.title + ": " + n.description

        # check if sentiment already exists
        if n.sentiment:
            continue

        # Get the sentiment of the article
        n.sentiment = get_sentiment(text)

        # Commit the changes
        db.session.commit()

    return news