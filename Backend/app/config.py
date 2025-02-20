from dotenv import load_dotenv
import os

load_dotenv()
print(os.getenv('DATABASE_URI'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', "postgresql+psycopg2://postgres:SentiFinance-T2@sentifinance.postgres.database.azure.com:5432/senti_finance")
    SQLALCHEMY_TRACK_MODIFICATIONS = False    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION = 'headers'
    APP_DEBUG = os.getenv('APP_DEBUG', True)
    PORT = os.getenv('PORT', 5001)
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_APP = os.getenv('FLASK_APP', 'run.py')
