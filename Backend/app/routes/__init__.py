from .auth import auth_bp
from .news import news_bp
from .entities import entities_bp
from .sentimentanalysis import sentiment_bp
from .pdf import pdf_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(news_bp, url_prefix='/news')
    app.register_blueprint(entities_bp, url_prefix='/entities')
    app.register_blueprint(sentiment_bp, url_prefix='/sentiment')
    app.register_blueprint(pdf_bp, url_prefix='/pdf')