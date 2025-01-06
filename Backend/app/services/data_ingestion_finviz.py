from app import db
from app.models.news import News
from finvizfinance.quote import finvizfinance
from app.utils.helpers import get_article_details
import pandas as pd

# Foe this service we will be using finviz to get the news
def get_finviz_news(query):

    try:
        stock = finvizfinance(query)
    except Exception as e:
        print(f"An error occurred: {e}")
        return []
   
    # Get the news for the stock
    news = stock.ticker_news()

    # Convert the news into a DataFrame
    news_df = pd.DataFrame(news, columns=['Date', 'Title', 'Link', 'Source'])

    news_list = []

    # Convert the DataFrame into a list of dictionaries
    for index, row in news_df.iterrows():
        #get article details
        article_details = get_article_details(row['Link'])

        news_list.append({
            "published_date": row['Date'],
            "title": row['Title'],
            "description": article_details['text'],
            "url": row['Link'],
            "publisher": row['Source'],
            "entity": query
        })

    # Insert the data into the database
    for news in news_list:
        # Check if the URL already exists in the database
        existing_news = News.query.filter_by(url=news['url']).first()

        if existing_news:
            continue

        news_db = News(
            publisher=news['publisher'],
            description=news['description'],
            published_date=news['published_date'],
            title=news['title'],
            url=news['url'],
            entity=news['entity']
        )

        db.session.add(news_db)
        db.session.commit()

    return news_list
