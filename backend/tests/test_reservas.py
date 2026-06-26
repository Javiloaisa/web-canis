import pytest

pytestmark = pytest.mark.asyncio(loop_scope="session")


def _payload(**overrides):
    base = {
        "fecha": "2026-07-05",
        "franja": "19:30",
        "quiere_paella": True,
        "nombre": "Ana",
        "telefono": "600111222",
        "personas": 4,
        "origen": "web",
    }
    base.update(overrides)
    return base


async def test_crear_reserva_exitosa(client):
    response = await client.post("/reservas", json=_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["estado"] == "confirmada"
    assert body["quiere_paella"] is True


async def test_franja_invalida_devuelve_400(client):
    response = await client.post("/reservas", json=_payload(franja="19:15"))
    assert response.status_code == 400


async def test_octava_paella_devuelve_409_con_motivo_paellas(client):
    for _ in range(7):
        r = await client.post("/reservas", json=_payload())
        assert r.status_code == 201

    r8 = await client.post("/reservas", json=_payload(nombre="Octava"))
    assert r8.status_code == 409
    assert r8.json()["detail"]["motivo"] == "paellas"


async def test_oncena_mesa_devuelve_409_con_motivo_mesas(client):
    for _ in range(7):
        r = await client.post("/reservas", json=_payload(quiere_paella=True))
        assert r.status_code == 201
    for _ in range(3):
        r = await client.post("/reservas", json=_payload(quiere_paella=False))
        assert r.status_code == 201

    r11 = await client.post("/reservas", json=_payload(quiere_paella=False, nombre="Oncena"))
    assert r11.status_code == 409
    assert r11.json()["detail"]["motivo"] == "mesas"


async def test_get_reservas_filtra_por_fecha(client, auth_headers):
    await client.post("/reservas", json=_payload(fecha="2026-07-06"))
    await client.post("/reservas", json=_payload(fecha="2026-07-07"))

    response = await client.get(
        "/reservas", params={"fecha": "2026-07-06"}, headers=auth_headers
    )
    assert response.status_code == 200
    reservas = response.json()
    assert len(reservas) == 1
    assert reservas[0]["fecha"] == "2026-07-06"


async def test_patch_reserva_edita_campos(client, auth_headers):
    creada = await client.post("/reservas", json=_payload(fecha="2026-07-08"))
    reserva_id = creada.json()["id"]

    response = await client.patch(
        f"/reservas/{reserva_id}",
        json={"personas": 6, "nombre": "Ana María"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["personas"] == 6
    assert body["nombre"] == "Ana María"


async def test_patch_reserva_marca_llegada(client, auth_headers):
    creada = await client.post("/reservas", json=_payload(fecha="2026-07-09"))
    reserva_id = creada.json()["id"]
    assert creada.json()["ha_llegado"] is False

    response = await client.patch(
        f"/reservas/{reserva_id}", json={"ha_llegado": True}, headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["ha_llegado"] is True


async def test_patch_reserva_a_franja_sin_paella_devuelve_409(client, auth_headers):
    # Llenamos 21:00 con 7 paellas y creamos una reserva sin paella en otra franja.
    for _ in range(7):
        r = await client.post("/reservas", json=_payload(fecha="2026-07-10", franja="21:00"))
        assert r.status_code == 201
    otra = await client.post(
        "/reservas", json=_payload(fecha="2026-07-10", franja="19:00", quiere_paella=False)
    )
    reserva_id = otra.json()["id"]

    # Moverla a 21:00 pidiendo paella debe chocar con el cupo de paellas.
    response = await client.patch(
        f"/reservas/{reserva_id}",
        json={"franja": "21:00", "quiere_paella": True},
        headers=auth_headers,
    )
    assert response.status_code == 409
    assert response.json()["detail"]["motivo"] == "paellas"


async def test_patch_reserva_inexistente_devuelve_404(client, auth_headers):
    response = await client.patch(
        "/reservas/999999", json={"personas": 3}, headers=auth_headers
    )
    assert response.status_code == 404


async def test_delete_reserva(client, auth_headers):
    creada = await client.post("/reservas", json=_payload(fecha="2026-07-11"))
    reserva_id = creada.json()["id"]

    borrada = await client.delete(f"/reservas/{reserva_id}", headers=auth_headers)
    assert borrada.status_code == 204

    listado = await client.get(
        "/reservas", params={"fecha": "2026-07-11"}, headers=auth_headers
    )
    assert all(r["id"] != reserva_id for r in listado.json())


async def test_delete_reserva_inexistente_devuelve_404(client, auth_headers):
    response = await client.delete("/reservas/999999", headers=auth_headers)
    assert response.status_code == 404
