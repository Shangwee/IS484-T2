import yfinance as yf
import requests_cache
import datetime
from app import db
from app.models.news import News as NewsModel
from app.utils.helpers import get_article_details
session = requests_cache.CachedSession('yfinance.cache')
session.headers['User-agent'] = 'my-program/1.0'



def get_stock_price(ticker):
    stock = yf.Ticker(ticker, session=session)
    stock.actions
    stock_info = stock.info
    stock_price = stock_info['currentPrice']
    return stock_price

def get_stock_history(ticker):
    stock = yf.Ticker(ticker, session=session)
    df = stock.history(period='1mo')

    if df.empty:
        return None

    # Convert DataFrame to JSON format
    data = {
        "dates": df.index.strftime('%Y-%m-%d').tolist(),
        "prices": df['Close'].tolist()
    }
    return data


def get_stock_news(ticker):
    stock = yf.Search(ticker, session=session, enable_fuzzy_query = True, include_cb=False)
    news = stock.news

    newslist = []

    for news_item in news:
        link = news_item['link']

        try:
            article_details = get_article_details(link)
            description = article_details['text']
            summary = article_details['summary']
            published_date = news_item["providerPublishTime"]
            published_date = datetime.datetime.fromtimestamp(news_item["providerPublishTime"])
            title = news_item["title"]


            # Check if the URL already exists in the database
            existing_news = NewsModel.query.filter_by(url=link).first()
            if existing_news:
                continue

            news_db = NewsModel(
                publisher=news_item['publisher'],
                description=description,
                published_date=published_date,
                title=title,
                url=link,
                entities=[ticker],
                summary=summary
            )

            newslist.append({
                "publisher": news_item['publisher'],
                "description": description,
                "published_date": published_date,
                "title": title,
                "url": link,
                "entities": [ticker],
                "summary": summary
            })

            db.session.add(news_db)
            db.session.commit()

        except Exception as e:
            print(f"An error occurred: {e}")
    
    return newslist
