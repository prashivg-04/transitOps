from typing import List, Optional

from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session

from app.models.fuel_log import FuelLog
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate


def create_fuel_log(db: Session, fuel_log_in: FuelLogCreate) -> FuelLog:
    """Create a new fuel log."""
    db_fuel_log = FuelLog(**fuel_log_in.model_dump())
    db.add(db_fuel_log)
    db.commit()
    db.refresh(db_fuel_log)
    return db_fuel_log


def get_all_fuel_logs(db: Session, skip: int = 0, limit: int = 20) -> List[FuelLog]:
    """Retrieve a paginated list of all fuel logs."""
    stmt = select(FuelLog).order_by(desc(FuelLog.date)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def count_all_fuel_logs(db: Session) -> int:
    """Count all fuel logs."""
    return db.execute(select(func.count()).select_from(FuelLog)).scalar_one()


def get_fuel_logs_by_vehicle(db: Session, vehicle_id: int, skip: int = 0, limit: int = 20) -> List[FuelLog]:
    """Retrieve fuel logs for a specific vehicle."""
    stmt = select(FuelLog).where(FuelLog.vehicle_id == vehicle_id).order_by(desc(FuelLog.date)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def get_fuel_logs_by_trip(db: Session, trip_id: int, skip: int = 0, limit: int = 20) -> List[FuelLog]:
    """Retrieve fuel logs for a specific trip."""
    stmt = select(FuelLog).where(FuelLog.trip_id == trip_id).order_by(desc(FuelLog.date)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def update_fuel_log(db: Session, db_fuel_log: FuelLog, fuel_log_in: FuelLogUpdate) -> FuelLog:
    """Update a fuel log."""
    update_data = fuel_log_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_fuel_log, field, value)
    db.add(db_fuel_log)
    db.commit()
    db.refresh(db_fuel_log)
    return db_fuel_log


def delete_fuel_log(db: Session, db_fuel_log: FuelLog) -> None:
    """Delete a fuel log."""
    db.delete(db_fuel_log)
    db.commit()
