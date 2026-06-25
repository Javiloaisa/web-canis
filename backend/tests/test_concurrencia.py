import asyncio

import pytest

pytestmark = pytest.mark.asyncio(loop_scope="session")


def _payload(**overrides):
    base = {
        "fecha": "2026-07-10",
        "franja": "21:00",
        "quiere_paella": True,
        "nombre": "Test",
        "telefono": "600000000",
        "personas": 2,
        "origen": "web",
    }
    base.update(overrides)
    return base


async def test_carrera_octava_paella_no_permite_overbooking(client):
    """Con 6 paellas ya reservadas queda 1 cupo. Dos peticiones simultáneas
    compitiendo por esa 7ª paella deben resolverse en 1 éxito + 1 rechazo,
    nunca en 2 éxitos (lo que crearía la 8ª paella prohibida)."""
    fecha, franja = "2026-07-10", "21:00"
    for _ in range(6):
        r = await client.post("/reservas", json=_payload(fecha=fecha, franja=franja))
        assert r.status_code == 201

    resultado_a, resultado_b = await asyncio.gather(
        client.post("/reservas", json=_payload(fecha=fecha, franja=franja, nombre="A")),
        client.post("/reservas", json=_payload(fecha=fecha, franja=franja, nombre="B")),
    )

    codigos = sorted([resultado_a.status_code, resultado_b.status_code])
    assert codigos == [201, 409]

    disponibilidad = await client.get("/disponibilidad", params={"fecha": fecha})
    franja_data = next(f for f in disponibilidad.json() if f["franja"] == franja)
    assert franja_data["con_paella"] == 7


async def test_carrera_oncena_mesa_no_permite_overbooking(client):
    """Con 7 paellas + 2 sin paella (9 mesas) queda 1 mesa libre. Dos peticiones
    simultáneas sin paella compitiendo por esa última mesa deben resolverse en
    1 éxito + 1 rechazo, nunca en 2 éxitos (la 11ª mesa prohibida)."""
    fecha, franja = "2026-07-11", "22:00"
    for _ in range(7):
        r = await client.post(
            "/reservas", json=_payload(fecha=fecha, franja=franja, quiere_paella=True)
        )
        assert r.status_code == 201
    for _ in range(2):
        r = await client.post(
            "/reservas", json=_payload(fecha=fecha, franja=franja, quiere_paella=False)
        )
        assert r.status_code == 201

    resultado_a, resultado_b = await asyncio.gather(
        client.post(
            "/reservas",
            json=_payload(fecha=fecha, franja=franja, quiere_paella=False, nombre="A"),
        ),
        client.post(
            "/reservas",
            json=_payload(fecha=fecha, franja=franja, quiere_paella=False, nombre="B"),
        ),
    )

    codigos = sorted([resultado_a.status_code, resultado_b.status_code])
    assert codigos == [201, 409]

    disponibilidad = await client.get("/disponibilidad", params={"fecha": fecha})
    franja_data = next(f for f in disponibilidad.json() if f["franja"] == franja)
    assert franja_data["ocupadas"] == 10
