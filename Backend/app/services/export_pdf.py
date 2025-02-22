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

def generate_pdf(entity_name, key_metrics, news_items, output_filename="report.pdf"):
    """Generate PDF with error handling"""
    try:
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
      # Page 1: Entity Overview
        pdf.add_page()
        pdf.set_font("Arial", "B", 24)
        pdf.cell(200, 20, f"Entity Report", ln=True, align='C')
        pdf.set_font("Arial", "B", 18)
        pdf.cell(200, 10, f"{entity_name}", ln=True, align='C')
        pdf.ln(10)

        # Key Metrics Section
        pdf.set_font("Arial", "B", 14)
        pdf.cell(200, 10, "Key Metrics:", ln=True)
        pdf.ln(5)

        pdf.set_font("Arial", size=12)
        # Create a table-like structure for metrics
        for key, value in key_metrics.items():
            pdf.set_fill_color(240, 240, 240)  # Light gray background
            pdf.cell(100, 10, key, 1, 0, 'L', 1)
            pdf.cell(90, 10, str(value), 1, 1, 'L', 0)

        # Page 2: Relevant News
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, "Relevant News", ln=True, align='C')
        pdf.ln(10)

        pdf.set_font("Arial", size=12)
        for i, news in enumerate(news_items[:10], 1):
            # News title with gray background
            pdf.set_fill_color(245, 245, 245)
            pdf.cell(0, 10, f"{i}. {news['title']}", 1, 1, 'L', 1)
            # new summary
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, news['summary'])
            pdf.ln(2)
            # URL in italic
            pdf.set_font("Arial", "I", 10)
            pdf.cell(0, 8, news['url'], 0, 1, 'L')
            pdf.set_font("Arial", size=12)
            pdf.ln(2)

        # Footer with timestamp
        pdf.set_y(-25)
        pdf.set_font("Arial", "I", 10)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pdf.cell(0, 10, f"Report generated on: {timestamp}", 0, 1, 'C')
        # Save PDF
        pdf.output(output_path)
        return output_path
    except Exception as e:
        logger.error(f"PDF generation error: {str(e)}\n{traceback.format_exc()}")
        raise