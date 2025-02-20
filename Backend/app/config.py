from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION = 'headers'
    APP_DEBUG = os.getenv('APP_DEBUG', True)
    PORT = os.getenv('PORT', 5001)
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_APP = os.getenv('FLASK_APP', 'run.py')
