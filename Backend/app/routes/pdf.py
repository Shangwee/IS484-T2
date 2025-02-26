from flask import request, send_file, Blueprint
import os
import time
from datetime import datetime
import logging
import traceback
from app.services.export_pdf import generate_pdf
from app.services.news_services import news_by_entity
from app.utils.helpers import format_response
import threading

pdf_bp = Blueprint('pdf', __name__)

UPLOAD_FOLDER = "temp_pdfs"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@pdf_bp.route('/generate-pdf', methods=['POST'])
def export_pdf():
    data = request.get_json()
    entity_name = data.get("entity_name")

    if not entity_name:
        return format_response(None, "Entity name is required", 400)

    # Fetch data for the report
    #TODO: Replace with actual data fetch. Maybe can create a new function in services folder
    news_items = news_by_entity(entity_name)
    key_metrics = {
        "Revenue": 1000000,
        "Net Income": 500000,
        "EPS": 2.5,
        "Market Cap": 1000000000
    }

    # Generate PDF
    output_filename = f"{entity_name}_report_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    pdf_filepath = generate_pdf(entity_name, key_metrics, news_items, output_filename)
    
    base_path = os.getcwd()  # Get the current working directory
    pdf_filepath = os.path.join(base_path, "temp_pdfs", output_filename)

    logging.info(f"Generated PDF path: {pdf_filepath}")

    # Ensure the file exists before sending
    if not os.path.exists(pdf_filepath):
        logging.error(f"File not found: {pdf_filepath}")
        return format_response(None, "Failed to generate report", 500)

    def cleanup():
        time.sleep(5)  # Give time for the file to be fully sent
        try:
            if os.path.exists(pdf_filepath):
                os.remove(pdf_filepath)
                logging.info(f"Deleted file: {pdf_filepath}")
        except Exception as e:
            logging.error(f"Error deleting file: {traceback.format_exc()}")

    try:
        response = send_file(
            pdf_filepath,
            as_attachment=True,
            mimetype="application/pdf"
        )
        
        # Run cleanup in a background thread
        threading.Thread(target=cleanup, daemon=True).start()
        return response
    except Exception as e:
        logging.error(f"Error sending PDF: {traceback.format_exc()}")
        return format_response(None, "Error generating PDF", 500)
