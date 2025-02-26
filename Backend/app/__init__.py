from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail


db = SQLAlchemy()
jwt = JWTManager()
mail = Mail() 

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    with app.app_context():
        from app.routes import register_routes
        register_routes(app)
        db.create_all()

    return app


