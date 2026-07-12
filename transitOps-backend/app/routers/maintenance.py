from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
import datetime

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate, MaintenanceRead
from app.services import maintenance_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import maintenance as crud_maintenance

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.FINANCIAL_ANALYST])
write_role = RoleChecker([UserRole.FLEET_MANAGER])



@router.get("", response_model=PaginatedResponse[MaintenanceRead], summary="List Maintenance", description="Get paginated list of all maintenance records.")
def list_maintenance(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    items = maintenance_service.get_all_maintenance(db, skip=skip, limit=limit)
    total = crud_maintenance.count_all_maintenance(db)
    return paginate(items=[MaintenanceRead.model_validate(m) for m in items], total=total, skip=skip, limit=limit)


@router.post("", response_model=SuccessResponse[MaintenanceRead], status_code=status.HTTP_201_CREATED, summary="Create Maintenance", description="Create a new maintenance record and mark vehicle as In Shop.")
def create_maintenance(maintenance_in: MaintenanceCreate, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    maintenance = maintenance_service.create_maintenance(db, maintenance_in)
    return success_response(data=MaintenanceRead.model_validate(maintenance), message="Maintenance record created successfully")


@router.put("/{id}", response_model=SuccessResponse[MaintenanceRead], summary="Update Maintenance", description="Modify an existing maintenance record.")
def update_maintenance(id: int, maintenance_in: MaintenanceUpdate, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    maintenance = maintenance_service.update_maintenance(db, id, maintenance_in)
    return success_response(data=MaintenanceRead.model_validate(maintenance), message="Maintenance record updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Maintenance", description="Remove a maintenance record.")
def delete_maintenance(id: int, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    maintenance_service.delete_maintenance(db, id)


@router.post("/{id}/close", response_model=SuccessResponse[MaintenanceRead], summary="Close Maintenance", description="Close active maintenance and free up the vehicle.")
def close_maintenance(id: int, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    update_data = MaintenanceUpdate(active=False, end_date=datetime.date.today())
    maintenance = maintenance_service.update_maintenance(db, id, update_data)
    return success_response(data=MaintenanceRead.model_validate(maintenance), message="Maintenance closed successfully")
