from typing import List, Optional

from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session

from app.models.trip import Trip, TripStatus
from app.schemas.trip import TripCreate, TripUpdate


def create_trip(db: Session, trip_in: TripCreate) -> Trip:
    """Create a new trip."""
    db_trip = Trip(**trip_in.model_dump())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


def get_trip(db: Session, trip_id: int) -> Optional[Trip]:
    """Alias for get_trip_by_id."""
    return get_trip_by_id(db, trip_id)


def get_trip_by_id(db: Session, trip_id: int) -> Optional[Trip]:
    """Retrieve a trip by its unique ID."""
    return db.execute(select(Trip).where(Trip.id == trip_id)).scalar_one_or_none()


def get_trips(db: Session, skip: int = 0, limit: int = 20) -> List[Trip]:
    """Retrieve a paginated list of all trips."""
    stmt = select(Trip).order_by(desc(Trip.created_at)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def count_trips(db: Session) -> int:
    """Count all trips."""
    return db.execute(select(func.count()).select_from(Trip)).scalar_one()


def get_trips_by_vehicle(db: Session, vehicle_id: int, skip: int = 0, limit: int = 20) -> List[Trip]:
    """Retrieve trips assigned to a specific vehicle."""
    stmt = select(Trip).where(Trip.vehicle_id == vehicle_id).order_by(desc(Trip.created_at)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def get_trips_by_driver(db: Session, driver_id: int, skip: int = 0, limit: int = 20) -> List[Trip]:
    """Retrieve trips assigned to a specific driver."""
    stmt = select(Trip).where(Trip.driver_id == driver_id).order_by(desc(Trip.created_at)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def get_active_trip(db: Session, vehicle_id: Optional[int] = None, driver_id: Optional[int] = None) -> Optional[Trip]:
    """Retrieve an actively dispatched trip for a vehicle or driver."""
    stmt = select(Trip).where(Trip.status == TripStatus.DISPATCHED)
    if vehicle_id:
        stmt = stmt.where(Trip.vehicle_id == vehicle_id)
    if driver_id:
        stmt = stmt.where(Trip.driver_id == driver_id)
    return db.execute(stmt).scalar_one_or_none()


def update_trip(db: Session, db_trip: Trip, trip_in: TripUpdate) -> Trip:
    """Update trip details."""
    update_data = trip_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_trip, field, value)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


def delete_trip(db: Session, db_trip: Trip) -> None:
    """Delete a trip from the database."""
    db.delete(db_trip)
    db.commit()
