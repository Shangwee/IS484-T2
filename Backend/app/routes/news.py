from flask import Blueprint, request
from app.utils.decorators import jwt_required
from app.services.news_services import news_by_ticker, news_by_id, all_news
from app.services.data_ingestion_finviz import get_finviz_news_by_ticker, get_all_finviz
from app.services.data_ingestion_gnews import get_gnews_news_by_ticker, get_all_top_gnews
from app.services.data_ingestion_yfinance import get_stock_news
from app.services.entities_service import get_ticker_by_entity, get_all_ticker_entities
from app.utils.helpers import format_response, format_date_into_tuple_for_gnews
from datetime import date, timedelta

news_bp = Blueprint('news', __name__)    


# ** generate news data based on ticker
@news_bp.route('/gnews', methods=['POST'])
def ingest_news_gnews_entity():
    # Get the entity, period, start_date, and end_date from the request
    entity = request.json.get('entity')

    # Get the ticker from the entity
    ticker = get_ticker_by_entity(entity)

    # Get the start_date from 24hr before today and end_date as today
    start_date = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")

    # Format the date into a tuple for gnews
    format_start_date = format_date_into_tuple_for_gnews(start_date)
    format_end_date = format_date_into_tuple_for_gnews(end_date)

    # Get the news using gnews and save it to the database
    result = get_gnews_news_by_ticker(ticker, format_start_date, format_end_date)

    if result:
        return format_response(result, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** generate news data based on ticker using finviz
@news_bp.route('/finviz', methods=['POST'])
def ingest_news_finviz_entity():
    # Get the entity, period, start_date, and end_date from the request
    entity = request.json.get('entity')

    # Get the ticker from the entity
    ticker = get_ticker_by_entity(entity)

    # Get the news using finviz and save it to the database
    news = get_finviz_news_by_ticker(ticker)

    if len(news) > 0:
        return format_response(news, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** generate news data based on ticker using yfinance
@news_bp.route('/yfinance', methods=['POST'])
def ingest_news_yfinance_entity():
    # Get the entity, period, start_date, and end_date from the request
    name = request.json.get('entity')

    # Get the ticker from the entity
    ticker = get_ticker_by_entity(name)

    # Get the news using yfinance and save it to the database
    news = get_stock_news(ticker)

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

    total_news = gnews_result + finviz_result

    if len(total_news) > 0:
        return format_response(total_news, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

# ** automate news of entity and all
@news_bp.route('/IngestNewsOfEntityAndAll', methods=['POST'])
def automate_news_of_entity_and_all():
    # get all ticker from entities table
    tickers_list = get_all_ticker_entities()

    # Get the start_date from 24hr before today and end_date as today
    start_date = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")

    # Format the date into a tuple for gnews
    format_start_date = format_date_into_tuple_for_gnews(start_date)
    format_end_date = format_date_into_tuple_for_gnews(end_date)

    gnews_result = []

    finviz_result = []

    # get news of each ticker from gnews and finviz
    for ticker in tickers_list:
        # get news of ticker from gnews
        result = get_gnews_news_by_ticker(ticker, format_start_date, format_end_date)
        if isinstance(result, list):
            gnews_result += result
        print("gnews done for ", ticker)

        # get news of ticker from finviz
        result = get_finviz_news_by_ticker(ticker)
        if isinstance(result, list):
            finviz_result += result
        print("finviz done for ", ticker)

    # get all news from gnews and finviz
    gnews_result = get_all_top_gnews()
    print("gnews done")

    finviz_result = get_all_finviz()
    print("finviz done")

    total_news = gnews_result + finviz_result

    if len(total_news) > 0:
        return format_response(total_news, "News data generated and saved successfully", 201)
    
    return format_response([], "No news data found", 404)

@news_bp.route("/<string:entity>", methods=['GET'])
def get_news(entity):
    """Get paginated news based on entity"""
    page = request.args.get('page', 1, type=int)  # Default to page 1
    per_page = request.args.get('per_page', 3, type=int)  # Default to 3 per page

    ticker = get_ticker_by_entity(entity)
    news_list = news_by_ticker(ticker, page, per_page)

    if not news_list:
        return format_response([], "News not found", 404)

    return format_response(news_list, "News fetched successfully", 200)


# ** get news based on id
@news_bp.route("/<int:id>", methods=['GET'])
def get_news_by_id(id):
    news = news_by_id(id)
    if news:
        return format_response(news, "News fetched successfully", 200)
    return format_response([], "News not found", 404)   

# ** get all news
@news_bp.route("/", methods=['GET'])
def get_all_news():
    """Get paginated news"""
    page = request.args.get('page', 1, type=int)  # Get the 'page' parameter from the request, default is 1
    per_page = request.args.get('per_page', 4, type=int)  # Get 'per_page' parameter, default is 10

    search_term = request.args.get('search', None)  # Get search term

     # Get sorting and filtering parameters
    sort_order = request.args.get('sort_order', 'desc')  # Default to ascending
    filter_time = request.args.get('filter', 'all')  # Default to all-time

    news_list = all_news(page, per_page, filter_time, sort_order, search_term)

    if not news_list:
        return format_response([], "News not found", 404)
    return format_response(news_list, "News fetched successfully", 200)