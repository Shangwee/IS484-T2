import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from fpdf import FPDF
from datetime import datetime
import os
import logging
import traceback
from collections import Counter


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

def generate_pdf(entity_name, entity_scores, sentiment_history, news_items, output_filename="report.pdf"):
    try:
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        chart_width = (pdf.w - 20) / 2

        # Add the first page
        pdf.add_page()  # Ensure a page is added before any content

        # Set the title
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, f"{entity_name} Report", ln=True, align='C')
        pdf.ln(10)

        # 1. Entity Name
        entity_name = f"Entity Name: {entity_name}"  # Replace with dynamic data
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, entity_name, ln=True)
        pdf.ln(5)

        sentiment = entity_scores['classification'].title()
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, f"Sentiment: {sentiment}", ln=True)

        # 2. Entity Sentiment Score and Sentiment
        avg_sentiment = round(entity_scores['avg_score'],2) 
        simple_avg = round(entity_scores['simple_average'],2)
        time_decay = round(entity_scores['time_decay'],2)
        sentiment_label = f"Average Sentiment: {avg_sentiment} | Simple Average Sentiment: {simple_avg} | Time-decay Sentiment: {time_decay} "
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(chart_width*2, 10, sentiment_label, border=1)
        pdf.ln(5)

        # 3. Related Sectors
        # Initialize counters for regions and sectors
        region_counter = Counter()
        sector_counter = Counter()

        for news in news_items.get('news', []):
            regions = news.get('regions', [])
            sectors = news.get('sectors', [])
            
            # Update counters with the regions and sectors of each news item
            region_counter.update(regions)
            sector_counter.update(sectors)

        # Order  common regions and sectors
        top_5_regions = [region for region,count in region_counter.most_common(5)]
        top_5_sectors = [sector for sector,count in sector_counter.most_common(5)]

        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, "Related Region & Sectors:", ln=True)

        pdf.set_font("Arial", "B", 12)
        regions_str = 'Region(s):\n'
        pdf.multi_cell(chart_width*2, 10, regions_str, border=1)

        # Set the font back to normal for the list of regions
        pdf.set_font("Arial", "", 12)
        regions_list_str = ", ".join(top_5_regions)
        pdf.multi_cell(chart_width*2, 10, regions_list_str, border=1)

        # Bold "Sector(s):"
        pdf.set_font("Arial", "B", 12)
        sectors_str = 'Sector(s):\n'
        pdf.multi_cell(chart_width*2, 10, sectors_str, border=1)

        # Set the font back to normal for the list of sectors
        pdf.set_font("Arial", "", 12)
        sectors_list_str = ", ".join(top_5_sectors)
        pdf.multi_cell(chart_width*2, 10, sectors_list_str, border=1)

        pdf.ln(20)

        # Generate the first chart (price history chart)
        entity_ticker = entity_scores['ticker']  # Get the ticker symbol from entity_scores
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

        # Embed the first chart directly (left side)
        pdf.image(chart_filename, x=10, y=pdf.get_y(), w=chart_width)

        # Generate the second chart (e.g., news sentiment chart, or any other chart)
        sentiment_history_data = [entry['sentiment_score'] for entry in sentiment_history['sentiment_history']]
        dates = [entry['date'] for entry in sentiment_history['sentiment_history']]
        formatted_dates = [date.strftime('%d-%m') for date in dates]

        print("Sentiment History Data:", sentiment_history_data)  # Debugging line
        print("Dates:", formatted_dates)  # Debugging line

        hist_data = pd.DataFrame(sentiment_history_data, index=formatted_dates, columns=['Sentiment Score'])

        # For simplicity, using the same chart again (can be replaced with another chart)
        plt.figure(figsize=(6, 4))
        plt.plot(hist_data.index, hist_data['Sentiment Score'], label='Sentiment Score', color='green', marker='o')
        plt.title(f"Sentiment History of {entity_name}")
        plt.xlabel('Date')
        plt.ylabel('Sentiment Score')
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Save the second chart as an image
        second_chart_filename = os.path.join(UPLOAD_FOLDER, f"{entity_name}_price_history_second.png")
        plt.savefig(second_chart_filename)
        plt.close()

        # Embed the second chart directly (right side)
        pdf.image(second_chart_filename, x=10 + chart_width + 5, y=pdf.get_y(), w=chart_width)

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
            pdf.multi_cell(title_width, 10, title_text, align='L', fill=False)

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

            #regions
            regions = news.get('regions', [])
            if regions:
                sanitized_regions = [sanitize_text(region) for region in regions]
                pdf.set_font("Arial", "I", 10)
                
                # Start a new line for tags
                pdf.ln(1)
                
                # Join the tags with commas and ensure they fit within the page width
                regions_text = ', '.join(sanitized_regions)
                
                # Split the tags into multiple lines if they overflow the page width
                max_regions_width = pdf.w - 20  # Account for page margins
                if pdf.get_string_width(regions_text) > max_regions_width:
                    # Use multi_cell to wrap the tags text
                    pdf.multi_cell(0, 8, f"Region(s): {regions_text}", 0, 'L')
                else:
                    # Otherwise, just use cell to print the tags in one line
                    pdf.cell(0, 8, f"Region(s): {regions_text}", ln=True, align='L')

                pdf.ln(1)  # Add some spacing after tags
            
            #sectors
            sectors = news.get('sectors', [])
            if sectors:
                sanitized_sectors = [sanitize_text(sector) for sector in sectors]
                pdf.set_font("Arial", "I", 10)
                
                # Start a new line for tags
                pdf.ln(1)
                
                # Join the tags with commas and ensure they fit within the page width
                sectors_text = ', '.join(sanitized_sectors)
                
                # Split the tags into multiple lines if they overflow the page width
                max_sectors_width = pdf.w - 20  # Account for page margins
                if pdf.get_string_width(sectors_text) > max_sectors_width:
                    # Use multi_cell to wrap the tags text
                    pdf.multi_cell(0, 8, f"Sector(s): {sectors_text}", 0, 'L')
                else:
                    # Otherwise, just use cell to print the tags in one line
                    pdf.cell(0, 8, f"Sector(s): {sectors_text}", ln=True, align='L')

                pdf.ln(5)  # Add some spacing after tags


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
