import yfinance as yf
import requests_cache
import datetime
import time
from app import db
from app.models.news import News as NewsModel
from app.utils.helpers import get_article_details
from app.services.article_scraper import scrape_article
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

    rate_limit_interval = 60 / 15  # 15 requests per minute

    for news_item in news:
        time.sleep(rate_limit_interval)  # Sleep to respect rate limit

        link = news_item['link']

        try:
            # Check if the URL already exists in the database
            existing_news = NewsModel.query.filter_by(url=link).first()
            if existing_news:
                continue

            # Scrape the article details
            article = scrape_article(link)
            if not article:
                print(f"Failed to scrape article for URL: {link}")
                continue

            # Get the article details
            article_details = get_article_details(link, article)
            description = article_details['text']
            summary = article_details['summary']
            published_date = news_item["providerPublishTime"]
            published_date = datetime.datetime.fromtimestamp(news_item["providerPublishTime"])
            title = news_item["title"]
            score = article_details['numerical_score']
            finbert_score = article_details['finbert_score']
            second_model_score = article_details['second_model_score']
            sentiment = article_details['classification']
            tags = article_details['keywords']
            confidence = article_details['confidence']
            agreement_rate = article_details['agreement_rate']
            company_names = article_details['companies']
            regions = article_details['regions']
            sectors = article_details['sectors']

            if description == "An error occurred while fetching the article details":
                continue

            print("title: ", title)

            news_db = NewsModel(
                publisher=news_item['publisher'],
                description=description,
                published_date=published_date,
                title=title,
                url=link,
                entities=[ticker],
                summary=summary,
                score=score,
                finbert_score=finbert_score,
                second_model_score=second_model_score,
                sentiment=sentiment,
                tags=tags,
                confidence=confidence,
                agreement_rate=agreement_rate,
                company_names=company_names,
                regions=regions,
                sectors=sectors
            )

            newslist.append({
                "publisher": news_item['publisher'],
                "description": description,
                "published_date": published_date,
                "title": title,
                "url": link,
                "entities": [ticker],
                "summary": summary,
                "score": score,
                "finbert_score": finbert_score,
                "second_model_score": second_model_score,
                "sentiment": sentiment,
                "tags": tags,
                "confidence": confidence,
                "agreement_rate": agreement_rate,
                "company_names": company_names,
                "regions": regions,
                "sectors": sectors
            })

            db.session.add(news_db)
            db.session.commit()

        except Exception as e:
            print(f"An error occurred: {e}")
    
    return newslist
