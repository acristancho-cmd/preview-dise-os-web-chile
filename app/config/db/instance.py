"""Config async session for DE MYSQL"""

from functools import lru_cache
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config.settings import settings


@lru_cache(maxsize=1)
def _sql_url() -> str:
    """Return the url for the database"""
    return f"{settings.DB_ENGINE}://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_IP}:{settings.DB_PORT}/{settings.DB_NAME}"  # pylint: disable=line-too-long


async_session = sessionmaker(
    bind=create_async_engine(_sql_url()),
    class_=AsyncSession,  # type: ignore
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Context manager for async session"""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except:
            await session.rollback()
            raise
