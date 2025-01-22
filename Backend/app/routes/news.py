from flask import Blueprint, request
from app.models.news import News
from app.utils.decorators import jwt_required
from app.services.data_ingestion_gnews import DataIngestion
from app.services.data_ingestion_finviz import get_finviz_news_by_entity
from app.utils.helpers import format_response, format_date_into_tuple_for_gnews
from datetime import date, timedelta

news_bp = Blueprint('news', __name__)    


# ** generate news data based on entity
@news_bp.route('/gnews', methods=['POST'])
def ingest_news_gnews_entity():
    # Get the entity, period, start_date, and end_date from the request
    entity = request.json.get('entity')

    # Get the start_date from the first day of last month and end_date as today
    start_date = (date.today().replace(day=1) - timedelta(days=1)).replace(day=1).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")

    # Create an instance of the DataIngestion class
    data_ingestion = DataIngestion(entity)

    format_start_date = format_date_into_tuple_for_gnews(start_date)
    data_ingestion.set_start_date(format_start_date)

    format_end_date = format_date_into_tuple_for_gnews(end_date)
    data_ingestion.set_end_date(format_end_date)

    # Ingest the data
    Result = data_ingestion.ingest_data()

    if Result:
        return format_response(Result, "News data generated and saved successfully", 201)
    
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

# ** generate all news from latest news
@news_bp.route('/all', methods=['POST'])
def ingest_all_news():
    return

# ** get news based on entity
@news_bp.route("/<string:entity>", methods=['GET'])
def get_news(entity):
    news = News.query.filter(News.entities.contains({"entities": [entity]})).all()
    news_list = []
    for n in news:
        news_list.append({
            "id": n.id,
            "publisher": n.publisher,
            "description": n.description,
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
            "published_date": n.published_date,
            "title": n.title,
            "url": n.url,
            "entities": n.entities
        })
    return format_response(news_list, "News fetched successfully", 200)