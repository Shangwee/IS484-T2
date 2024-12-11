from flask import Blueprint, request, jsonify
from app.models.entity import Entity
from app import db

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
            "sector": entity.sector,
            "region": entity.region
        })
    return jsonify(entities), 200

# ** Create Entity
@entities_bp.route('/', methods=['POST'])
def create_entity():
    data = request.get_json()
    name = data.get('name')
    sector = data.get('sector')
    region = data.get('region')
    entity = Entity(name=name, sector=sector, region=region)
    db.session.add(entity)
    db.session.commit()
    return jsonify({
        "name": entity.name,
        "sector": entity.sector,
        "region": entity.region
    }), 201

# ** Get Entity Details
@entities_bp.route('/<int:id>', methods=['GET'])
def get_entity_details(id):
    entity = Entity.query.get(id)
    if entity is None:
        return jsonify({"error": "Entity not found"}), 404
    return jsonify({
        "id": entity.id,
        "name": entity.name,
        "sector": entity.sector,
        "region": entity.region
    }), 200


