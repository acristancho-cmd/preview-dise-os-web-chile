import os

from mailjet_rest import Client


def get_client():
    """Get mailjet client"""
    api_key_mailjet = os.environ["MJ_APIKEY_PUBLIC"]
    api_secret_mailjet = os.environ["MJ_APIKEY_PRIVATE"]
    return Client(auth=(api_key_mailjet, api_secret_mailjet), version="v3.1")


def get_content(name, message, email):
    """Read content email from file"""
    with open("app/templates/email/contact_email.html", "r", encoding="utf8") as file:
        return (
            file.read()
            .replace("{{name}}", name)
            .replace("{{message}}", message)
            .replace("{{email}}", email)
        )


def send_email(name, email, email_contact, message):
    """Send a mailjet email"""
    content = get_content(name, message, email_contact)
    data = {
        "Messages": [
            {
                "From": {"Email": "contacto@trii.co", "Name": "trii"},
                "To": [{"Email": email}],
                "Subject": "Contacto trii",
                "TextPart": f"Correo de contacto trii {name} {message}",
                "HTMLPart": content,
            }
        ]
    }
    mailjet = get_client()
    return mailjet.send.create(data=data)
