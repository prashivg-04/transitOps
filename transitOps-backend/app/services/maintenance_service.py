from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import maintenance as crud_maintenance
from app.services import vehicle_service
from app.models.maintenance import Maintenance
from app.models.vehicle import VehicleStatus
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate

from typing import List

def get_all_maintenance(db: Session, skip: int = 0, limit: int = 20) -> List[Maintenance]:
    from sqlalchemy import select
    return list(db.execute(select(Maintenance).offset(skip).limit(limit)).scalars().all())

def get_maintenance(db: Session, maintenance_id: int) -> Maintenance:
    """Retrieve a maintenance record by ID."""
    maintenance = crud_maintenance.get_maintenance(db, maintenance_id)
    if not maintenance:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maintenance record not found")
    return maintenance

def create_maintenance(db: Session, maintenance_in: MaintenanceCreate) -> Maintenance:
    """
    Create a new active maintenance record.
    Changes vehicle status to IN_SHOP.
    """
    vehicle = vehicle_service.get_vehicle(db, maintenance_in.vehicle_id)
    
    if vehicle.status == VehicleStatus.ON_TRIP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot put a vehicle in shop while it is on a trip"
        )
        
    active_maintenance = crud_maintenance.get_active_maintenance(db, vehicle.id)
    if active_maintenance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle already has an active maintenance record"
        )

    maintenance = crud_maintenance.create_maintenance(db, maintenance_in)
    
    if maintenance_in.active:
        vehicle.status = VehicleStatus.IN_SHOP
        db.commit()
        db.refresh(maintenance)
        
    return maintenance

def update_maintenance(db: Session, maintenance_id: int, maintenance_in: MaintenanceUpdate) -> Maintenance:
    """
    Update a maintenance record.
    If 'active' changes to False, restores vehicle to AVAILABLE (unless retired).
    """
    maintenance = get_maintenance(db, maintenance_id)
    was_active = maintenance.active
    
    maintenance = crud_maintenance.update_maintenance(db, maintenance, maintenance_in)
    
    if was_active and maintenance_in.active is False:
        vehicle = vehicle_service.get_vehicle(db, maintenance.vehicle_id)
        if vehicle.status != VehicleStatus.RETIRED:
            vehicle.status = VehicleStatus.AVAILABLE
            db.commit()
            
    elif not was_active and maintenance_in.active is True:
        vehicle = vehicle_service.get_vehicle(db, maintenance.vehicle_id)
        if vehicle.status == VehicleStatus.ON_TRIP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot activate maintenance while vehicle is on a trip"
            )
        vehicle.status = VehicleStatus.IN_SHOP
        db.commit()
        
    db.refresh(maintenance)
    return maintenance

def delete_maintenance(db: Session, maintenance_id: int) -> None:
    """Delete a maintenance record."""
    maintenance = get_maintenance(db, maintenance_id)
    crud_maintenance.delete_maintenance(db, maintenance)
