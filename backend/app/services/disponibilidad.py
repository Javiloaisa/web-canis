import datetime as dt
from typing import Literal

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import FRANJAS, LIMITE_PAELLA, LIMITE_TOTAL
from app.db import engine
from app.models import Reserva
from app.schemas import FranjaDisponibilidad, ReservaCreate, ReservaUpdate


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
        # El advisory lock serializa por franja. Solo existe en Postgres; en la
        # demo local con SQLite (sin Docker) se omite — las escrituras de SQLite
        # ya están serializadas por el propio fichero.
        if engine.dialect.name == "postgresql":
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


async def editar_reserva(
    db: AsyncSession, reserva_id: int, data: ReservaUpdate
) -> Reserva | None:
    """Edita una reserva. Si cambia de franja o pasa a llevar paella, re-valida el
    cupo de la franja destino (excluyendo la propia reserva) de forma atómica.
    Devuelve None si la reserva no existe, y lanza SinCupoError si no hay cupo.
    """
    async with db.begin():
        reserva = await db.get(Reserva, reserva_id)
        if reserva is None:
            return None

        franja_str = data.franja if data.franja is not None else reserva.franja.strftime("%H:%M")
        nueva_franja = dt.time.fromisoformat(franja_str)
        nueva_paella = data.quiere_paella if data.quiere_paella is not None else reserva.quiere_paella

        cambia_cupo = nueva_franja != reserva.franja or (nueva_paella and not reserva.quiere_paella)
        if cambia_cupo:
            lock_key = f"{reserva.fecha.isoformat()}:{franja_str}"
            if engine.dialect.name == "postgresql":
                await db.execute(
                    text("SELECT pg_advisory_xact_lock(hashtext(:key))"), {"key": lock_key}
                )

            result = await db.execute(
                select(Reserva.quiere_paella).where(
                    Reserva.fecha == reserva.fecha,
                    Reserva.franja == nueva_franja,
                    Reserva.estado == "confirmada",
                    Reserva.id != reserva_id,
                )
            )
            otros = result.scalars().all()
            if len(otros) + 1 > LIMITE_TOTAL:
                raise SinCupoError("mesas")
            if nueva_paella and sum(otros) + 1 > LIMITE_PAELLA:
                raise SinCupoError("paellas")

        if data.nombre is not None:
            reserva.nombre = data.nombre
        if data.telefono is not None:
            reserva.telefono = data.telefono
        if data.personas is not None:
            reserva.personas = data.personas
        if data.ha_llegado is not None:
            reserva.ha_llegado = data.ha_llegado
        reserva.franja = nueva_franja
        reserva.quiere_paella = nueva_paella

        await db.flush()
        await db.refresh(reserva)

    return reserva
