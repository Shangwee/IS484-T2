from app import db
from app.models.news import News as NewsModel
from finvizfinance.quote import finvizfinance
from finvizfinance.news import News
from app.utils.helpers import get_article_details
import pandas as pd
from datetime import datetime

# Foe this service we will be using finviz to get the news
def get_finviz_news_by_entity(query):

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
        description = ""
        try :
            #get article details
            article_details = get_article_details(row['Link'])
            description = article_details['text']
        except Exception as e:
            print(f"An error occurred: {e}")
            
        news_list.append({
            "published_date": row['Date'],
            "title": row['Title'],
            "description": description,
            "url": row['Link'],
            "publisher": row['Source'],
            "entity": query
        })

    # Insert the data into the database
    for news in news_list:
        # Check if the URL already exists in the database
        existing_news = NewsModel.query.filter_by(url=news['url']).first()

        if existing_news:
            continue
        # change entities to this format e.g., {entities:["Tesla", "Apple", "Microsoft"]}
        entities_list = {"entities": [news['entity']]}

        news_db = NewsModel(
            publisher=news['publisher'],
            description=news['description'],
            published_date=news['published_date'],
            title=news['title'],
            url=news['url'],
            entities=entities_list
        )

        db.session.add(news_db)
        db.session.commit()

    return news_list


# Get all news from finviz
def get_all_finviz():

    fnews = News()
    all_news = fnews.get_news()

    # Convert the news into a DataFrame
    all_news_df = pd.DataFrame(all_news['news'], columns=['Date', 'Title', 'Link', 'Source'])

    all_news_list = []

    # Convert the DataFrame into a list of dictionaries
    for index, row in all_news_df.iterrows():
        description = ""
        try:
            #get article details
            article_details = get_article_details(row['Link'])
            description = article_details['text']
        except Exception as e:
            print(f"An error occurred: {e}")
            continue

        print("here")

        all_news_list.append({
            "published_date": datetime.today().strftime('%Y-%m-%d'),
            "title": row['Title'],
            "description": description,
            "url": row['Link'],
            "publisher": row['Source']
        })

    # Insert the data into the database
    for news in all_news_list:
        # Check if the URL already exists in the database
        existing_news = NewsModel.query.filter_by(url=news['url']).first()

        if existing_news:
            continue

        entities_list = {"entities": ["Top News"]}

        news_db = NewsModel(
            publisher=news['publisher'],
            description=news['description'],
            published_date=news['published_date'],
            title=news['title'],
            url=news['url'],
            entities=entities_list
        )

        db.session.add(news_db)
        db.session.commit()

    return all_news_list