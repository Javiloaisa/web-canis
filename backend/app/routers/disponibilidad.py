import datetime as dt

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import FranjaDisponibilidad
from app.services.disponibilidad import obtener_disponibilidad

router = APIRouter(tags=["disponibilidad"])


@router.get("/disponibilidad", response_model=list[FranjaDisponibilidad])
async def get_disponibilidad(
    fecha: dt.date, db: AsyncSession = Depends(get_db)
) -> list[FranjaDisponibilidad]:
    return await obtener_disponibilidad(db, fecha)
