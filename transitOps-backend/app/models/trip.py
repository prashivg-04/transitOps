from __future__ import annotations

import enum
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Enum as SAEnum, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base

if TYPE_CHECKING:
    from app.models.vehicle import Vehicle
    from app.models.driver import Driver
    from app.models.fuel_log import FuelLog


# ── Enum ──────────────────────────────────────────────────────────────────────
class TripStatus(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


# ── Model ─────────────────────────────────────────────────────────────────────
class Trip(Base):
    __tablename__ = "trips"
    __table_args__ = (
        Index("ix_trips_status", "status"),
        Index("ix_trips_vehicle_id", "vehicle_id"),
        Index("ix_trips_driver_id", "driver_id"),
        Index("ix_trips_created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)

    # ── Foreign keys ───────────────────────────────────────────────────────────
    vehicle_id: Mapped[int] = mapped_column(
        ForeignKey("vehicles.id", ondelete="RESTRICT"), nullable=False
    )
    driver_id: Mapped[int] = mapped_column(
        ForeignKey("drivers.id", ondelete="RESTRICT"), nullable=False
    )

    # ── Cargo / distance ──────────────────────────────────────────────────────
    cargo_weight: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0, comment="kg"
    )
    planned_distance: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0, comment="km"
    )
    actual_distance: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True, comment="km – filled on completion"
    )

    # ── Financials ────────────────────────────────────────────────────────────
    revenue: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=0.0)
    fuel_consumed: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True, comment="litres – filled on completion"
    )

    # ── Odometer ─────────────────────────────────────────────────────────────
    start_odometer: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    end_odometer: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # ── Lifecycle ────────────────────────────────────────────────────────────
    status: Mapped[TripStatus] = mapped_column(
        SAEnum(TripStatus, name="trip_status_enum", create_type=True,
               values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=TripStatus.DRAFT,
        server_default=TripStatus.DRAFT.value,
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    dispatched_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    # ── Relationships ──────────────────────────────────────────────────────────
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="trips")
    driver: Mapped["Driver"] = relationship("Driver", back_populates="trips")
    fuel_logs: Mapped[List["FuelLog"]] = relationship(
        "FuelLog", back_populates="trip", lazy="select"
    )

    def __repr__(self) -> str:
        return (
            f"<Trip id={self.id} status={self.status} "
            f"{self.source!r}→{self.destination!r}>"
        )
