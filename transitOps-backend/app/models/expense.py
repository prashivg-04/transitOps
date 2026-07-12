from __future__ import annotations

import enum
from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, Enum as SAEnum, Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base

if TYPE_CHECKING:
    from app.models.vehicle import Vehicle


# ── Enum ──────────────────────────────────────────────────────────────────────
class ExpenseCategory(str, enum.Enum):
    TOLL = "Toll"
    MAINTENANCE = "Maintenance"
    REPAIR = "Repair"
    INSURANCE = "Insurance"
    REGISTRATION = "Registration"
    PARKING = "Parking"
    MISCELLANEOUS = "Miscellaneous"


# ── Model ─────────────────────────────────────────────────────────────────────
class Expense(Base):
    __tablename__ = "expenses"
    __table_args__ = (
        Index("ix_expenses_vehicle_id", "vehicle_id"),
        Index("ix_expenses_category", "category"),
        Index("ix_expenses_date", "date"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(
        ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False
    )
    category: Mapped[ExpenseCategory] = mapped_column(
        SAEnum(ExpenseCategory, name="expense_category_enum", create_type=True,
               values_callable=lambda e: [m.value for m in e]),
        nullable=False,
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    remarks: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)

    # ── Timestamps ─────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        nullable=False, server_default=func.now()
    )

    # ── Relationships ──────────────────────────────────────────────────────────
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="expenses")

    def __repr__(self) -> str:
        return (
            f"<Expense id={self.id} vehicle_id={self.vehicle_id} "
            f"category={self.category} amount={self.amount}>"
        )
