from typing import List, Optional

from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session

from app.models.maintenance import Maintenance
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate


def create_maintenance(db: Session, maintenance_in: MaintenanceCreate) -> Maintenance:
    """Create a new maintenance record."""
    db_maintenance = Maintenance(**maintenance_in.model_dump())
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    return db_maintenance


def get_maintenance(db: Session, maintenance_id: int) -> Optional[Maintenance]:
    """Retrieve a maintenance record by ID."""
    return db.execute(select(Maintenance).where(Maintenance.id == maintenance_id)).scalar_one_or_none()


def count_all_maintenance(db: Session) -> int:
    """Count all maintenance records."""
    return db.execute(select(func.count()).select_from(Maintenance)).scalar_one()


def get_active_maintenance(db: Session, vehicle_id: int) -> Optional[Maintenance]:
    """Retrieve an active maintenance record for a specific vehicle."""
    return db.execute(
        select(Maintenance)
        .where(Maintenance.vehicle_id == vehicle_id)
        .where(Maintenance.active == True)
    ).scalar_one_or_none()


def update_maintenance(db: Session, db_maintenance: Maintenance, maintenance_in: MaintenanceUpdate) -> Maintenance:
    """Update a maintenance record."""
    update_data = maintenance_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_maintenance, field, value)
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    return db_maintenance


def delete_maintenance(db: Session, db_maintenance: Maintenance) -> None:
    """Delete a maintenance record."""
    db.delete(db_maintenance)
    db.commit()
