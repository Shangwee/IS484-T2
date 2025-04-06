import time
from gnews import GNews
from app import db
from app.models.news import News
from app.utils.helpers import URL_decoder, get_article_details
from app.services.sentiment_analysis import get_sentiment
from app.services.article_scraper import scrape_article
from datetime import datetime, timedelta


def insert_data_to_db(news, query):

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
        finbert_score=news['finbert_score'],
        second_model_score=news['second_model_score'],
        third_model_score=news['third_model_score'],
        sentiment=news['sentiment'],
        tags=news['tags'],
        confidence=news['confidence'],
        agreement_rate=news['agreement_rate'],
        company_names=news['company_names'],
        regions=news['regions'],
        sectors=news['sectors']
    )

    db.session.add(n)
    db.session.commit()
    return True

def check_if_data_exists(url):
    existing_news = News.query.filter_by(url=url).first()
    if existing_news:
        print("Data already exists")
        return True
    print("Data does not exist")
    return False

## ingest data by ticker
def get_gnews_news_by_ticker(query, start_date, end_date):
    """ Fetches news articles from GNews, scrapes details, and stores new articles. """
    
    gn = GNews(
        start_date=start_date, 
        end_date=end_date, 
        exclude_websites=['investors.com', 'barrons.com', 'wsj.com', 'bloomberg.com', 'ft.com', "marketbeat.com", "benzinga.com", "streetinsider.com", "msn.com", "reuters.com", "uk.finance.yahoo.com", "seekingalpha.com", "fool.com", "GuruFocus.com", "mix941kmxj.com", "wibx950.com", "insidermonkey.com", "marketwatch.com", "cheap-sound.com", "retro1025.com", "wrrv.com", "apnnews.com", "fool.com"],
        # max_results=1 # For testing purposes
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
    
        # check if the data exists in the database
        check_data = check_if_data_exists(news['url'])
            
        if check_data:
            continue

        # Get article scraped
        article = scrape_article(decoded_url["decoded_url"])
        if not article:
            print(f"Failed to scrape article for URL: {decoded_url['decoded_url']}")
            continue

        # Get article details
        article_details = get_article_details(decoded_url["decoded_url"], article)

        if article_details:
            # Place the article details in the news object
            news["description"] = article_details["text"]

            # Add summary to the news object
            news["summary"] = article_details["summary"]

            # Add score and sentiment to the news object
            news["score"] = article_details["numerical_score"]
            news['finbert_score'] = article_details['finbert_score']
            news['second_model_score'] = article_details['second_model_score']
            news["third_model_score"] = article_details['third_model_score']
            news["confidence"] = article_details["confidence"]
            news["sentiment"] = article_details["classification"]
            news["agreement_rate"] = article_details["agreement_rate"]
            news["tags"] = article_details["keywords"]
            news["company_names"] = article_details["companies"]
            news["regions"] = article_details["regions"]
            news["sectors"] = article_details["sectors"]

            if news["description"] == "An error occurred while fetching the article details":
                continue

            # Insert the data into the database
            check_if_data_inserted = insert_data_to_db(news, query)

            if check_if_data_inserted:
                final_data.append(news)
            else:
                print("Data not inserted")
    
    return final_data

## ingest data by top news
def get_all_top_gnews():
    gn = GNews(
        # max_results=1, # For testing purposes
        exclude_websites=['investors.com', 'barrons.com', 'wsj.com', 'bloomberg.com', 'ft.com', "marketbeat.com", "benzinga.com", "streetinsider.com", "msn.com", "reuters.com", "uk.finance.yahoo.com", "seekingalpha.com", "fool.com", "GuruFocus.com", "mix941kmxj.com", "wibx950.com", "insidermonkey.com", "marketwatch.com", "cheap-sound.com", "retro1025.com", "wrrv.com", "apnnews.com","fool.com"],
    )
    data = gn.get_top_news()

    # get date as range of 24 hours
    today = datetime.today().strftime('%Y-%m-%d')
    yesterday = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')

    if len(data) == 0:
        return False
    
    rate_limit_interval = 60 / 15  # 15 requests per minute

    for news in data:
        # the url is encoded in google rss, so we need to decode it to get the actual url
        url = news["url"]
        
        time.sleep(rate_limit_interval)  # sleep to respect rate limit

        timestamp = news["published date"]

        # Define the format
        dt = datetime.strptime(timestamp, "%a, %d %b %Y %H:%M:%S %Z")

        # Convert to 'yyyy-mm-dd' format
        formatted_date = dt.strftime("%Y-%m-%d")

        if formatted_date != today and formatted_date != yesterday:
            print("Date is not within the range")
            continue

        # decode the url
        decoded_url = URL_decoder(url)

        news["url"] = decoded_url["decoded_url"]

        # check if the data exists in the database
        check_data = check_if_data_exists(news['url'])

        if check_data:
            print("Data already exists")
            continue

        try:
            # get article scraped
            article = scrape_article(decoded_url["decoded_url"])
            if not article:
                print(f"Failed to scrape article for URL: {decoded_url['decoded_url']}")
                continue

            # get article details
            article_details = get_article_details(decoded_url["decoded_url"], article)

            # place the article details in the news object
            news["description"] = article_details["text"]

            #add summary to the news object
            news["summary"] = article_details["summary"]

            # add score and sentiment to the news object
            news["score"] = article_details["numerical_score"]
            news['finbert_score'] = article_details['finbert_score']
            news['second_model_score'] = article_details['second_model_score']
            news["third_model_score"] = article_details['third_model_score']
            news["sentiment"] = article_details["classification"]
            news["tags"] = article_details["keywords"]
            news["confidence"] = article_details["confidence"]
            news["agreement_rate"] = article_details["agreement_rate"]
            news["company_names"] = article_details["companies"]
            news["regions"] = article_details["regions"]
            news["sectors"] = article_details["sectors"]

            if news["description"] == "An error occurred while fetching the article details" or news["description"] == "":
                continue

            # insert the data into the database
            check_if_data_inserted = insert_data_to_db(news, "Top News")
            if check_if_data_inserted:
                continue
            else:
                print("Data not inserted")
                data.remove(news)

        except Exception as e:
            print(f"An error occurred: {e}")

    return data