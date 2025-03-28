from flask import request, Blueprint
from flask_mail import Mail
from datetime import datetime
from app.services.export_pdf import generate_pdf
from app.services.email_pdf import send_email_with_attachment
from app.services.news_services import news_by_ticker
from app.services.entities_service import get_ticker_by_entity
from app.utils.helpers import format_response
import os
import logging
import traceback
import threading
import time
from dotenv import load_dotenv

load_dotenv()

send_pdf_bp = Blueprint('send_pdf_email', __name__)
mail = Mail()  # Initialize Flask-Mail

@send_pdf_bp.route('/send_pdf_email', methods=['POST'])
def send_pdf_email():
    try:
        data = request.get_json()
        entity_name = data.get('entity_name')
        ticker = get_ticker_by_entity(entity_name)
        sender_email = "hoshangwee0911@gmail.com" #TODO: Need to use the actual email from JSON
        recipient_email = "rabbitboi0911@gmail.com" #TODO: Need to use the actual email from JSON

        if not entity_name or not ticker:
            return format_response(None, "Missing required fields", 400)
        
        # Fetch data for the report
        #TODO: Replace with actual data fetch. Maybe can create a new function in services folder
        news_items = news_by_ticker(ticker)
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

        email_sent = send_email_with_attachment(mail, pdf_filepath, recipient_email, sender_email, entity_name)

        if not email_sent:
            return format_response(None, "Failed to send email", 500)

        # Delete the PDF file after sending
        def cleanup():
            time.sleep(5)  # Give time for the file to be fully sent
            try:
                if os.path.exists(pdf_filepath):
                    os.remove(pdf_filepath)
                    logging.info(f"Deleted file: {pdf_filepath}")
            except Exception as e:
                logging.error(f"Error deleting file: {traceback.format_exc()}")

         # Run cleanup in a background thread
        threading.Thread(target=cleanup, daemon=True).start()
        return format_response({'success': True}, "Email sent", 200)

    except Exception as e:
        logging.error(f"Error: {traceback.format_exc()}")
        return format_response(None, "Failed to send email", 500)
