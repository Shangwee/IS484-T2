from gnews import GNews
from app import db
from app.models.news import News
from app.utils.helpers import get_article_details, URL_decoder


def insert_data_to_db(data, query):
    for news in data:
        # Check if the URL already exists in the database
        existing_news = News.query.filter_by(url=news['url']).first()
        if existing_news:
            continue

        # change entities to a list format like this e.g., {entities:["Tesla", "Apple", "Microsoft"]}
        entities_list = {"entities": [query]}

        n = News(
        publisher=news['publisher']['title'],
        description=news['description'],
        published_date=news['published date'],
        title=news['title'],
        url=news['url'],
        entities=entities_list
        )
        db.session.add(n)
    db.session.commit()
    return True

## ingest data by entity
def get_gnews_news_by_entity(query, start_date, end_date):
        gn = GNews(
            start_date=start_date,
            end_date=end_date,
            max_results=1 # this is use for testing
        )
        data = gn.get_news(query)

        if len(data) == 0:
            return False
        
        for news in data:
            # the url is encoded in google rss, so we need to decode it to get the actual url
            url = news["url"]

            # check if the url in DB
            existing_news = News.query.filter_by(url=news['url']).first()
            if existing_news:
                # skip the news and remove from the data
                data.remove(news)
                continue

            # decode the url
            decoded_url = URL_decoder(url)

            news["url"] = decoded_url["decoded_url"]

            try:
                # get article details
                article_details = get_article_details(decoded_url["decoded_url"])

                # place the article details in the news object
                news["description"] = article_details["text"]
            except Exception as e:
                print(f"An error occurred: {e}")


        # insert the data into the database
        check_if_data_inserted = insert_data_to_db(data, query)

        if check_if_data_inserted:
            return data
        return False

def get_all_top_gnews():
    gn = GNews(
        max_results=1 # this is use for testing
    )
    data = gn.get_top_news()

    if len(data) == 0:
        return False

    for news in data:
        # the url is encoded in google rss, so we need to decode it to get the actual url
        url = news["url"]

        # check if the url in DB
        existing_news = News.query.filter_by(url=news['url']).first()
        if existing_news:
            # skip the news and remove from the data
            data.remove(news)
            continue

        # decode the url
        decoded_url = URL_decoder(url)

        news["url"] = decoded_url["decoded_url"]

        try:
            # get article details
            article_details = get_article_details(decoded_url["decoded_url"])

            # place the article details in the news object
            news["description"] = article_details["text"]
        except Exception as e:
            print(f"An error occurred: {e}")

    # insert the data into the database
    check_if_data_inserted = insert_data_to_db(data, "Top News")

    if check_if_data_inserted:
        return data
    return False