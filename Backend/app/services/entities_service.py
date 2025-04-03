from app.models import Entity
from sqlalchemy import any_
from app import db

def get_ticker_by_entity(entity_name):
    """Get ticker by entity name"""
    entity = Entity.query.filter(Entity.name == entity_name).first()
    if entity:
        return entity.ticker
    return None

def get_id_by_entity(entity_name):
    """Get ticker by entity name"""
    entity = Entity.query.filter(Entity.name == entity_name).first()
    if entity:
        return entity.id
    return None

def get_all_ticker_entities():
    """Get all entities with tickers"""
    ticker_list = []
    entities = Entity.query.all()
    if not entities:
        return []
    for entity in entities:
        ticker_list.append(entity.ticker)

    return ticker_list

# update entity sentiment
def update_entity_sentiment(ticker, sentiment_score, confidence_score, time_decay_score, simple_average_score, classification):
    """Update entity sentiment"""
    entity = Entity.query.filter(Entity.ticker == ticker).first()
    if entity:
        entity.sentiment_score = sentiment_score
        entity.confidence_score = confidence_score
        entity.time_decay = time_decay_score
        entity.simple_average = simple_average_score
        entity.classification = classification
        db.session.commit()
        return True
    return False

def get_entity_details(ticker):
    """Get entity details by ticker"""
    entity = Entity.query.filter(Entity.ticker == ticker).first()
    if entity:
        return {'avg_score' : entity.sentiment_score, 
                'simple_average' : entity.simple_average, 
                'time_decay' : entity.time_decay, 
                'confidence_score' : entity.confidence_score, 
                'classification' : entity.classification,
                'ticker' : entity.ticker,
                'name' : entity.name,}
    return None