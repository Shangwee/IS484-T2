import requests
from gnews import GNews
from app import db
from app.models.news import News
from newspaper import Article
from newspaper import Config
from googlenewsdecoder import new_decoderv1

## This still need to change for error 401 and 403
# def get_article_details(url):

#     user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
#     config = Config()
#     config.browser_user_agent = user_agent

#     article = Article(url, config=config)
#     article.download()
#     article.parse()

#     if article.text == "":
#         print("No text found")
#         print(url)
    
#     details = {
#         "title": article.title,
#         "authors": article.authors,
#         "publish_date": article.publish_date,
#         "text": article.text,
#         "top_image": article.top_image,
#         "movies": article.movies,
#     }
    
#     return details  

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
            try:
                decoded_url = new_decoderv1(url)
                if decoded_url.get("status"):
                    # place the decoded url in the news object
                    news["url"] = decoded_url["decoded_url"]
                else:
                    print("Error:", decoded_url["message"])
            except Exception as e:
                print(f"Error occurred: {e}")

        return self.data
    
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