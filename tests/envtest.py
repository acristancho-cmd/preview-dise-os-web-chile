import os
import google.auth
from google.cloud import secretmanager

credentials = os.environ["credentials"]

with open("credentials.json", "w") as f:
    f.write(credentials)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"


def get_project_id() -> str:
    """get porject id
    Returns:
        str: project id
    """

    project_id = google.auth.default()[1]
    return project_id


def get_secret() -> str:
    """
    Retrieves the secret from the Secret Manager.
    """
    client = secretmanager.SecretManagerServiceClient()
    request = {
        "name": f"projects/{get_project_id()}/secrets/dev-env-be-web-trii/versions/latest"
    }
    response = client.access_secret_version(request)
    return response.payload.data.decode()


with open(".env", "w") as f:
    f.write(get_secret())
