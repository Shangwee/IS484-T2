import requests
from app.models import Entity
from sqlalchemy import any_
from dotenv import load_dotenv
import os

load_dotenv()

ALHPA_VANTAGE_URL = "https://www.alphavantage.co/query"
ALHPA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')

def get_stock_price(ticker):
    """Get stock price for a given ticker"""
    url = f"{ALHPA_VANTAGE_URL}?function=GLOBAL_QUOTE&symbol={ticker}&apikey={ALHPA_VANTAGE_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None

def get_stock_history(ticker):
    """Get stock price history for a given ticker"""
    url = f"{ALHPA_VANTAGE_URL}?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={ALHPA_VANTAGE_API_KEY}&datatype=json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None


def get_stock_key_metrics(ticker):
    """Get stock key metrics for a given ticker"""
    url = f"{ALHPA_VANTAGE_URL}?function=OVERVIEW&symbol={ticker}&apikey={ALHPA_VANTAGE_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None 

def get_ticker_by_entity(entity):
    """Get ticker by entity"""
    # Query using PostgreSQL ANY operator for array type
    entity = Entity.query.filter(
        entity == any_(Entity.entities)
    ).first()
    if entity:
        return entity.ticker
    return None