from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate, FuelLogRead
from app.services import fuel_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import fuel_log as crud_fuel_log

router = APIRouter(prefix="/fuel", tags=["Fuel Logs"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.FINANCIAL_ANALYST])
write_role = RoleChecker([UserRole.FINANCIAL_ANALYST])



@router.get("", response_model=PaginatedResponse[FuelLogRead], summary="List Fuel Logs", description="Get paginated list of all fuel transactions.")
def list_fuel_logs(skip: int = 0, limit: int = 20, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = fuel_service.get_all_fuel_logs(db, skip=skip, limit=limit)
    total = crud_fuel_log.count_all_fuel_logs(db)
    return paginate(items=[FuelLogRead.model_validate(f) for f in items], total=total, skip=skip, limit=limit)


@router.post("", response_model=SuccessResponse[FuelLogRead], status_code=status.HTTP_201_CREATED, summary="Create Fuel Log", description="Record a new fuel fill transaction.")
def create_fuel_log(fuel_in: FuelLogCreate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    fuel_log = fuel_service.create_fuel_log(db, fuel_in)
    return success_response(data=FuelLogRead.model_validate(fuel_log), message="Fuel log created successfully")


@router.put("/{id}", response_model=SuccessResponse[FuelLogRead], summary="Update Fuel Log", description="Update an existing fuel log entry.")
def update_fuel_log(id: int, fuel_in: FuelLogUpdate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    fuel_log = fuel_service.update_fuel_log(db, id, fuel_in)
    return success_response(data=FuelLogRead.model_validate(fuel_log), message="Fuel log updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Fuel Log", description="Remove a fuel log record.")
def delete_fuel_log(id: int, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    fuel_service.delete_fuel_log(db, id)
