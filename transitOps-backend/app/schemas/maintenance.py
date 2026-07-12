from __future__ import annotations

import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, model_validator


# ══════════════════════════════════════════════════════════════════════════════
# Slim nested vehicle (avoids circular import)
# ══════════════════════════════════════════════════════════════════════════════
class VehicleSlim(BaseModel):
    id: int
    registration_number: str
    vehicle_name: str

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class MaintenanceBase(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=255, examples=["Oil Change"])
    description: Optional[str] = Field(None, examples=["Full synthetic oil change – 5000 km interval"])
    cost: float = Field(default=0.0, ge=0, examples=[3500.0])
    start_date: datetime.date = Field(..., examples=["2026-07-12"])
    end_date: Optional[datetime.date] = Field(None, examples=["2026-07-14"])

    @model_validator(mode="after")
    def _end_after_start(self) -> "MaintenanceBase":
        if self.end_date is not None and self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date.")
        return self


# ══════════════════════════════════════════════════════════════════════════════
# Create
# ══════════════════════════════════════════════════════════════════════════════
class MaintenanceCreate(MaintenanceBase):
    active: bool = True


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all optional)
# ══════════════════════════════════════════════════════════════════════════════
class MaintenanceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    cost: Optional[float] = Field(None, ge=0)
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    active: Optional[bool] = None


# ══════════════════════════════════════════════════════════════════════════════
# Read
# ══════════════════════════════════════════════════════════════════════════════
class MaintenanceRead(MaintenanceBase):
    id: int
    active: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime
    vehicle: Optional[VehicleSlim] = None

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Response wrapper
# ══════════════════════════════════════════════════════════════════════════════
class MaintenanceResponse(BaseModel):
    data: MaintenanceRead
    message: str = "Success"


class MaintenanceListResponse(BaseModel):
    data: List[MaintenanceRead]
    total: int
    skip: int
    limit: int
    message: str = "Success"
