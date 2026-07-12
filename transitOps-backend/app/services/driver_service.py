from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import driver as crud_driver
from app.models.driver import Driver, DriverStatus
from app.schemas.driver import DriverCreate, DriverUpdate

from typing import List

def get_all_drivers(db: Session, skip: int = 0, limit: int = 20) -> List[Driver]:
    from sqlalchemy import select
    return list(db.execute(select(Driver).offset(skip).limit(limit)).scalars().all())

def get_available_drivers(db: Session, skip: int = 0, limit: int = 20) -> List[Driver]:
    return crud_driver.get_available_drivers(db, skip=skip, limit=limit)

def get_driver(db: Session, driver_id: int) -> Driver:
    """Retrieve a driver by ID or raise 404."""
    driver = crud_driver.get_driver(db, driver_id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")
    return driver

def create_driver(db: Session, driver_in: DriverCreate) -> Driver:
    """Create a new driver. License number must be unique."""
    existing = crud_driver.get_driver_by_license(db, driver_in.license_number)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Driver with license {driver_in.license_number} already exists"
        )
    return crud_driver.create_driver(db, driver_in)

def update_driver(db: Session, driver_id: int, driver_in: DriverUpdate) -> Driver:
    """Update driver details."""
    driver = get_driver(db, driver_id)
    
    # Cannot change status to suspended if driver is currently on a trip
    if driver_in.status == DriverStatus.SUSPENDED and driver.status == DriverStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot suspend a driver who is currently on a trip"
        )
        
    return crud_driver.update_driver(db, driver, driver_in)

def delete_driver(db: Session, driver_id: int) -> None:
    """Delete a driver by ID."""
    driver = get_driver(db, driver_id)
    if driver.status == DriverStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a driver who is currently on a trip"
        )
    crud_driver.delete_driver(db, driver)
