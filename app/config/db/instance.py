"""Config async session for DE MYSQL"""

from functools import lru_cache
from typing import Any, AsyncGenerator, Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config.settings import settings


@lru_cache(maxsize=1)
def _sql_url() -> str:
    """Return the url for the database"""
    return f"{settings.DB_ENGINE}://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_IP}:{settings.DB_PORT}/{settings.DB_NAME}"  # pylint: disable=line-too-long


@lru_cache(maxsize=1)
def _async_session_factory() -> Optional[Any]:
    """Solo crea el engine si no estamos en vista previa estática (Vercel sin env)."""
    if settings.is_static_preview:
        return None
    engine: AsyncEngine = create_async_engine(_sql_url())
    return sessionmaker(
        bind=engine,
        class_=AsyncSession,  # type: ignore
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Context manager for async session"""
    factory = _async_session_factory()
    if factory is None:
        raise HTTPException(
            status_code=503,
            detail="Contenido no disponible en esta vista previa (sin base de datos).",
        )
    async with factory() as session:  # type: ignore[operator]
        try:
            yield session
            await session.commit()
        except:  # pylint: disable=bare-except
            await session.rollback()
            raise
