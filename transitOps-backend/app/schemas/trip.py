from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.trip import TripStatus


# ══════════════════════════════════════════════════════════════════════════════
# Slim read schemas for nested objects (avoid circular imports)
# ══════════════════════════════════════════════════════════════════════════════
class VehicleSlim(BaseModel):
    id: int
    registration_number: str
    vehicle_name: str

    model_config = {"from_attributes": True}


class DriverSlim(BaseModel):
    id: int
    name: str
    license_number: str

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class TripBase(BaseModel):
    source: str = Field(..., min_length=1, max_length=255, examples=["Nairobi CBD"])
    destination: str = Field(..., min_length=1, max_length=255, examples=["Mombasa Port"])
    vehicle_id: int = Field(..., gt=0)
    driver_id: int = Field(..., gt=0)
    cargo_weight: float = Field(..., ge=0, description="Cargo weight in kilograms")
    planned_distance: float = Field(..., gt=0, description="Expected distance in km")
    notes: Optional[str] = Field(None, max_length=1000)


# ══════════════════════════════════════════════════════════════════════════════
# Create
# ══════════════════════════════════════════════════════════════════════════════
class TripCreate(TripBase):
    revenue: Optional[float] = Field(default=0.0, ge=0)
    start_odometer: Optional[float] = Field(None, ge=0)


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all optional – only Draft trips)
# ══════════════════════════════════════════════════════════════════════════════
class TripUpdate(BaseModel):
    source: Optional[str] = Field(None, min_length=1, max_length=255)
    destination: Optional[str] = Field(None, min_length=1, max_length=255)
    vehicle_id: Optional[int] = Field(None, gt=0)
    driver_id: Optional[int] = Field(None, gt=0)
    cargo_weight: Optional[float] = Field(None, ge=0)
    planned_distance: Optional[float] = Field(None, gt=0)
    revenue: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=1000)


# ══════════════════════════════════════════════════════════════════════════════
# Dispatch payload
# ══════════════════════════════════════════════════════════════════════════════
class TripDispatch(BaseModel):
    """Optional extra data supplied when dispatching a trip."""
    start_odometer: Optional[float] = Field(None, ge=0)


# ══════════════════════════════════════════════════════════════════════════════
# Complete payload
# ══════════════════════════════════════════════════════════════════════════════
class TripComplete(BaseModel):
    end_odometer: Optional[float] = Field(None, ge=0)
    actual_distance: Optional[float] = Field(None, ge=0)
    fuel_consumed: Optional[float] = Field(None, ge=0, description="Litres consumed")
    revenue: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=1000)

    @model_validator(mode="after")
    def _at_least_one(self) -> "TripComplete":
        if all(
            v is None
            for v in (
                self.end_odometer,
                self.actual_distance,
                self.fuel_consumed,
                self.revenue,
                self.notes,
            )
        ):
            raise ValueError(
                "At least one completion field must be provided "
                "(end_odometer, actual_distance, fuel_consumed, revenue, notes)."
            )
        return self


# ══════════════════════════════════════════════════════════════════════════════
# Read
# ══════════════════════════════════════════════════════════════════════════════
class TripRead(TripBase):
    id: int
    status: TripStatus
    actual_distance: Optional[float] = None
    revenue: Optional[float] = None
    fuel_consumed: Optional[float] = None
    start_odometer: Optional[float] = None
    end_odometer: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    dispatched_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    # Nested slim objects
    vehicle: Optional[VehicleSlim] = None
    driver: Optional[DriverSlim] = None

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Response wrapper
# ══════════════════════════════════════════════════════════════════════════════
class TripResponse(BaseModel):
    data: TripRead
    message: str = "Success"


class TripListResponse(BaseModel):
    data: List[TripRead]
    total: int
    skip: int
    limit: int
    message: str = "Success"
