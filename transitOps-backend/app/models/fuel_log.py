from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base

if TYPE_CHECKING:
    from app.models.vehicle import Vehicle
    from app.models.trip import Trip


class FuelLog(Base):
    __tablename__ = "fuel_logs"
    __table_args__ = (
        Index("ix_fuel_logs_vehicle_id", "vehicle_id"),
        Index("ix_fuel_logs_trip_id", "trip_id"),
        Index("ix_fuel_logs_date", "date"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(
        ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False
    )
    trip_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("trips.id", ondelete="SET NULL"), nullable=True
    )
    liters: Mapped[float] = mapped_column(Float, nullable=False)
    cost: Mapped[float] = mapped_column(Float, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    station: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # ── Timestamps ─────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        nullable=False, server_default=func.now()
    )

    # ── Relationships ──────────────────────────────────────────────────────────
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="fuel_logs")
    trip: Mapped[Optional["Trip"]] = relationship("Trip", back_populates="fuel_logs")

    def __repr__(self) -> str:
        return (
            f"<FuelLog id={self.id} vehicle_id={self.vehicle_id} "
            f"liters={self.liters} cost={self.cost}>"
        )
