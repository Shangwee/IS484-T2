from .auth import auth_bp
from .entities import entities_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(entities_bp, url_prefix='/entities')