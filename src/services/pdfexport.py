from flask import Flask, request, send_file
from fpdf import FPDF
from datetime import datetime
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_pdf(entity_name, key_metrics, news_items, output_filename="report.pdf"):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Page 1: Entity Overview
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, f"Entity Report: {entity_name}", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, "Key Metrics:", ln=True)
    pdf.ln(5)

    for key, value in key_metrics.items():
        pdf.cell(200, 10, f"{key}: {value}", ln=True)

    # Page 2: Relevant News
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "Relevant News", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for i, news in enumerate(news_items[:10], 1):
        pdf.multi_cell(0, 10, f"{i}. {news['title']}\n{news['url']}\n")
        pdf.ln(5)

    # Add Timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf.set_y(-20)
    pdf.set_font("Arial", "I", 10)
    pdf.cell(0, 10, f"Report generated on: {timestamp}", ln=True, align='C')

    # Save PDF
    pdf.output(output_filename)
    return output_filename

@app.route("/generate-pdf", methods=["POST"])
def generate_pdf_route():
    data = request.json
    entity_name = data.get("entity_name", "Unknown Entity")
    key_metrics = data.get("key_metrics", {})
    news_items = data.get("news_items", [])

    pdf_filename = generate_pdf(entity_name, key_metrics, news_items)
    return send_file(pdf_filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
