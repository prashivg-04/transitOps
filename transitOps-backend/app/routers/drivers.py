from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.schemas.driver import DriverCreate, DriverUpdate, DriverRead
from app.services import driver_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import driver as crud_driver

router = APIRouter(prefix="/drivers", tags=["Drivers"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.DISPATCHER, UserRole.SAFETY_OFFICER])
write_role = RoleChecker([UserRole.SAFETY_OFFICER])



@router.get("", response_model=PaginatedResponse[DriverRead], summary="List Drivers", description="Get paginated list of all driver profiles.")
def list_drivers(skip: int = 0, limit: int = 20, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = driver_service.get_all_drivers(db, skip=skip, limit=limit)
    total = crud_driver.count_all_drivers(db)
    return paginate(items=[DriverRead.model_validate(d) for d in items], total=total, skip=skip, limit=limit)


@router.get("/available", response_model=PaginatedResponse[DriverRead], summary="Available Drivers", description="Get paginated list of drivers ready for dispatch.")
def list_available_drivers(skip: int = 0, limit: int = 20, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = driver_service.get_available_drivers(db, skip=skip, limit=limit)
    total = crud_driver.count_available_drivers(db)
    return paginate(items=[DriverRead.model_validate(d) for d in items], total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=SuccessResponse[DriverRead], summary="Get Driver", description="Retrieve a driver profile by ID.")
def get_driver(id: int, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    driver = driver_service.get_driver(db, id)
    return success_response(data=DriverRead.model_validate(driver), message="Driver retrieved successfully")


@router.post("", response_model=SuccessResponse[DriverRead], status_code=status.HTTP_201_CREATED, summary="Create Driver", description="Add a new driver to the fleet.")
def create_driver(driver_in: DriverCreate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    driver = driver_service.create_driver(db, driver_in)
    return success_response(data=DriverRead.model_validate(driver), message="Driver created successfully")


@router.put("/{id}", response_model=SuccessResponse[DriverRead], summary="Update Driver", description="Modify an existing driver profile.")
def update_driver(id: int, driver_in: DriverUpdate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    driver = driver_service.update_driver(db, id, driver_in)
    return success_response(data=DriverRead.model_validate(driver), message="Driver updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Driver", description="Remove a driver from the fleet.")
def delete_driver(id: int, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    driver_service.delete_driver(db, id)
