from flask import Blueprint, request
from app.models.entity import Entity
from app.services.data_ingestion_yfinance import get_stock_price
from app import db
from app.utils.decorators import jwt_required
from app.utils.helpers import format_response

entities_bp = Blueprint('entities', __name__)

# ** Get Entities
@entities_bp.route('/', methods=['GET'])
def get_entities():
    db_entities = Entity.query.all()
    entities = []
    for entity in db_entities:
        entities.append({
            "id": entity.id,
            "name": entity.name,
            "ticker": entity.ticker,
            "summary": entity.summary,
            "sentiment_score": entity.sentiment_score
        })
    return format_response(entities, "Entities fetched successfully", 200)

# ** Create Entity
@entities_bp.route('/', methods=['POST'])
@jwt_required
def create_entity():
    data = request.get_json()
    name = data.get('name')
    ticker = data.get('ticker')
    entity = Entity(name=name, ticker=ticker)

    db.session.add(entity)
    db.session.commit()
    return format_response({
        "name": entity.name,
        "ticker": entity.ticker,
    }, "Entity created successfully", 201)

# ** Update Entity
@entities_bp.route('/<int:id>', methods=['PUT'])
@jwt_required
def update_entity(id):
    entity = Entity.query.get(id)
    if entity is None:
        return format_response(None, "Entity not found", 404)

    data = request.get_json()
    entity.name = data.get('name')
    entity.ticker = data.get('ticker')
    entity.summary = data.get('summary')
    entity.sentiment_score = data.get('sentiment_score')

    db.session.commit()
    return format_response({
        "name": entity.name,
        "ticker": entity.ticker,
        "summary": entity.summary,
        "sentiment_score": entity.sentiment_score
    }, "Entity updated successfully", 200)

# ** Get Entity Details
@entities_bp.route('/<int:id>', methods=['GET'])
def get_entity_details(id):
    entity = Entity.query.get(id)
    if entity is None:
        return format_response(None, "Entity not found", 404)
   
    return format_response({
        "id": entity.id,
        "name": entity.name,
        "ticker": entity.ticker,
        "summary": entity.summary,
        "sentiment_score": entity.sentiment_score
    }, "Entity fetched successfully", 200)

# ** get entity stock price
@entities_bp.route('/<int:id>/stock', methods=['GET'])
def get_entity_stock_price(id):
    entity = Entity.query.get(id)
    if entity is None:
        return format_response(None, "Entity not found", 404)
    
    # call the stock price service
    stock_price = get_stock_price(entity.ticker)

    return format_response({
        "name": entity.name,
        "stock_price": stock_price,
    }, "Stock price fetched successfully", 200)