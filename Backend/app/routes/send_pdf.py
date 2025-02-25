from flask import request, Blueprint
from flask_mail import Mail
import os
import logging
import traceback
from app.services.export_pdf import generate_pdf
from app.services.email_pdf import send_email_with_attachment
from app.utils.helpers import format_response

send_pdf_bp = Blueprint('send_pdf_email', __name__)
mail = Mail()  # Initialize Flask-Mail

@send_pdf_bp.route('/send_pdf_email', methods=['POST'])
def send_pdf_email():
    try:
        data = request.get_json()
        entity_name = data.get('entity_name')
        sender_email = "sender@example.com"
        recipient_email = "recipient@example.com"

        if not entity_name:
            return format_response(None, "Entity name is required", 400)

        pdf_filepath = f"temp_pdfs/{entity_name}_report.pdf" 
        
        if not os.path.exists(pdf_filepath):
            # Generate the PDF if it doesn't exist
            key_metrics = {"Revenue": 1000000, "Net Income": 500000}
            news_items = []  # Fetch news if needed
            pdf_filepath = generate_pdf(entity_name, key_metrics, news_items, pdf_filepath)

        email_sent = send_email_with_attachment(mail, pdf_filepath, recipient_email, sender_email, entity_name)

        if not email_sent:
            return format_response(None, "Failed to send email", 500)

        os.remove(pdf_filepath)  # Cleanup after sending
        return format_response({'success': True}, "Email sent", 200)

    except Exception as e:
        logging.error(f"Error: {traceback.format_exc()}")
        return format_response(None, "Failed to send email", 500)
