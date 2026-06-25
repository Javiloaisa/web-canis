import datetime as dt

import pytest

from app.models import Reserva
from app.services.disponibilidad import obtener_disponibilidad

pytestmark = pytest.mark.asyncio(loop_scope="session")

FECHA = dt.date(2026, 7, 4)


async def _crear_reservas(db_session, franja: str, quiere_paella: bool, n: int) -> None:
    for _ in range(n):
        db_session.add(
            Reserva(
                fecha=FECHA,
                franja=dt.time.fromisoformat(franja),
                quiere_paella=quiere_paella,
                nombre="Test",
                telefono="600000000",
                personas=2,
                estado="confirmada",
                origen="web",
            )
        )
    await db_session.commit()


async def test_franja_vacia_permite_todo(db_session):
    disponibilidad = await obtener_disponibilidad(db_session, FECHA)
    primera = disponibilidad[0]
    assert primera.ocupadas == 0
    assert primera.puede_paella is True
    assert primera.puede_sin_paella is True


async def test_siete_paellas_no_bloquean_mesas_sin_paella(db_session):
    await _crear_reservas(db_session, "19:00", quiere_paella=True, n=7)
    disponibilidad = await obtener_disponibilidad(db_session, FECHA)
    franja = next(f for f in disponibilidad if f.franja == "19:00")
    assert franja.con_paella == 7
    assert franja.puede_paella is False
    assert franja.puede_sin_paella is True  # quedan 3 mesas libres de las 10


async def test_diez_mesas_bloquean_todo(db_session):
    await _crear_reservas(db_session, "20:00", quiere_paella=True, n=7)
    await _crear_reservas(db_session, "20:00", quiere_paella=False, n=3)
    disponibilidad = await obtener_disponibilidad(db_session, FECHA)
    franja = next(f for f in disponibilidad if f.franja == "20:00")
    assert franja.ocupadas == 10
    assert franja.puede_paella is False
    assert franja.puede_sin_paella is False


async def test_reserva_cancelada_no_cuenta(db_session):
    db_session.add(
        Reserva(
            fecha=FECHA,
            franja=dt.time.fromisoformat("21:00"),
            quiere_paella=True,
            nombre="Cancelada",
            telefono="600000000",
            personas=2,
            estado="cancelada",
            origen="web",
        )
    )
    await db_session.commit()
    disponibilidad = await obtener_disponibilidad(db_session, FECHA)
    franja = next(f for f in disponibilidad if f.franja == "21:00")
    assert franja.ocupadas == 0
