from flask import Blueprint, request, jsonify
import json
from sqlalchemy import any_, func
from app.models.news import News
from app.models.entity import Entity
from app.utils.decorators import jwt_required
from app.services.data_ingestion_gnews import get_gnews_news_by_entity, get_all_top_gnews
from app.services.data_ingestion_finviz import get_finviz_news_by_entity, get_all_finviz
from app.services.data_ingestion_yfinance import get_stock_news
from app.utils.helpers import format_response, format_date_into_tuple_for_gnews
from datetime import date, timedelta

news_bp = Blueprint('news', __name__)    


# ** generate news data based on entity
@news_bp.route('/gnews', methods=['POST'])
def ingest_news_gnews_entity():
    # Get the entity, period, start_date, and end_date from the request
    entity = request.json.get('entity')

    # Get the start_date from 24hr before today and end_date as today
    start_date = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")

    # Format the date into a tuple for gnews
    format_start_date = format_date_into_tuple_for_gnews(start_date)
    format_end_date = format_date_into_tuple_for_gnews(end_date)

    # Get the news using gnews and save it to the database
    result = get_gnews_news_by_entity(entity, format_start_date, format_end_date)

    if result:
        return format_response(result, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** generate news data based on entity using finviz
@news_bp.route('/finviz', methods=['POST'])
def ingest_news_finviz_entity():
    # Get the entity, period, start_date, and end_date from the request
    entity = request.json.get('entity')

    # Get the news using finviz and save it to the database
    news = get_finviz_news_by_entity(entity)

    if len(news) > 0:
        return format_response(news, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** generate news data based on entity using yfinance
@news_bp.route('/yfinance', methods=['POST'])
def ingest_news_yfinance_entity():
    # Get the entity, period, start_date, and end_date from the request
    name = request.json.get('entity')

    # Get the news using yfinance and save it to the database
    news = get_stock_news(name)

    if len(news) > 0:
        return format_response(news, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** generate all news from latest news
@news_bp.route('/all', methods=['POST'])
def ingest_all_news():
    # Get the news using gnews and save it to the database
    gnews_result = get_all_top_gnews()
    print("gnews done")

    # Get the news using finviz and save it to the database
    finviz_result = get_all_finviz()
    print("finviz done")

    # Combine the results from both sources
    result = gnews_result + finviz_result

    if result:
        return format_response(result, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** get news based on entity
@news_bp.route("/<string:entity>", methods=['GET'])
def get_news(entity):

    # Query using PostgreSQL ANY operator for array type
    news = News.query.filter(
        entity == any_(News.entities)
    ).all()

    if not news:
        return format_response([], "No news found for this entity", 404)

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
            "entities": n.entities
        }) 
    return format_response(news_list, "News fetched successfully", 200)

# ** get news based on id
@news_bp.route("/<int:id>", methods=['GET'])
def get_news_by_id(id):
    news = News.query.get(id)
    if news:
        return format_response({
            "id": news.id,
            "publisher": news.publisher,
            "description": news.description,
            "summary": news.summary,
            "published_date": news.published_date,
            "title": news.title,
            "url": news.url,
            "entities": news.entities
        }, "News fetched successfully", 200)
    return format_response([], "News not found", 404)   

# ** get all news
@news_bp.route("/", methods=['GET'])
def get_all_news():
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
            "entities": n.entities
        })
    return format_response(news_list, "News fetched successfully", 200)