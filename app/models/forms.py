import datetime
from typing import Optional

import sqlalchemy
from sqlalchemy import text
from sqlmodel import SQLModel, Field


class ContactForm(SQLModel, table=True):
    """Contact form model"""

    id: Optional[int] = Field(primary_key=True, nullable=False)
    name: str = Field()
    last_name: str = Field()
    email: str = Field()
    phone: str = Field()
    web_page: Optional[str] = Field()
    instagram: Optional[str] = Field()
    portfolio: Optional[str] = Field()
    username: Optional[str] = Field()
    date_creation: datetime.datetime = Field(
        sa_column=sqlalchemy.Column(
            sqlalchemy.DateTime(timezone=True),
            server_default=text("CURRENT_TIMESTAMP()"),
        )
    )


class AdsForm(SQLModel, table=True):
    """Ads form model"""

    id: Optional[int] = Field(primary_key=True, nullable=False)
    name: str = Field()
    last_name: str = Field()
    email: str = Field()
    phone: str = Field()
    date_creation: datetime.datetime = Field(
        sa_column=sqlalchemy.Column(
            sqlalchemy.DateTime(timezone=True),
            server_default=text("CURRENT_TIMESTAMP()"),
        )
    )
