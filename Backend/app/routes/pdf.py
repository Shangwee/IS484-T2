from flask import request, send_file, Blueprint
from datetime import datetime
from app.utils.helpers import format_response
from app.services.export_pdf import generate_pdf
import traceback
import logging
import os

pdf_bp = Blueprint('pdf', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure upload folder for temporary PDF files
UPLOAD_FOLDER = 'temp_pdfs'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@pdf_bp.route('/generate_pdf', methods=['POST'])
def export_pdf():
    data = request.get_json()

    if not data:
        return format_response(None, "No data provided",400)

    entity_name = data.get("entity_name", "Unknown Entity")
    key_metrics = data.get("key_metrics", {})
    news_items = data.get("news_items", [])

    output_filename = f"{entity_name}_report_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"

    try:
        pdf_filename = generate_pdf(entity_name, key_metrics, news_items, output_filename)
        return send_file(
            pdf_filename,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/pdf'
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {traceback.format_exc()}")
        return format_response(None, "Error generating PDF", 500)
    finally:
        # Clean up the file after sending
        if os.path.exists(pdf_filename):
            os.remove(pdf_filename)

@pdf_bp.errorhandler(500)
def handle_500_error(e):
    logger.error(f"Internal server error: {str(e)}\n{traceback.format_exc()}")
    return format_response(None, "Internal server error", 500)

@pdf_bp.errorhandler(404)
def handle_404_error(e):
    return format_response(None, "Resource not found", 404)

