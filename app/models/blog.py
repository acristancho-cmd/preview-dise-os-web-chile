"""Base model for cashout."""

from datetime import datetime
from sqlmodel import SQLModel, Field


class Post(SQLModel, table=True):
    """Cashout Model"""

    __tablename__ = "posts"
    content: str
    description_short: str
    image_cover: str
    image_list: str
    tag: str
    title: str
    id: int = Field(primary_key=True, nullable=False)
    inserted_at: datetime
