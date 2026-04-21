from app.functions.mailjet.mailjet_email import send_email


def send_email_contact(name, email, message):
    """Send emails and copies"""
    send_email(name, email, email, message)
    send_email(name, "liuspatt@gmail.com", email, message)
    send_email(name, "h.hernandez@trii.co ", email, message)
    send_email(name, "contacto@trii.co", email, message)
