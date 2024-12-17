from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import nltk

nltk.download(['vader_lexicon', 'punkt', 'punkt_tab'])

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from app.routes import register_routes
        register_routes(app)
        db.create_all()

    return app


