from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from app.models.vehicle import VehicleStatus, VehicleType


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class VehicleBase(BaseModel):
    registration_number: str = Field(
        ..., min_length=1, max_length=100, examples=["KBC-123A"]
    )
    vehicle_name: str = Field(
        ..., min_length=1, max_length=255, examples=["Toyota Hilux"]
    )
    vehicle_type: VehicleType
    max_load_capacity: float = Field(
        ..., gt=0, description="Maximum cargo load in kilograms", examples=[1000.0]
    )
    odometer: float = Field(
        default=0.0, ge=0, description="Current odometer reading in kilometres"
    )
    acquisition_cost: float = Field(
        default=0.0, ge=0, description="Purchase / acquisition cost"
    )
    region: Optional[str] = Field(None, max_length=100, examples=["North"])


# ══════════════════════════════════════════════════════════════════════════════
# Create
# ══════════════════════════════════════════════════════════════════════════════
class VehicleCreate(VehicleBase):
    status: VehicleStatus = VehicleStatus.AVAILABLE

    @field_validator("registration_number")
    @classmethod
    def _uppercase_reg(cls, v: str) -> str:
        return v.strip().upper()


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all optional)
# ══════════════════════════════════════════════════════════════════════════════
class VehicleUpdate(BaseModel):
    vehicle_name: Optional[str] = Field(None, min_length=1, max_length=255)
    vehicle_type: Optional[VehicleType] = None
    max_load_capacity: Optional[float] = Field(None, gt=0)
    odometer: Optional[float] = Field(None, ge=0)
    acquisition_cost: Optional[float] = Field(None, ge=0)
    status: Optional[VehicleStatus] = None
    region: Optional[str] = Field(None, max_length=100)


# ══════════════════════════════════════════════════════════════════════════════
# Read
# ══════════════════════════════════════════════════════════════════════════════
class VehicleRead(VehicleBase):
    id: int
    status: VehicleStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Response wrapper
# ══════════════════════════════════════════════════════════════════════════════
class VehicleResponse(BaseModel):
    data: VehicleRead
    message: str = "Success"


class VehicleListResponse(BaseModel):
    data: List[VehicleRead]
    total: int
    skip: int
    limit: int
    message: str = "Success"
