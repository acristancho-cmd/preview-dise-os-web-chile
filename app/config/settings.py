"""Base Settings for the app."""

from functools import lru_cache
from zoneinfo import ZoneInfo
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Get Settings from env file or env variables
    """

    PROJECT_NAME: str = "Cashout [ CO ]"
    PROJECT_VERSION: str = "0.2.5"
    DEBUG: bool = False

    DB_ENGINE: str
    DB_IP: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_PORT: int = 3306

    TZ: ZoneInfo = ZoneInfo("America/Bogota")

    from_email: str
    mj_apikey_public: str
    mj_apikey_private: str
    be_auth: str
    be_user_data_co: str
    secret_key: str
    PSE_REDIRECT_URL: str

    class Config:
        """Config class PyDantic required for read env variables"""

        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()  # type: ignore


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Get settings from env file or env variables
    """
    return Settings()
