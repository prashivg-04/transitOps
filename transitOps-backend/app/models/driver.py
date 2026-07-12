from __future__ import annotations

import enum
from datetime import date, datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Date, Enum as SAEnum, Float, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base

if TYPE_CHECKING:
    from app.models.trip import Trip


# ── Enums ─────────────────────────────────────────────────────────────────────
class DriverStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"


class LicenseCategory(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"
    F = "F"


# ── Model ─────────────────────────────────────────────────────────────────────
class Driver(Base):
    __tablename__ = "drivers"
    __table_args__ = (
        Index("ix_drivers_license_number", "license_number", unique=True),
        Index("ix_drivers_status", "status"),
        Index("ix_drivers_license_expiry", "license_expiry"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    license_number: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
    )
    license_category: Mapped[LicenseCategory] = mapped_column(
        SAEnum(LicenseCategory, name="license_category_enum", create_type=True,
               values_callable=lambda e: [m.value for m in e]),
        nullable=False,
    )
    license_expiry: Mapped[date] = mapped_column(Date, nullable=False)
    contact_number: Mapped[str] = mapped_column(String(20), nullable=False)
    safety_score: Mapped[float] = mapped_column(
        Float, nullable=False, default=100.0, server_default="100",
        comment="0–100 composite score",
    )
    status: Mapped[DriverStatus] = mapped_column(
        SAEnum(DriverStatus, name="driver_status_enum", create_type=True,
               values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=DriverStatus.AVAILABLE,
        server_default=DriverStatus.AVAILABLE.value,
    )
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
        "Trip", back_populates="driver", lazy="select"
    )

    def __repr__(self) -> str:
        return (
            f"<Driver id={self.id} name={self.name!r} status={self.status}>"
        )
