import os
from fpdf import FPDF
from datetime import datetime
import traceback
import logging

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
    """Generate PDF with error handling"""
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

        # Page 2: Relevant News
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, sanitize_text("Relevant News"), ln=True, align='C')
        pdf.ln(10)

        pdf.set_font("Arial", size=12)
        for i, news in enumerate(news_items[:10], 1):
            pdf.set_fill_color(245, 245, 245)
            pdf.cell(0, 10, sanitize_text(f"{i}. {news['title']}"), 1, 1, 'L', 1)
            pdf.ln(5)
            pdf.set_font("Arial", "I", 10)
            url = sanitize_text(news['url'])
            pdf.multi_cell(0, 8, url, 0, 'L')
            pdf.set_font("Arial", size=12)
            pdf.ln(2)

        # Footer with timestamp
        pdf.set_y(-25)
        pdf.set_font("Arial", "I", 10)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pdf.cell(0, 10, sanitize_text(f"Report generated on: {timestamp}"), 0, 1, 'C')

        # Save PDF
        pdf.output(output_path, "F")
        logging.info(f"PDF successfully created: {output_path}")

        if not os.path.exists(output_path):
            raise FileNotFoundError(f"PDF file was not created at: {output_path}")

        return output_path
    except Exception as e:
        logger.error(f"PDF generation error: {str(e)}\n{traceback.format_exc()}")
        raise
