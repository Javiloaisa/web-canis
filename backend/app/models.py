import datetime as dt

from sqlalchemy import Boolean, Date, DateTime, Integer, String, Time, false, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Reserva(Base):
    __tablename__ = "reservas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fecha: Mapped[dt.date] = mapped_column(Date, nullable=False)
    franja: Mapped[dt.time] = mapped_column(Time, nullable=False)
    quiere_paella: Mapped[bool] = mapped_column(Boolean, nullable=False)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    telefono: Mapped[str] = mapped_column(String, nullable=False)
    personas: Mapped[int] = mapped_column(Integer, nullable=False)
    estado: Mapped[str] = mapped_column(String, nullable=False, default="confirmada")
    origen: Mapped[str] = mapped_column(String, nullable=False)
    ha_llegado: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default=false()
    )
    creada_en: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
