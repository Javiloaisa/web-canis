import pytest

from app.config import settings

pytestmark = pytest.mark.asyncio(loop_scope="session")


async def test_login_correcto_devuelve_token(client):
    response = await client.post(
        "/auth/login", json={"username": "admin", "password": "canis-admin-dev"}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


async def test_login_password_incorrecta_devuelve_401(client):
    response = await client.post(
        "/auth/login", json={"username": "admin", "password": "incorrecta"}
    )
    assert response.status_code == 401


async def test_get_reservas_sin_token_devuelve_401(client):
    response = await client.get("/reservas", params={"fecha": "2026-07-20"})
    assert response.status_code == 401


async def test_get_reservas_con_token_devuelve_200(client):
    login = await client.post(
        "/auth/login",
        json={"username": settings.admin_username, "password": "canis-admin-dev"},
    )
    token = login.json()["access_token"]

    response = await client.get(
        "/reservas",
        params={"fecha": "2026-07-20"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200


async def test_patch_reserva_sin_token_devuelve_401(client):
    response = await client.patch("/reservas/1", json={"estado": "cancelada"})
    assert response.status_code == 401
