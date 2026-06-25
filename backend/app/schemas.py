import datetime as dt
from typing import Literal

from pydantic import BaseModel, ConfigDict


class FranjaDisponibilidad(BaseModel):
    franja: str
    ocupadas: int
    con_paella: int
    libres_total: int
    puede_paella: bool
    puede_sin_paella: bool


class ReservaCreate(BaseModel):
    fecha: dt.date
    franja: str
    quiere_paella: bool
    nombre: str
    telefono: str
    personas: int
    origen: Literal["web", "bot", "panel"]


class ReservaUpdate(BaseModel):
    estado: Literal["confirmada", "cancelada"]


class ReservaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: dt.date
    franja: dt.time
    quiere_paella: bool
    nombre: str
    telefono: str
    personas: int
    estado: str
    origen: str
    creada_en: dt.datetime
