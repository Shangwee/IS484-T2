from gnews import GNews
from app import db
from app.models.news import News
from datetime import datetime

class DataIngestion:
    def __init__(self, query):
        self.data = []
        self.query = query # Tesla, Apple, Amazon, etc.
        self.language = "en" # en, fr, de, es, it
        self.start_date = None # (2020, 1, 1) Search from 1st Jan 2020
        self.end_date = None # (2020, 1, 31) Search till 31st Jan 2020

    def set_start_date(self, start_date):
        self.start_date = start_date

    def set_end_date(self, end_date):
        self.end_date = end_date

    def ingest_data(self):
        gn = GNews(
            language=self.language,
            start_date=self.start_date,
            end_date=self.end_date,
        )
        self.data = gn.get_news(self.query)

        if len(self.data) == 0:
            return False
        
        return self.data
    
    def insert_data_to_db(self):
        for news in self.data:
            n = News(
                publisher=news['publisher']['title'],
                description=news['description'],
                published_date=news['published_date'],
                title=news['title'],
                url=news['url'],
                entity=self.query
            )
            db.session.add(n)
        db.session.commit()
        return True
