from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.services import report_service
from app.utils.response import success_response, SuccessResponse
from typing import Dict, Any

router = APIRouter(prefix="/reports", tags=["Reports"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.FINANCIAL_ANALYST])


@router.get("/fuel-efficiency", response_model=SuccessResponse[Dict[str, Any]], summary="Fuel Efficiency Report", description="Calculate fuel efficiency for all vehicles.")
def get_fuel_efficiency_report(db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    data = report_service.generate_fuel_efficiency_report(db)
    return success_response(data=data, message="Fuel efficiency report generated")

@router.get("/fleet-utilization", response_model=SuccessResponse[Dict[str, Any]], summary="Fleet Utilization Report", description="Get fleet usage percentage.")
def get_fleet_utilization_report(db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    data = report_service.generate_fleet_utilization_report(db)
    return success_response(data=data, message="Fleet utilization report generated")

@router.get("/vehicle-roi", response_model=SuccessResponse[Dict[str, Any]], summary="Vehicle ROI Report", description="Calculate Return on Investment for a specific vehicle.")
def get_vehicle_roi_report(vehicle_id: int, db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    data = report_service.generate_vehicle_roi_report(db, vehicle_id)
    return success_response(data=data, message="Vehicle ROI report generated")

@router.get("/trip-summary", response_model=SuccessResponse[Dict[str, Any]], summary="Trip Summary Report", description="Get counts of trips by their status.")
def get_trip_summary_report(db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    data = report_service.generate_trip_summary(db)
    return success_response(data=data, message="Trip summary report generated")

@router.get("/driver-summary", response_model=SuccessResponse[Dict[str, Any]], summary="Driver Summary Report", description="Driver analytics (mock implementation for completeness).")
def get_driver_summary_report(db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    return success_response(data={"message": "Driver summary generated (placeholder)"}, message="Driver summary report generated")
