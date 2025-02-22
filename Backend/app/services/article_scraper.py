import asyncio
from crawl4ai import AsyncWebCrawler
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import LLMExtractionStrategy
import random
import json
import os


async def scrape_article_async(url_parameter):
    """ Asynchronous function to scrape an article. """

    # List of user agents
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.119 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.129 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0"
    ]

    # Set random user agent
    user_agent = random.choice(USER_AGENTS)

    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=True,
        viewport_width=1280,
        viewport_height=720,
        user_agent=user_agent,
        verbose=True,
        use_persistent_context=True
    ) 

    run_config = CrawlerRunConfig(
        # Content filtering
        word_count_threshold=10,
        excluded_tags=['form', 'header', 'footer', 'aside'],
        exclude_external_links=True,
        exclude_social_media_links=True,

        # Content processing
        process_iframes=False,
        remove_overlay_elements=True,
        simulate_user=True,
        magic=True,

        # Cache control
        cache_mode=CacheMode.ENABLED, # Use cache if available
    )


    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url=url_parameter,
            config=run_config
        )
        if result.success:
            return result.cleaned_html
        else:
            print("Error:", result.error_message)
            return None

def scrape_article(url):
    """ Wrapper function to run the async function synchronously. """
    return asyncio.run(scrape_article_async(url))
