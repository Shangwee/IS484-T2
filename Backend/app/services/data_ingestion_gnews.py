import time
from gnews import GNews
from app import db
from app.models.news import News
from app.utils.helpers import URL_decoder, summarise_news, get_article_details
from app.services.sentiment_analysis import get_sentiment
from app.services.article_scraper import scrape_article


def insert_data_to_db(data, query):
    for news in data:
        # Check if the URL already exists in the database
        existing_news = News.query.filter_by(url=news['url']).first()
        if existing_news:
            continue

        # change entities to this format e.g., ["Tesla", "Apple", "Microsoft"]
        entities_list = [query]

        print("inserting data to db")

        n = News(
        publisher=news['publisher']['title'],
        description=news['description'],
        published_date=news['published date'],
        title=news['title'],
        url=news['url'],
        entities=entities_list,
        summary=news['summary'],
        score=news['score'],
        sentiment=news['sentiment']
        )
        db.session.add(n)
    db.session.commit()
    return True

## ingest data by entity
def get_gnews_news_by_entity(query, start_date, end_date):
    """ Fetches news articles from GNews, scrapes details, and stores new articles. """
    
    gn = GNews(
        start_date=start_date, 
        end_date=end_date, 
        # max_results=1  # For testing purposes
    )
    data = gn.get_news(query)

    if not data:  # If no data is found, return False
        return False
    
    final_data = []
    rate_limit_interval = 60 / 15  # 15 requests per minute

    for news in data:
        time.sleep(rate_limit_interval)  # Sleep to respect rate limit
        # Decode the URL from Google RSS
        url = news["url"]
        decoded_url = URL_decoder(url)
        print("THIS IS THE DECODED URL", decoded_url)
        news["url"] = decoded_url["decoded_url"]  

        # Check if the article is already in the database
        existing_news = News.query.filter_by(url=news['url']).first()
        if existing_news:
            data.remove(news)  # Skip duplicate news
            continue
    
        try:
            # Get article scraped
            article = scrape_article(decoded_url["decoded_url"])

            # Get article details
            article_details = get_article_details(decoded_url["decoded_url"], article)

            if article_details:
                # Place the article details in the news object
                news["description"] = article_details["text"]

                # Add summary to the news object
                news["summary"] = article_details["summary"]

                # Add score and sentiment to the news object
                news["score"] = article_details["numerical_score"]
                news["sentiment"] = article_details["classification"]

                final_data.append(news)
    
        except Exception as e:
            print(f"Error: {e}")
            continue

    # Insert the data into the database
    check_if_data_inserted = insert_data_to_db(final_data, query)
    
    if check_if_data_inserted:
        return final_data
    return False

## ingest data by top news
def get_all_top_gnews():
    gn = GNews(
        # max_results=1 # For testing purposes
    )
    data = gn.get_top_news()

    if len(data) == 0:
        return False
    
    rate_limit_interval = 60 / 15  # 15 requests per minute

    for news in data:
        # the url is encoded in google rss, so we need to decode it to get the actual url
        url = news["url"]
        
        time.sleep(rate_limit_interval)  # sleep to respect rate limit

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
            # get article scraped
            article = scrape_article(decoded_url["decoded_url"])

            # get article details
            article_details = get_article_details(decoded_url["decoded_url"], article)

            print("article details", article_details)

            # place the article details in the news object
            news["description"] = article_details["text"]

            #add summary to the news object
            news["summary"] = article_details["summary"]

            # add score and sentiment to the news object
            news["score"] = article_details["numerical_score"]
            news["sentiment"] = article_details["classification"]
        except Exception as e:
            print(f"An error occurred: {e}")

    # insert the data into the database
    check_if_data_inserted = insert_data_to_db(data, "Top News")

    if check_if_data_inserted:
        return data
    return False