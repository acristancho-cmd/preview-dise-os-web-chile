"""Base Settings for the app."""

import os
from functools import lru_cache
from zoneinfo import ZoneInfo

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _is_static_preview(db_name: str) -> bool:
    """
    Sin variables en Vercel: deploy de solo diseño (HTML/CSS).
    - Vercel exporta VERCEL=1; si no hay DB_NAME, no exigimos secretos ni DB.
    - En local: TRII_STATIC_PREVIEW=1 para el mismo comportamiento sin .env.
    """
    if os.environ.get("TRII_STATIC_PREVIEW", "").strip().lower() in (
        "1",
        "true",
        "yes",
    ):
        return True
    if os.environ.get("VERCEL") == "1" and not (db_name or "").strip():
        return True
    return False


class Settings(BaseSettings):
    """
    Get Settings from env file or env variables
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "Cashout [ CO ]"
    PROJECT_VERSION: str = "0.2.5"
    DEBUG: bool = False

    # En modo solo-diseño pueden quedar vacíos; el validador exige datos si no es preview
    DB_ENGINE: str = ""
    DB_IP: str = ""
    DB_USER: str = ""
    DB_PASSWORD: str = ""
    DB_NAME: str = ""
    DB_PORT: int = 3306

    # Not named "TZ" — collides with system env `TZ` on Vercel (:UTC).
    app_timezone: ZoneInfo = Field(
        default_factory=lambda: ZoneInfo("America/Bogota"),
    )

    from_email: str = ""
    mj_apikey_public: str = ""
    mj_apikey_private: str = ""
    be_auth: str = ""
    be_user_data_co: str = ""
    secret_key: str = ""
    PSE_REDIRECT_URL: str = "https://www.trii.co"

    is_static_preview: bool = False

    @field_validator("app_timezone", mode="before")
    @classmethod
    def _coerce_app_timezone(cls, value):
        if value is None or value == "":
            return ZoneInfo("America/Bogota")
        if isinstance(value, ZoneInfo):
            return value
        if isinstance(value, str):
            return ZoneInfo(value)
        return value

    @model_validator(mode="after")
    def _apply_static_preview_and_require_production(self):
        preview = _is_static_preview(self.DB_NAME)
        object.__setattr__(self, "is_static_preview", preview)
        if preview:
            return self
        missing = [
            name
            for name, val in (
                ("DB_ENGINE", self.DB_ENGINE),
                ("DB_IP", self.DB_IP),
                ("DB_USER", self.DB_USER),
                ("DB_PASSWORD", self.DB_PASSWORD),
                ("DB_NAME", self.DB_NAME),
                ("from_email", self.from_email),
                ("mj_apikey_public", self.mj_apikey_public),
                ("mj_apikey_private", self.mj_apikey_private),
                ("be_auth", self.be_auth),
                ("be_user_data_co", self.be_user_data_co),
                ("secret_key", self.secret_key),
                ("PSE_REDIRECT_URL", self.PSE_REDIRECT_URL),
            )
            if not (isinstance(val, str) and val.strip())
        ]
        if missing:
            raise ValueError(
                "Faltan variables de entorno para entorno completo: " + ", ".join(missing)
            )
        return self


settings = Settings()  # type: ignore


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Get settings from env file or env variables
    """
    return Settings()
