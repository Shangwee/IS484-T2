from flask import jsonify
import requests
from newspaper import Article
from googlenewsdecoder import new_decoderv1

# ** General-purpose helper functions for common tasks like formatting responses or handling dates.

def format_response(data, message="Success", status_code=200):
    return jsonify({
        "status": status_code,
        "message": message,
        "data": data
    }), status_code

def calculate_percentage(part, whole):
    if whole == 0:
        return 0
    return (part / whole) * 100

def password_rule_checker(password):
    # Check if password is at least 8 characters long
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    # Check if password has at least one uppercase letter
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    # Check if password has at least one lowercase letter
    if not any(char.islower() for char in password):
        return False, "Password must contain at least one lowercase letter"
    # Check if password has at least one digit
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    # Check if password has at least one special character
    if not any(char in "!@#$%^&*()-_=+[]{}|;:,.<>?/~" for char in password):
        return False, "Password must contain at least one special character"
    return True, "Password meets all requirements"


def format_date_into_tuple_for_gnews(date):
    date = date.split("-")
    return (int(date[0]), int(date[1]), int(date[2]))

def URL_decoder(url):
    # Decode the URL
    try: 
        decoded_url = new_decoderv1(url)
        if decoded_url.get("status"):
            return decoded_url["decoded_url"]
        else:
            print("Error:", decoded_url["message"])
    except Exception as e:
        print(f"Error occurred: {e}")

def get_article_details(url):
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
    headers = {
        'User-Agent': user_agent,
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/',  # Mimics coming from Google search
    }

    # Use `requests` to get the page content
    response = requests.get(url, headers=headers)

    # Check if the request was successful
    if response.status_code != 200:
        print(f"Error: HTTP {response.status_code}")
        return None

    article = Article(url)
    article.set_html(response.text)  # Provide the HTML manually
    article.parse()


    details = {
        "title": article.title,
        "authors": article.authors,
        "text": article.text,
    }
    
    return details  