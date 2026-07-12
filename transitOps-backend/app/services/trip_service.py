from datetime import date, datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import trip as crud_trip
from app.services import vehicle_service, driver_service
from app.models.trip import Trip, TripStatus
from app.models.vehicle import VehicleStatus
from app.models.driver import DriverStatus
from app.schemas.trip import TripCreate, TripUpdate, TripDispatch, TripComplete

from typing import List

def get_trips(db: Session, skip: int = 0, limit: int = 20) -> List[Trip]:
    return crud_trip.get_trips(db, skip=skip, limit=limit)

def get_trip(db: Session, trip_id: int) -> Trip:
    """Retrieve a trip by ID or raise 404."""
    trip = crud_trip.get_trip_by_id(db, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip

def create_trip(db: Session, trip_in: TripCreate) -> Trip:
    """
    Create a new trip in Draft state.
    Validates cargo weight against vehicle capacity.
    """
    vehicle = vehicle_service.get_vehicle(db, trip_in.vehicle_id)
    
    if trip_in.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cargo weight {trip_in.cargo_weight} exceeds vehicle maximum load capacity of {vehicle.max_load_capacity}"
        )
        
    # Driver existence check
    driver_service.get_driver(db, trip_in.driver_id)
    
    return crud_trip.create_trip(db, trip_in)

def update_trip(db: Session, trip_id: int, trip_in: TripUpdate) -> Trip:
    trip = get_trip(db, trip_id)
    return crud_trip.update_trip(db, trip, trip_in)

def delete_trip(db: Session, trip_id: int) -> None:
    trip = get_trip(db, trip_id)
    crud_trip.delete_trip(db, trip)

def dispatch_trip(db: Session, trip_id: int, dispatch_data: TripDispatch) -> Trip:
    """
    Dispatch a trip.
    Validations:
    - Trip must be in Draft state.
    - Vehicle must be Available.
    - Driver must be Available.
    - Driver license must not be expired.
    - Vehicle status -> On Trip
    - Driver status -> On Trip
    """
    trip = get_trip(db, trip_id)
    
    if trip.status != TripStatus.DRAFT:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only Draft trips can be dispatched")
        
    vehicle = vehicle_service.get_vehicle(db, trip.vehicle_id)
    driver = driver_service.get_driver(db, trip.driver_id)
    
    if vehicle.status == VehicleStatus.RETIRED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Retired vehicles cannot be dispatched")
    if vehicle.status == VehicleStatus.IN_SHOP:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicles in shop cannot be dispatched")
    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle is already on a trip")
        
    if driver.status == DriverStatus.SUSPENDED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Suspended drivers cannot be assigned")
    if driver.status == DriverStatus.ON_TRIP:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Driver is already on a trip")
    if driver.license_expiry < date.today():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Driver license is expired")
        
    # State transitions
    trip.status = TripStatus.DISPATCHED
    trip.dispatched_at = datetime.now(timezone.utc)
    if dispatch_data.start_odometer is not None:
        trip.start_odometer = dispatch_data.start_odometer
        
    vehicle.status = VehicleStatus.ON_TRIP
    driver.status = DriverStatus.ON_TRIP
    
    db.commit()
    db.refresh(trip)
    return trip

def complete_trip(db: Session, trip_id: int, complete_data: TripComplete) -> Trip:
    """
    Complete a dispatched trip.
    Updates final odometer, fuel consumed, actual distance.
    Restores Vehicle and Driver to Available.
    """
    trip = get_trip(db, trip_id)
    
    if trip.status != TripStatus.DISPATCHED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only Dispatched trips can be completed")
        
    vehicle = vehicle_service.get_vehicle(db, trip.vehicle_id)
    driver = driver_service.get_driver(db, trip.driver_id)
    
    trip.status = TripStatus.COMPLETED
    trip.completed_at = datetime.now(timezone.utc)
    
    if complete_data.end_odometer is not None:
        trip.end_odometer = complete_data.end_odometer
        vehicle.odometer = complete_data.end_odometer
        if trip.start_odometer is not None:
            trip.actual_distance = complete_data.end_odometer - trip.start_odometer
            
    if complete_data.actual_distance is not None:
        trip.actual_distance = complete_data.actual_distance
        
    if complete_data.fuel_consumed is not None:
        trip.fuel_consumed = complete_data.fuel_consumed
        
    if complete_data.revenue is not None:
        trip.revenue = complete_data.revenue
        
    if complete_data.notes is not None:
        trip.notes = complete_data.notes
        
    vehicle.status = VehicleStatus.AVAILABLE
    driver.status = DriverStatus.AVAILABLE
    
    db.commit()
    db.refresh(trip)
    return trip

def cancel_trip(db: Session, trip_id: int) -> Trip:
    """
    Cancel a trip.
    If it was dispatched, restore vehicle and driver to Available.
    """
    trip = get_trip(db, trip_id)
    
    if trip.status == TripStatus.COMPLETED or trip.status == TripStatus.CANCELLED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot cancel a {trip.status.value} trip")
        
    was_dispatched = (trip.status == TripStatus.DISPATCHED)
    trip.status = TripStatus.CANCELLED
    
    if was_dispatched:
        vehicle = vehicle_service.get_vehicle(db, trip.vehicle_id)
        driver = driver_service.get_driver(db, trip.driver_id)
        vehicle.status = VehicleStatus.AVAILABLE
        driver.status = DriverStatus.AVAILABLE
        
    db.commit()
    db.refresh(trip)
    return trip
