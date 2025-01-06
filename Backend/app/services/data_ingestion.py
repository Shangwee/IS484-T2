from gnews import GNews
from app import db
from app.models.news import News
from app.utils.helpers import get_article_details
from googlenewsdecoder import new_decoderv1

class DataIngestion:
    def __init__(self, query):
        self.data = []
        self.query = query # Tesla, Apple, Amazon, etc.
        self.start_date = None # (2020, 1, 1) Search from 1st Jan 2020
        self.end_date = None # (2020, 1, 31) Search till 31st Jan 2020

    def set_start_date(self, start_date):
        self.start_date = start_date

    def set_end_date(self, end_date):
        self.end_date = end_date

    def ingest_data(self):
        gn = GNews(
            start_date=self.start_date,
            end_date=self.end_date,
        )
        self.data = gn.get_news(self.query)

        if len(self.data) == 0:
            return False
        
        for news in self.data:
            # the url is encoded in google rss, so we need to decode it to get the actual url
            url = news["url"]

            # check if the url in DB
            existing_news = News.query.filter_by(url=news['url']).first()
            if existing_news:
                # skip the news and remove from the data
                self.data.remove(news)
                continue

            try:
                decoded_url = new_decoderv1(url)
                if decoded_url.get("status"):
                    # place the decoded url in the news object
                    news["url"] = decoded_url["decoded_url"]

                    # get article details
                    article_details = get_article_details(decoded_url["decoded_url"])

                    # place the article details in the news object
                    news["description"] = article_details["text"]
                else:
                    print("Error:", decoded_url["message"])
            except Exception as e:
                print(f"Error occurred: {e}")

        # insert the data into the database
        check_if_data_inserted = self.insert_data_to_db()

        if check_if_data_inserted:
            return self.data
        return False
    
    def insert_data_to_db(self):
        for news in self.data:
            # Check if the URL already exists in the database
            existing_news = News.query.filter_by(url=news['url']).first()
            if existing_news:
                continue

            n = News(
            publisher=news['publisher']['title'],
            description=news['description'],
            published_date=news['published date'],
            title=news['title'],
            url=news['url'],
            entity=self.query
            )
            db.session.add(n)
        db.session.commit()
        return True