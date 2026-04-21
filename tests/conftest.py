from typing import AsyncGenerator
import pytest
from httpx import ASGITransport, AsyncClient
from asgi_lifespan import LifespanManager
from main import app

base_url = "http://test"


@pytest.fixture(scope="session")
def anyio_backend():
    """asyncio backend"""
    return "asyncio"


@pytest.fixture(scope="session")
async def client() -> AsyncGenerator[AsyncClient, None]:
    """async client for test"""
    transport = ASGITransport(app)
    async with LifespanManager(app):
        async with AsyncClient(transport=transport, base_url=base_url) as _client:
            yield _client
