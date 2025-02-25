from flask_mail import Mail, Message
import logging
import traceback

mail = Mail()

def send_email_with_attachment(mail,pdf_filepath, recipient_email, sender_email, entity_name):
    try:
        msg = Message(
            f"PDF Report for {entity_name}",
            recipients=[recipient_email], 
            sender=sender_email  
        )
        msg.body = f"Please find attached the PDF report for {entity_name}."

        with open(pdf_filepath, 'rb') as f:
            msg.attach(f"{entity_name}_report.pdf", 'application/pdf', f.read())

        mail.send(msg)
        logging.info(f"Email sent to {recipient_email} with attachment {pdf_filepath}")
        return True
    except Exception as e:
        logging.error(f"Error sending email: {traceback.format_exc()}")
        return False
