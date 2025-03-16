from app.models.news import News
from sqlalchemy import any_, func
from datetime import datetime, timedelta

def news_by_ticker(ticker, page=1, per_page=3):
    """Get paginated news by ticker"""
    query = News.query.filter(ticker == any_(News.entities)).order_by(News.published_date.desc())

    # Apply pagination
    news_paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    if not news_paginated.items:
        return []

    news_list = [{
        "id": n.id,
        "publisher": n.publisher,
        "description": n.description,
        "summary": n.summary,
        "published_date": n.published_date.strftime('%Y-%m-%d %H:%M:%S'),
        "title": n.title,
        "url": n.url,
        "entities": n.entities,
        "score": n.score,
        "sentiment": n.sentiment,
        "tags": n.tags
    } for n in news_paginated.items]

    return {
        "news": news_list,
        "total": news_paginated.total,
        "pages": news_paginated.pages,
        "current_page": news_paginated.page,
        "next_page": news_paginated.next_num,
        "prev_page": news_paginated.prev_num,
        "per_page": per_page
    }

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

def all_news(page=1, per_page=4, filter_time="all", sort_order="desc"):
    """Get all news"""
    # Query the news
    query = News.query

    # Filtering based on date
    if filter_time != "all":
        now = datetime.now()
        if filter_time == "24":
            query = query.filter(News.published_date >= now - timedelta(hours=24))
        elif filter_time == "48":
            query = query.filter(News.published_date >= now - timedelta(hours=48))
        elif filter_time == "7d":
            query = query.filter(News.published_date >= now - timedelta(days=7))

    # Sorting based on sentiment score
    if sort_order == 'asc':
        query = query.order_by(News.score.asc())
    else:
        query = query.order_by(News.score.desc())

    news_paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    news_list = []
    for n in news_paginated.items:
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
            "tags": n.tags
        })

    return {
        "news": news_list,
        "total": news_paginated.total,
        "pages": news_paginated.pages,
        "current_page": news_paginated.page,
        "next_page": news_paginated.next_num,
        "prev_page": news_paginated.prev_num,
        "per_page": per_page
    }