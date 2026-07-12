from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import vehicle as crud_vehicle
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

from typing import List

def get_all_vehicles(db: Session, skip: int = 0, limit: int = 20, search: str = None) -> List[Vehicle]:
    return crud_vehicle.get_all_vehicles(db, skip=skip, limit=limit, search=search)

def get_available_vehicles(db: Session, skip: int = 0, limit: int = 20) -> List[Vehicle]:
    return crud_vehicle.get_available_vehicles(db, skip=skip, limit=limit)

def get_vehicles_by_status(db: Session, status_val: VehicleStatus, skip: int = 0, limit: int = 20) -> List[Vehicle]:
    return crud_vehicle.get_vehicles_by_status(db, status_val, skip=skip, limit=limit)

def get_vehicle(db: Session, vehicle_id: int) -> Vehicle:
    """Retrieve a vehicle by ID or raise 404."""
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle

def create_vehicle(db: Session, vehicle_in: VehicleCreate) -> Vehicle:
    """Create a new vehicle. Registration number must be unique."""
    existing = crud_vehicle.get_vehicle_by_registration(db, vehicle_in.registration_number)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle with registration number {vehicle_in.registration_number} already exists"
        )
    return crud_vehicle.create_vehicle(db, vehicle_in)

def update_vehicle(db: Session, vehicle_id: int, vehicle_in: VehicleUpdate) -> Vehicle:
    """Update vehicle details, ensuring valid state transitions if status is updated."""
    vehicle = get_vehicle(db, vehicle_id)
    
    # Example logic: Cannot retire a vehicle currently on a trip
    if vehicle_in.status == VehicleStatus.RETIRED and vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot retire a vehicle that is currently on a trip"
        )
    return crud_vehicle.update_vehicle(db, vehicle, vehicle_in)

def delete_vehicle(db: Session, vehicle_id: int) -> None:
    """Delete a vehicle by ID."""
    vehicle = get_vehicle(db, vehicle_id)
    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a vehicle that is currently on a trip"
        )
    crud_vehicle.delete_vehicle(db, vehicle)
