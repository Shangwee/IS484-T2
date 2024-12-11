from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql+psycopg2://postgres:root@localhost:5432/SentiFinance')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '6aac1730b11b403a9cd49ac1659d6ec39066b3178025a20578901eb02db0c426')
    APP_DEBUG = os.getenv('APP_DEBUG', True)
    PORT = os.getenv('PORT', 5000)
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_APP = os.getenv('FLASK_APP', 'run.py')