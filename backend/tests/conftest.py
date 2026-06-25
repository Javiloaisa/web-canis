import os

# Los tests hacen create_all/drop_all sobre toda la tabla "reservas": si se
# apuntara a la misma base que se usa en desarrollo, cada `pytest` borraría los
# datos de desarrollo. Se fuerza aquí, antes de importar app.config, una base
# de test separada (mismo servidor Postgres, base de datos "canis_test").
_url_dev = os.environ.get(
    "DATABASE_URL", "postgresql+asyncpg://canis:canis@localhost:5432/canis"
)
os.environ["DATABASE_URL"] = _url_dev.rsplit("/", 1)[0] + "/canis_test"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text

from app.db import Base, SessionLocal, engine
from app.main import app


@pytest_asyncio.fixture(scope="session", autouse=True)
async def _setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(autouse=True)
async def _limpiar_reservas():
    yield
    async with SessionLocal() as session:
        await session.execute(text("TRUNCATE TABLE reservas RESTART IDENTITY"))
        await session.commit()


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def db_session():
    async with SessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def auth_headers(client):
    response = await client.post(
        "/auth/login", json={"username": "admin", "password": "canis-admin-dev"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
