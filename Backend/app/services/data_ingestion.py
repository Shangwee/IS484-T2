from gnews import GNews
from app import db

class DataIngestion:
    def __init__(self, query, period):
        self.data = []
        self.query = query # Tesla, Apple, Amazon, etc.
        self.period = period # 1d, 7d, 1m, 3m, 1y
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
            period=self.period,
            start_date=self.start_date,
            end_date=self.end_date,
        )
        self.data = gn.get_news(self.query)
        return self.data
    
    def insert_data_to_db(self):
        pass
