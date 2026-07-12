from typing import List, Optional

from sqlalchemy import select, or_, asc, func
from sqlalchemy.orm import Session

from app.models.driver import Driver, DriverStatus
from app.schemas.driver import DriverCreate, DriverUpdate


def create_driver(db: Session, driver_in: DriverCreate) -> Driver:
    """Create a new driver profile."""
    db_driver = Driver(**driver_in.model_dump())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver


def get_driver(db: Session, driver_id: int) -> Optional[Driver]:
    """Retrieve a driver by their unique ID."""
    return db.execute(select(Driver).where(Driver.id == driver_id)).scalar_one_or_none()


def get_driver_by_license(db: Session, license_number: str) -> Optional[Driver]:
    """Retrieve a driver by their unique license number."""
    return db.execute(select(Driver).where(Driver.license_number == license_number)).scalar_one_or_none()


def get_available_drivers(db: Session, skip: int = 0, limit: int = 20) -> List[Driver]:
    """Retrieve a paginated list of all drivers with status AVAILABLE."""
    stmt = select(Driver).where(Driver.status == DriverStatus.AVAILABLE).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def count_all_drivers(db: Session) -> int:
    """Count all drivers."""
    return db.execute(select(func.count()).select_from(Driver)).scalar_one()


def count_available_drivers(db: Session) -> int:
    """Count drivers with AVAILABLE status."""
    return db.execute(select(func.count()).select_from(Driver).where(Driver.status == DriverStatus.AVAILABLE)).scalar_one()


def get_drivers_by_status(db: Session, status: DriverStatus, skip: int = 0, limit: int = 20) -> List[Driver]:
    """Retrieve a paginated list of drivers by specific status."""
    stmt = select(Driver).where(Driver.status == status).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def update_driver(db: Session, db_driver: Driver, driver_in: DriverUpdate) -> Driver:
    """Update driver details."""
    update_data = driver_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_driver, field, value)
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver


def delete_driver(db: Session, db_driver: Driver) -> None:
    """Delete a driver from the database."""
    db.delete(db_driver)
    db.commit()
