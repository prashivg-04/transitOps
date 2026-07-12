"""
app.models
~~~~~~~~~~
All SQLAlchemy ORM models.

Import every model here so that:
  1. Alembic's env.py can discover them via ``Base.metadata``.
  2. Back-populates between models resolve without circular-import errors.
"""
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle, VehicleStatus, VehicleType
from app.models.driver import Driver, DriverStatus, LicenseCategory
from app.models.trip import Trip, TripStatus
from app.models.maintenance import Maintenance
from app.models.fuel_log import FuelLog
from app.models.expense import Expense, ExpenseCategory

__all__ = [
    # ── User ──
    "User",
    "UserRole",
    # ── Vehicle ──
    "Vehicle",
    "VehicleStatus",
    "VehicleType",
    # ── Driver ──
    "Driver",
    "DriverStatus",
    "LicenseCategory",
    # ── Trip ──
    "Trip",
    "TripStatus",
    # ── Maintenance ──
    "Maintenance",
    # ── Fuel ──
    "FuelLog",
    # ── Expense ──
    "Expense",
    "ExpenseCategory",
]
