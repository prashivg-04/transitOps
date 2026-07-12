from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.services import dashboard_service
from app.utils.response import success_response, SuccessResponse
from typing import Dict, Any

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.DISPATCHER, UserRole.SAFETY_OFFICER, UserRole.FINANCIAL_ANALYST])


@router.get("", response_model=SuccessResponse[Dict[str, Any]], summary="Get Dashboard Stats", description="Retrieve real-time fleet, driver, and trip KPIs.")
def get_dashboard(db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    """
    Returns aggregated dashboard statistics including:
    - Active / Available / In Shop / Retired Vehicles
    - Drivers On Duty / Available
    - Active / Pending Trips
    - Fleet Utilization %
    - Total Operational Costs
    """
    stats = dashboard_service.get_dashboard_stats(db)
    return success_response(data=stats, message="Dashboard statistics retrieved successfully")
