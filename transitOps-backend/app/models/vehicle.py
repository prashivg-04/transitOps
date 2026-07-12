from __future__ import annotations

import enum
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Enum as SAEnum, Float, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base

if TYPE_CHECKING:
    from app.models.trip import Trip
    from app.models.maintenance import Maintenance
    from app.models.fuel_log import FuelLog
    from app.models.expense import Expense


# ── Enums ─────────────────────────────────────────────────────────────────────
class VehicleStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"


class VehicleType(str, enum.Enum):
    TRUCK = "Truck"
    VAN = "Van"
    CAR = "Car"
    MOTORCYCLE = "Motorcycle"
    BUS = "Bus"
    PICKUP = "Pickup"
    TRAILER = "Trailer"


# ── Model ─────────────────────────────────────────────────────────────────────
class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (
        Index("ix_vehicles_registration_number", "registration_number", unique=True),
        Index("ix_vehicles_status", "status"),
        Index("ix_vehicles_type", "vehicle_type"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    registration_number: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
    )
    vehicle_name: Mapped[str] = mapped_column(String(255), nullable=False)
    vehicle_type: Mapped[VehicleType] = mapped_column(
        SAEnum(VehicleType, name="vehicle_type_enum", create_type=True,
               values_callable=lambda e: [m.value for m in e]),
        nullable=False,
    )
    max_load_capacity: Mapped[float] = mapped_column(
        Float, nullable=False, comment="Maximum load in kilograms"
    )
    odometer: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0, server_default="0",
        comment="Odometer reading in kilometers",
    )
    acquisition_cost: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0, server_default="0",
    )
    status: Mapped[VehicleStatus] = mapped_column(
        SAEnum(VehicleStatus, name="vehicle_status_enum", create_type=True,
               values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=VehicleStatus.AVAILABLE,
        server_default=VehicleStatus.AVAILABLE.value,
    )
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ──────────────────────────────────────────────────────────
    trips: Mapped[List["Trip"]] = relationship(
        "Trip", back_populates="vehicle", lazy="select"
    )
    maintenance_logs: Mapped[List["Maintenance"]] = relationship(
        "Maintenance", back_populates="vehicle", lazy="select"
    )
    fuel_logs: Mapped[List["FuelLog"]] = relationship(
        "FuelLog", back_populates="vehicle", lazy="select"
    )
    expenses: Mapped[List["Expense"]] = relationship(
        "Expense", back_populates="vehicle", lazy="select"
    )

    def __repr__(self) -> str:
        return (
            f"<Vehicle id={self.id} reg={self.registration_number!r} "
            f"status={self.status}>"
        )
