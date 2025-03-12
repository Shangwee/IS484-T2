from app.models.news import News
from sqlalchemy import any_, func

def news_by_ticker(ticker):
    """Get news by ticker"""
    # Query using PostgreSQL ANY operator for array type
    news = News.query.filter(
        ticker == any_(News.entities)
    ).all()

    if not news:
        return []

    news_list = []
    for n in news:
        news_list.append({
            "id": n.id,
            "publisher": n.publisher,
            "description": n.description,
            "summary": n.summary,
            "published_date": n.published_date,
            "title": n.title,
            "url": n.url,
            "entities": n.entities,
            "score": n.score,
            "sentiment": n.sentiment,
            "tags":n.tags
        })
    return news_list

def news_by_id(news_id):
    """Get news by ID"""
    news = News.query.get(news_id)
    if news:
        return {
            "id": news.id,
            "publisher": news.publisher,
            "description": news.description,
            "summary": news.summary,
            "published_date": news.published_date,
            "title": news.title,
            "url": news.url,
            "entities": news.entities,
            "score": news.score,
            "sentiment": news.sentiment,
            "tags":news.tags
        }
    return None

def all_news():
    """Get all news"""
    news = News.query.all()
    news_list = []
    for n in news:
        news_list.append({
            "id": n.id,
            "publisher": n.publisher,
            "description": n.description,
            "summary": n.summary,
            "published_date": n.published_date,
            "title": n.title,
            "url": n.url,
            "entities": n.entities,
            "score": n.score,
            "sentiment": n.sentiment,
            "tags":n.tags
        })
    return news_list