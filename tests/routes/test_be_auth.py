import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_home(client: AsyncClient) -> None:
    """Test error home"""

    session = await client.get("/")
    assert session.status_code == 200
