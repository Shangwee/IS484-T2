import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")  # Retrieve API key securely

if not api_key:
    raise ValueError("API key not found. Please set the GEMINI_API_KEY in the .env file.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

news_text = """
Taiwan Semiconductor Manufacturing Company Limited TSM, better known as TSMC, saw its shares scale northward after posting record fourth-quarter net income, which topped analysts’ projections. The foundry behemoths’ fourth-quarter net profit soared 57% to $374.68 billion from a year earlier, driven by a surge in demand for artificial intelligence (AI) chipsets.

But it’s not the latest quarterly result that propelled its shares higher. The TSMC stock has already gained 91% in the past year with the advent of AI. However, can the TSMC stock sustain this growth and remain a good buy? Let’s see –

3 Reasons to be Bullish on TSMC Stock

While the current quarterly results have boosted the TSMC stock, the long-term growth trajectory depends on the long-term growth prospects. TSMC’s first-quarter revenue guidance of $25 billion to $25.8 billion is 6% higher than expectations, suggesting strong near-term growth. Also, management expects a 20% revenue CAGR over the next five-year period, driven by growth opportunities in AI, 5G smartphones, and high-performance computing.

The rising demand for TSMC’s custom AI chips from Broadcom Inc. AVGO and Marvell Technology, Inc. MRVL has strengthened its future growth. Meanwhile, Apple Inc. AAPL has witnessed a rise in demand for its smartphones that require TSMC’s chips, a positive development for the latter. TSMC’s bright future is also due to the forthcoming launch of their highly efficient 2-nanometer (nm) chips this year, with pre-order demand exceeding 3 and 5nm.

TSMC’s dominant position in the global foundry market means the stock is well-poised to take advantage of the growing opportunities. After all, the semiconductor market worldwide is projected to generate $1.47 trillion in revenues in 2030 from $729 billion in 2022, per SNS Insider. Management mentioned that the U.S. government’s curb on chip sales to China is “manageable.”

Second, the new Stargate AI infrastructure program is expected to be a game changer for the TSMC stock. President Trump intends to allocate $500 billion for AI infrastructure, boosting AI stocks. TSMC stands to benefit as its advanced chips are essential for operating AI data centers.

Third, the TSMC stock is likely to rise because the company generates profits efficiently, with a net profit margin of 40.52%, slightly more than the Semiconductor - Circuit Foundry industry’s 40.51%, indicating a high margin.

Image Source: Zacks Investment Research

Consider Buying TSMC Stock

With the TSMC stock poised to gain in the long term due to multiple growth opportunities, a new Stargate AI infrastructure project, and strong fundamentals, it is judicious for investors to place their bets on the stock now. Brokers also expect the TSMC stock to rise and have raised its average short-term price target by 7.5% to $235.13 from the previous $218.70. The highest short-term price target is $265, indicating an upside of 21.2%.
"""

response = model.generate_content("summarise this in 100 words or less: " + news_text)
response_text = response.candidates[0].content.parts[0].text
print(response_text)