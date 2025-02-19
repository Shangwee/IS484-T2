from flask import Flask, request, send_file, jsonify
from fpdf import FPDF
from datetime import datetime
import os
from flask_cors import CORS
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],  # Your React frontend URL
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

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

@app.route("/generate-pdf", methods=["POST"])
def generate_pdf_route():
    try:
        # Get and validate data
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        entity_name = data.get("entity_name", "Unknown Entity")
        key_metrics = data.get("key_metrics", {})
        news_items = data.get("news_items", [])

        # Generate PDF
        pdf_filename = generate_pdf(entity_name, key_metrics, news_items)
        
        # Send file
        try:
            return send_file(
                pdf_filename,
                as_attachment=True,
                download_name=f"{entity_name.replace(' ', '_')}_report.pdf",
                mimetype='application/pdf'
            )
        finally:
            # Clean up the file after sending
            if os.path.exists(pdf_filename):
                os.remove(pdf_filename)
                
    except Exception as e:
        logger.error(f"Route error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "Failed to generate PDF"}), 500

@app.errorhandler(500)
def handle_500_error(e):
    logger.error(f"Internal server error: {str(e)}\n{traceback.format_exc()}")
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(404)
def handle_404_error(e):
    return jsonify({"error": "Resource not found"}), 404


@app.route("/api/companies/<company_id>", methods=["GET"])
def get_company_data(company_id):
    try:
        # replace with database query
        companies_data = {

            "tsmc": {
                "entity_name": "TSMC",
                "key_metrics": {
                    "Revenue": "$56.2B",
                    "Employees": "56,000",
                    "Market Share": "54%",
                    "R&D Spending": "$3.72B",
                    "Manufacturing Capacity": "13M wafers/year"
                },
                
                "news_items": [
                    {
                        "title": "TSMC Announces 2nm Process Node",
                        "url": "https://example.com/tsmc-2nm"
                    },
                    {
                        "title": "New Arizona Fab Construction Progress",
                        "url": "https://example.com/tsmc-arizona"
                    }
                ]
            },
            # Add more companies as needed
        }

        if company_id not in companies_data:
            return jsonify({"error": "Company not found"}), 404

        return jsonify(companies_data[company_id])

    except Exception as e:
        logger.error(f"Error fetching company data: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "Failed to fetch company data"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)