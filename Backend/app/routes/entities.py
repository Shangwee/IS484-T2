from flask import Blueprint, request
from app.models.entity import Entity
from app import db
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
            "sector": entity.sector,
            "region": entity.region
        })
    return format_response(entities, "Entities fetched successfully", 200)

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
    return format_response({
        "name": entity.name,
        "sector": entity.sector,
        "region": entity.region
    }, "Entity created successfully", 201)

# ** Get Entity Details
@entities_bp.route('/<int:id>', methods=['GET'])
def get_entity_details(id):
    entity = Entity.query.get(id)
    if entity is None:
        return format_response(None, "Entity not found", 404)
   
    return format_response({
        "id": entity.id,
        "name": entity.name,
        "sector": entity.sector,
        "region": entity.region
    }, "Entity fetched successfully", 200)
