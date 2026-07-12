from typing import List, Optional

from sqlalchemy import select, or_, asc, desc, func
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


def create_vehicle(db: Session, vehicle_in: VehicleCreate) -> Vehicle:
    """Create a new vehicle in the registry."""
    db_vehicle = Vehicle(**vehicle_in.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


def get_vehicle(db: Session, vehicle_id: int) -> Optional[Vehicle]:
    """Retrieve a vehicle by its unique ID."""
    return db.execute(select(Vehicle).where(Vehicle.id == vehicle_id)).scalar_one_or_none()


def get_vehicle_by_registration(db: Session, registration_number: str) -> Optional[Vehicle]:
    """Retrieve a vehicle by its unique registration number."""
    return db.execute(select(Vehicle).where(Vehicle.registration_number == registration_number)).scalar_one_or_none()


def get_all_vehicles(db: Session, skip: int = 0, limit: int = 20, search: Optional[str] = None) -> List[Vehicle]:
    """Retrieve a paginated, optionally searchable list of all vehicles."""
    stmt = select(Vehicle)
    if search:
        stmt = stmt.where(
            or_(
                Vehicle.registration_number.ilike(f"%{search}%"),
                Vehicle.vehicle_name.ilike(f"%{search}%")
            )
        )
    stmt = stmt.order_by(asc(Vehicle.id)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def count_all_vehicles(db: Session, search: Optional[str] = None) -> int:
    """Count all vehicles, optionally filtered by search term."""
    stmt = select(func.count()).select_from(Vehicle)
    if search:
        stmt = stmt.where(
            or_(
                Vehicle.registration_number.ilike(f"%{search}%"),
                Vehicle.vehicle_name.ilike(f"%{search}%")
            )
        )
    return db.execute(stmt).scalar_one()


def count_available_vehicles(db: Session) -> int:
    """Count vehicles with AVAILABLE status."""
    return db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.status == VehicleStatus.AVAILABLE)).scalar_one()


def count_vehicles_by_status(db: Session, status: VehicleStatus) -> int:
    """Count vehicles by a given status."""
    return db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.status == status)).scalar_one()


def get_available_vehicles(db: Session, skip: int = 0, limit: int = 20) -> List[Vehicle]:
    """Retrieve all vehicles with status AVAILABLE."""
    stmt = select(Vehicle).where(Vehicle.status == VehicleStatus.AVAILABLE).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def get_vehicles_by_status(db: Session, status: VehicleStatus, skip: int = 0, limit: int = 20) -> List[Vehicle]:
    """Retrieve vehicles filtered by a specific status."""
    stmt = select(Vehicle).where(Vehicle.status == status).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def update_vehicle(db: Session, db_vehicle: Vehicle, vehicle_in: VehicleUpdate) -> Vehicle:
    """Update vehicle fields."""
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vehicle, field, value)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


def delete_vehicle(db: Session, db_vehicle: Vehicle) -> None:
    """Delete a vehicle from the database."""
    db.delete(db_vehicle)
    db.commit()
