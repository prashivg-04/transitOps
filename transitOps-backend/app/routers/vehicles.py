from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.models.vehicle import VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleRead
from app.services import vehicle_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import vehicle as crud_vehicle

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.DISPATCHER, UserRole.FINANCIAL_ANALYST])
write_role = RoleChecker([UserRole.FLEET_MANAGER])



@router.get("", response_model=PaginatedResponse[VehicleRead], summary="List Vehicles", description="Get paginated list of all fleet vehicles.")
def list_vehicles(skip: int = 0, limit: int = 20, search: str = None, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = vehicle_service.get_all_vehicles(db, skip=skip, limit=limit, search=search)
    total = crud_vehicle.count_all_vehicles(db, search=search)
    return paginate(items=[VehicleRead.model_validate(v) for v in items], total=total, skip=skip, limit=limit)


@router.get("/available", response_model=PaginatedResponse[VehicleRead], summary="Available Vehicles", description="Get paginated list of vehicles ready for dispatch.")
def list_available_vehicles(skip: int = 0, limit: int = 20, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = vehicle_service.get_available_vehicles(db, skip=skip, limit=limit)
    total = crud_vehicle.count_available_vehicles(db)
    return paginate(items=[VehicleRead.model_validate(v) for v in items], total=total, skip=skip, limit=limit)


@router.get("/status/{status_val}", response_model=PaginatedResponse[VehicleRead], summary="Vehicles By Status", description="Get paginated list of vehicles filtered by status.")
def list_vehicles_by_status(status_val: VehicleStatus, skip: int = 0, limit: int = 20, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = vehicle_service.get_vehicles_by_status(db, status_val, skip=skip, limit=limit)
    total = crud_vehicle.count_vehicles_by_status(db, status_val)
    return paginate(items=[VehicleRead.model_validate(v) for v in items], total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=SuccessResponse[VehicleRead], summary="Get Vehicle", description="Retrieve a vehicle by ID.")
def get_vehicle(id: int, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    vehicle = vehicle_service.get_vehicle(db, id)
    return success_response(data=VehicleRead.model_validate(vehicle), message="Vehicle retrieved successfully")


@router.post("", response_model=SuccessResponse[VehicleRead], status_code=status.HTTP_201_CREATED, summary="Create Vehicle", description="Register a new fleet vehicle.")
def create_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    vehicle = vehicle_service.create_vehicle(db, vehicle_in)
    return success_response(data=VehicleRead.model_validate(vehicle), message="Vehicle registered successfully")


@router.put("/{id}", response_model=SuccessResponse[VehicleRead], summary="Update Vehicle", description="Modify existing vehicle properties.")
def update_vehicle(id: int, vehicle_in: VehicleUpdate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    vehicle = vehicle_service.update_vehicle(db, id, vehicle_in)
    return success_response(data=VehicleRead.model_validate(vehicle), message="Vehicle updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Vehicle", description="Remove a vehicle from the fleet registry.")
def delete_vehicle(id: int, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    vehicle_service.delete_vehicle(db, id)
