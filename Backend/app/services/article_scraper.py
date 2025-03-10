import asyncio
from crawl4ai import AsyncWebCrawler
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, CacheMode
from fake_useragent import UserAgent


async def scrape_article_async(url_parameter):
    """ Asynchronous function to scrape an article. """
    
    # Load user agents
    ua = UserAgent()

    # Set random user agent
    user_agent = ua.random

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
