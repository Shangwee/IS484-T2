from flask import Blueprint, request
from app.models.news import News
from app import db
from app.utils.decorators import jwt_required
from app.services.data_ingestion import DataIngestion
from app.utils.helpers import format_response, format_date_into_tuple_for_gnews
from datetime import date, timedelta

news_bp = Blueprint('news', __name__)    

# ** get news based on entity
@news_bp.route("/<string:entity>", methods=['GET'])
def get_news(entity):
    news = News.query.filter_by(entity=entity).all()
    news_list = []
    for n in news:
        news_list.append({
            "id": n.id,
            "publisher": n.publisher,
            "description": n.description,
            "published_date": n.published_date,
            "title": n.title,
            "url": n.url,
            "entity": n.entity
        }) 
    return format_response(news_list, "News fetched successfully", 200)


# ** generate news data based on entity
@news_bp.route('/', methods=['POST'])
def ingest_news():
    # Get the entity, period, start_date, and end_date from the request
    entity = request.json.get('entity')
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
        # Insert the data into the database
        data_ingestion.insert_data_to_db()
        return format_response(Result, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

