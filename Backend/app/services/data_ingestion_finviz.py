from app import db
from app.models.news import News as NewsModel
from finvizfinance.quote import finvizfinance, Quote
from finvizfinance.news import News
from app.utils.helpers import get_article_details
from app.services.article_scraper import scrape_article
import pandas as pd
from datetime import datetime, timedelta

# Foe this service we will be using finviz to get the news
def get_finviz_news_by_ticker(query):

    try:
        stock = finvizfinance(query)
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    # Get the news for the stock
    news = stock.ticker_news()

    # get date as range of 24 hours
    today = datetime.today().strftime('%Y-%m-%d')
    yesterday = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')

    # Convert the news into a DataFrame
    news_df = pd.DataFrame(news, columns=['Date', 'Title', 'Link', 'Source'])

    news_list = []

    # Convert the DataFrame into a list of dictionaries
    for index, row in news_df.iterrows():
        description = "" 

        news_date = str(row['Date']).split(' ')[0]

        if news_date != today and news_date != yesterday:
            continue

        try :
             # Get article scraped
            article = scrape_article(row['Link'])

            #get article details
            article_details = get_article_details(row['Link'], article)
            description = article_details['text']
            summary = article_details['summary']
            score = article_details['numerical_score']
            sentiment = article_details['classification']
            tags = article_details['keywords']
            confidence = article_details['confidence']

            news_list.append({
                "published_date": row['Date'],
                "title": row['Title'],
                "description": description,
                "url": row['Link'],
                "publisher": row['Source'],
                "ticker": query,
                "summary": summary,
                "score": score,
                "sentiment": sentiment,
                "tags": tags,
                "confidence": confidence
            })

            # check if the news already exists in the database
            existing_news = NewsModel.query.filter_by(url=row['Link']).first()

            if existing_news:
                print("News already exists")
                continue

            news_db = NewsModel(
                publisher=row['Source'],
                description=description,
                published_date=row['Date'],
                title=row['Title'],
                url=row['Link'],
                entities=[query],
                summary=summary,
                score=score,
                sentiment=sentiment,
                tags=tags,
                confidence=confidence
            )

            db.session.add(news_db)
            db.session.commit()

            print("News added to database")

        except Exception as e:
            print(f"An error occurred: {e}")
            
        
    return news_list


# Get all news from finviz
def get_all_finviz():

    fnews = News()
    all_news = fnews.get_news()

    # get date as range of 24 hours
    today = datetime.today().strftime('%Y-%m-%d')
    yesterday = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')

    # Convert the news into a DataFrame
    all_news_df = pd.DataFrame(all_news['news'], columns=['Date', 'Title', 'Link', 'Source'])

    all_news_list = []

    # Convert the DataFrame into a list of dictionaries
    for index, row in all_news_df.iterrows():
        description = ""

        news_date = str(row['Date']).split(' ')[0]

        if news_date != today and news_date != yesterday:
            continue

        try:
            # Get article scraped
            article = scrape_article(row['Link'])

            #get article details
            article_details = get_article_details(row['Link'], article)
            description = article_details['text']
            summary = article_details['summary']
            score = article_details['numerical_score']
            sentiment = article_details['classification']
            tags = article_details['keywords']
            confidence = article_details['confidence']

            all_news_list.append({
                "published_date": news_date,
                "title": row['Title'],
                "description": description,
                "url": row['Link'],
                "publisher": row['Source'],
                "summary": summary,
                "score": score,
                "sentiment": sentiment,
                "tags": tags,
                "confidence": confidence
            })

            # check if the news already exists in the database
            existing_news = NewsModel.query.filter_by(url=row['Link']).first()

            if existing_news:
                continue

            news_db = NewsModel(
                publisher=row['Source'],
                description=description,
                published_date=news_date,
                title=row['Title'],
                url=row['Link'],
                entities=["Top News"],
                summary=summary,
                score=score,
                sentiment=sentiment,
                tags=tags,
                confidence=confidence
            )

            db.session.add(news_db)
            db.session.commit()
        except Exception as e:
            print(f"An error occurred: {e}")
    return all_news_list

def get_stock_price(ticker):
    quote = Quote()
    price = quote.get_current(ticker)
    return price

def get_stock_fundamentals(ticker):
    stock = finvizfinance(ticker)
    fundamentals = stock.ticker_fundament()
    return fundamentals
    