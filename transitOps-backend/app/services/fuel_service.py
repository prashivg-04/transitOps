from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import fuel_log as crud_fuel_log
from app.services import vehicle_service
from app.models.fuel_log import FuelLog
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate

from typing import List

def get_all_fuel_logs(db: Session, skip: int = 0, limit: int = 20) -> List[FuelLog]:
    from sqlalchemy import select
    return list(db.execute(select(FuelLog).offset(skip).limit(limit)).scalars().all())

def get_fuel_log(db: Session, fuel_log_id: int) -> FuelLog:
    # A generic get is not in crud explicitly, let's just query or add one.
    # The prompt didn't request a get_fuel_log by id, but we can query it directly here or assume it.
    from sqlalchemy import select
    log = db.execute(select(FuelLog).where(FuelLog.id == fuel_log_id)).scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fuel log not found")
    return log

def create_fuel_log(db: Session, fuel_log_in: FuelLogCreate) -> FuelLog:
    """
    Create a new fuel log.
    Validates that vehicle exists.
    """
    vehicle_service.get_vehicle(db, fuel_log_in.vehicle_id)
    # Trip validation could go here as well
    return crud_fuel_log.create_fuel_log(db, fuel_log_in)

def update_fuel_log(db: Session, fuel_log_id: int, fuel_log_in: FuelLogUpdate) -> FuelLog:
    log = get_fuel_log(db, fuel_log_id)
    return crud_fuel_log.update_fuel_log(db, log, fuel_log_in)

def delete_fuel_log(db: Session, fuel_log_id: int) -> None:
    log = get_fuel_log(db, fuel_log_id)
    crud_fuel_log.delete_fuel_log(db, log)

def calculate_fuel_efficiency(db: Session, vehicle_id: int) -> float:
    """
    Calculate fuel efficiency (km per liter) for a given vehicle.
    Sums up all fuel logs and divides total odometer / actual distance by total liters.
    """
    vehicle = vehicle_service.get_vehicle(db, vehicle_id)
    fuel_logs = crud_fuel_log.get_fuel_logs_by_vehicle(db, vehicle_id, limit=1000)
    
    total_liters = sum(log.liters for log in fuel_logs)
    if total_liters == 0:
        return 0.0
        
    # Simplified calculation based on current odometer. 
    # Real world would calculate distance between fill-ups.
    return round(vehicle.odometer / total_liters, 2)
