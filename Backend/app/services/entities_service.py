from app.models import Entity
from sqlalchemy import any_

def get_ticker_by_entity(entity_name):
    """Get ticker by entity name"""
    entity = Entity.query.filter(Entity.name == entity_name).first()
    if entity:
        return entity.ticker
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