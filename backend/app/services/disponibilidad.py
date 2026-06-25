import datetime as dt
from typing import Literal

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import FRANJAS, LIMITE_PAELLA, LIMITE_TOTAL
from app.models import Reserva
from app.schemas import FranjaDisponibilidad, ReservaCreate


class SinCupoError(Exception):
    def __init__(self, motivo: Literal["mesas", "paellas"]):
        self.motivo = motivo
        super().__init__(f"Sin cupo de {motivo}")


async def obtener_disponibilidad(
    db: AsyncSession, fecha: dt.date
) -> list[FranjaDisponibilidad]:
    result = await db.execute(
        select(Reserva.franja, Reserva.quiere_paella).where(
            Reserva.fecha == fecha,
            Reserva.estado == "confirmada",
        )
    )
    por_franja: dict[str, list[bool]] = {franja: [] for franja in FRANJAS}
    for franja_time, quiere_paella in result.all():
        clave = franja_time.strftime("%H:%M")
        if clave in por_franja:
            por_franja[clave].append(quiere_paella)

    disponibilidad = []
    for franja in FRANJAS:
        flags = por_franja[franja]
        ocupadas = len(flags)
        con_paella = sum(flags)
        disponibilidad.append(
            FranjaDisponibilidad(
                franja=franja,
                ocupadas=ocupadas,
                con_paella=con_paella,
                libres_total=LIMITE_TOTAL - ocupadas,
                puede_paella=con_paella < LIMITE_PAELLA and ocupadas < LIMITE_TOTAL,
                puede_sin_paella=ocupadas < LIMITE_TOTAL,
            )
        )
    return disponibilidad


async def crear_reserva_atomica(db: AsyncSession, data: ReservaCreate) -> Reserva:
    """Crea una reserva validando los cupos de forma atómica.

    Usa un advisory lock por (fecha, franja) en vez de SELECT ... FOR UPDATE sobre
    las filas existentes: si la franja todavía no tiene ninguna reserva no hay fila
    que bloquear, y dos transacciones concurrentes verían ambas "cupo libre" y
    crearían una 8ª paella. El advisory lock serializa a todos los que compiten por
    la misma franja, exista ya alguna reserva o no.
    """
    franja_time = dt.time.fromisoformat(data.franja)
    lock_key = f"{data.fecha.isoformat()}:{data.franja}"

    async with db.begin():
        await db.execute(
            text("SELECT pg_advisory_xact_lock(hashtext(:key))"), {"key": lock_key}
        )

        result = await db.execute(
            select(Reserva.quiere_paella).where(
                Reserva.fecha == data.fecha,
                Reserva.franja == franja_time,
                Reserva.estado == "confirmada",
            )
        )
        existentes = result.scalars().all()
        ocupadas = len(existentes)
        con_paella = sum(existentes)

        if ocupadas >= LIMITE_TOTAL:
            raise SinCupoError("mesas")
        if data.quiere_paella and con_paella >= LIMITE_PAELLA:
            raise SinCupoError("paellas")

        reserva = Reserva(
            fecha=data.fecha,
            franja=franja_time,
            quiere_paella=data.quiere_paella,
            nombre=data.nombre,
            telefono=data.telefono,
            personas=data.personas,
            origen=data.origen,
        )
        db.add(reserva)
        await db.flush()
        await db.refresh(reserva)

    return reserva
