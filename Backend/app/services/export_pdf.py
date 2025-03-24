import yfinance as yf
import matplotlib.pyplot as plt
from fpdf import FPDF
from datetime import datetime
import os
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure upload folder for temporary PDF files
UPLOAD_FOLDER = 'temp_pdfs'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def sanitize_text(text):
    """Replace unsupported characters with ASCII equivalents"""
    return text.encode("ascii", "ignore").decode()  # Removes non-ASCII characters

def generate_pdf(entity_name, key_metrics, news_items, output_filename="report.pdf"):
    try:
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)

        # Page 1: Entity Overview
        pdf.add_page()
        pdf.set_font("Arial", "B", 24)
        pdf.cell(200, 20, sanitize_text("Entity Report"), ln=True, align='C')
        pdf.set_font("Arial", "B", 18)
        pdf.cell(200, 10, sanitize_text(entity_name), ln=True, align='C')
        pdf.ln(10)

        # Key Metrics Section
        pdf.set_font("Arial", "B", 14)
        pdf.cell(200, 10, sanitize_text("Key Metrics:"), ln=True)
        pdf.ln(5)

        pdf.set_font("Arial", size=12)
        for key, value in key_metrics.items():
            pdf.set_fill_color(240, 240, 240)
            pdf.cell(100, 10, sanitize_text(key), 1, 0, 'L', 1)
            pdf.cell(90, 10, str(value), 1, 1, 'L', 0)

        # Create a line break after the table to place the graph below it
        pdf.ln(20)  # Adjust this value for more space between table and chart

        entity_list = news_items['news'][0]['entities']
        entity_ticker = entity_list[0]
        ticker = yf.Ticker(entity_ticker)  # Use the correct ticker symbol
        hist_data = ticker.history(period="1mo")  # Get 1 month of price data

        if hist_data.empty:
            raise ValueError(f"No historical data available for {entity_name}.")

        # Generate the price history chart
        plt.figure(figsize=(6, 4))
        plt.plot(hist_data.index, hist_data['Close'], label='Closing Price', color='blue', marker='o')  # Adding markers to the line
        plt.title(f"Price History of {entity_name}")
        plt.xlabel('Date')
        plt.ylabel('Closing Price (USD)')
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Save the plot as an image
        chart_filename = os.path.join(UPLOAD_FOLDER, f"{entity_name}_price_history.png")
        plt.savefig(chart_filename)
        plt.close()

        # Embed the image in the PDF
        pdf.image(chart_filename, x=10, y=pdf.get_y(), w=180)

        # Page 2: Relevant News
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, sanitize_text("Relevant News"), ln=True, align='C')
        pdf.ln(10)

        pdf.set_font("Arial", size=12)
        i = 0
        for news in news_items.get('news', []):
            i += 1
            pdf.set_fill_color(245, 245, 245)
            pdf.set_font("Arial", "B", 12)

            page_width = pdf.w - 20

            title_text = sanitize_text(f"{i}. {news['title']}")
            sentiment = news.get('sentiment', 'Not provided')
            score = news.get('score', 'N/A')

            if isinstance(score, (int, float)):
                score = f"{score:.2f}"

            sentiment_label = f"{sentiment} | {score}"

            if sentiment == 'Positive' or sentiment == 'bullish':
                pill_color = (0, 200, 0)
            elif sentiment == 'Negative' or sentiment == 'bearish':
                pill_color = (255, 0, 0)
            elif sentiment == 'Neutral' or sentiment == 'neutral':
                pill_color = (255, 204, 0)
            else:
                pill_color = (128, 128, 128)

            pdf.set_font("Arial", "B", 10)
            sentiment_width = pdf.get_string_width(sentiment_label) + 10
            title_width = page_width - sentiment_width - 5

            # Title - Use multi_cell to allow the title to wrap if necessary
            pdf.set_font("Arial", "B", 12)
            pdf.multi_cell(title_width, 10, title_text, border=1, align='L', fill=False)

            # Position the sentiment pill next to the title
            pdf.set_xy(pdf.get_x() + title_width, pdf.get_y() - 10)  # Move to the correct X and Y position

            # Fake pill with padding
            pdf.set_fill_color(*pill_color)
            pdf.set_text_color(255, 255, 255)
            pdf.cell(sentiment_width, 10, f"  {sentiment_label}  ", border=1, ln=1, align='C', fill=True)

            # Reset colors
            pdf.set_text_color(0, 0, 0)
            pdf.set_fill_color(245, 245, 245)
            pdf.ln(5)

            # Summary
            pdf.set_font("Arial", size=11)
            summary = news.get('summary', 'No summary available')
            pdf.multi_cell(0, 8, f"Summary: {sanitize_text(summary)}", 0, 'L')
            pdf.ln(1)

            # Publisher & Date
            publisher = news.get('publisher', 'Unknown')
            published_date = news.get('published_date', 'Unknown')
            meta_info = f"Publisher: {publisher} | Date: {published_date}"
            pdf.set_font("Arial", "I", 10)
            pdf.multi_cell(0, 8, sanitize_text(meta_info), 0, 'L')

            # URL
            url = news.get('url', 'No URL available')
            pdf.set_text_color(0, 0, 255)
            pdf.multi_cell(0, 8, sanitize_text(url), 0, 'L')
            pdf.set_text_color(0, 0, 0)
            pdf.set_font("Arial", size=12)
            pdf.ln(5)

        # Footer with timestamp
        pdf.set_y(-25)
        pdf.set_font("Arial", "I", 10)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pdf.cell(0, 10, sanitize_text(f"Report generated on: {timestamp}"), 0, 1, 'C')

        # Save PDF
        pdf.output(output_path, "F")
        logging.info(f"PDF successfully created: {output_path}")

        return output_path
    except Exception as e:
        logger.error(f"PDF generation error: {str(e)}\n{traceback.format_exc()}")
        raise
