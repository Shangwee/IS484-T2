from flask import Blueprint, request
from app.models.entity import Entity
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
    entity = Entity(name=name)

    db.session.add(entity)
    db.session.commit()
    return format_response({
        "name": entity.name,
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
    entity.summary = data.get('summary')
    entity.sentiment_score = data.get('sentiment_score')

    db.session.commit()
    return format_response({
        "name": entity.name,
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
        "summary": entity.summary,
        "sentiment_score": entity.sentiment_score
    }, "Entity fetched successfully", 200)
