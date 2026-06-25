import datetime as dt

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_admin_actual
from app.constants import FRANJAS
from app.db import get_db
from app.models import Reserva
from app.schemas import ReservaCreate, ReservaOut, ReservaUpdate
from app.services.disponibilidad import SinCupoError, crear_reserva_atomica

router = APIRouter(tags=["reservas"])


@router.post("/reservas", response_model=ReservaOut, status_code=201)
async def post_reserva(
    data: ReservaCreate, db: AsyncSession = Depends(get_db)
) -> Reserva:
    if data.franja not in FRANJAS:
        raise HTTPException(status_code=400, detail="Franja no válida")
    if data.personas < 1:
        raise HTTPException(status_code=400, detail="Número de personas no válido")

    try:
        return await crear_reserva_atomica(db, data)
    except SinCupoError as exc:
        raise HTTPException(
            status_code=409,
            detail={"motivo": exc.motivo},
        ) from exc


@router.get("/reservas", response_model=list[ReservaOut])
async def get_reservas(
    fecha: dt.date,
    db: AsyncSession = Depends(get_db),
    _admin: str = Depends(get_admin_actual),
) -> list[Reserva]:
    result = await db.execute(
        select(Reserva).where(Reserva.fecha == fecha).order_by(Reserva.franja)
    )
    return list(result.scalars().all())


@router.patch("/reservas/{reserva_id}", response_model=ReservaOut)
async def patch_reserva(
    reserva_id: int,
    data: ReservaUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: str = Depends(get_admin_actual),
) -> Reserva:
    reserva = await db.get(Reserva, reserva_id)
    if reserva is None:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    reserva.estado = data.estado
    await db.commit()
    await db.refresh(reserva)
    return reserva
