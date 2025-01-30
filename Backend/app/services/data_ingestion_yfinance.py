import yfinance as yf
import requests_cache
session = requests_cache.CachedSession('yfinance.cache')
session.headers['User-agent'] = 'my-program/1.0'


def get_stock_price(ticker):
    stock = yf.Ticker(ticker, session=session)
    stock.actions
    stock_info = stock.info
    stock_price = stock_info['currentPrice']
    return stock_price

