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
    """Edición parcial de una reserva. Todos los campos son opcionales."""

    franja: str | None = None
    quiere_paella: bool | None = None
    nombre: str | None = None
    telefono: str | None = None
    personas: int | None = None
    ha_llegado: bool | None = None


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
    ha_llegado: bool
    creada_en: dt.datetime
