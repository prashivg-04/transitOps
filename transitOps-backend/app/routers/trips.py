from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.schemas.trip import TripCreate, TripUpdate, TripRead, TripDispatch, TripComplete
from app.services import trip_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import trip as crud_trip

router = APIRouter(prefix="/trips", tags=["Trips"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.DISPATCHER, UserRole.SAFETY_OFFICER, UserRole.FINANCIAL_ANALYST])
write_role = RoleChecker([UserRole.DISPATCHER])



@router.get("", response_model=PaginatedResponse[TripRead], summary="List Trips", description="Get paginated list of all trips.")
def list_trips(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    items = trip_service.get_trips(db, skip=skip, limit=limit)
    total = crud_trip.count_trips(db)
    return paginate(items=[TripRead.model_validate(t) for t in items], total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=SuccessResponse[TripRead], summary="Get Trip", description="Retrieve a trip by ID.")
def get_trip(id: int, db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    trip = trip_service.get_trip(db, id)
    return success_response(data=TripRead.model_validate(trip), message="Trip retrieved successfully")


@router.post("", response_model=SuccessResponse[TripRead], status_code=status.HTTP_201_CREATED, summary="Create Trip", description="Create a new trip in Draft state.")
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    trip = trip_service.create_trip(db, trip_in)
    return success_response(data=TripRead.model_validate(trip), message="Trip created successfully")


@router.put("/{id}", response_model=SuccessResponse[TripRead], summary="Update Trip", description="Modify an existing Draft trip.")
def update_trip(id: int, trip_in: TripUpdate, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    trip = trip_service.update_trip(db, id, trip_in)
    return success_response(data=TripRead.model_validate(trip), message="Trip updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Trip", description="Remove a trip record.")
def delete_trip(id: int, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    trip_service.delete_trip(db, id)


@router.post("/{id}/dispatch", response_model=SuccessResponse[TripRead], summary="Dispatch Trip", description="Change trip to Dispatched and mark vehicle/driver as On Trip.")
def dispatch_trip(id: int, dispatch_in: TripDispatch, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    trip = trip_service.dispatch_trip(db, id, dispatch_in)
    return success_response(data=TripRead.model_validate(trip), message="Trip dispatched successfully")


@router.post("/{id}/complete", response_model=SuccessResponse[TripRead], summary="Complete Trip", description="Mark trip as completed and free up vehicle/driver.")
def complete_trip(id: int, complete_in: TripComplete, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    trip = trip_service.complete_trip(db, id, complete_in)
    return success_response(data=TripRead.model_validate(trip), message="Trip completed successfully")


@router.post("/{id}/cancel", response_model=SuccessResponse[TripRead], summary="Cancel Trip", description="Cancel a trip and release associated assets.")
def cancel_trip(id: int, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    trip = trip_service.cancel_trip(db, id)
    return success_response(data=TripRead.model_validate(trip), message="Trip cancelled successfully")
