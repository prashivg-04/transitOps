from __future__ import annotations

import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class FuelLogBase(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    trip_id: Optional[int] = Field(None, gt=0, description="Optional trip reference")
    liters: float = Field(..., gt=0, description="Fuel filled in litres", examples=[45.5])
    cost: float = Field(..., gt=0, description="Total cost for the fill", examples=[7280.0])
    date: datetime.date = Field(..., examples=["2026-07-12"])
    station: Optional[str] = Field(None, max_length=255, examples=["Shell Westlands"])
    notes: Optional[str] = Field(None, max_length=500)


# ══════════════════════════════════════════════════════════════════════════════
# Create
# ══════════════════════════════════════════════════════════════════════════════
class FuelLogCreate(FuelLogBase):
    pass


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all optional)
# ══════════════════════════════════════════════════════════════════════════════
class FuelLogUpdate(BaseModel):
    vehicle_id: Optional[int] = Field(None, gt=0)
    trip_id: Optional[int] = Field(None, gt=0)
    liters: Optional[float] = Field(None, gt=0)
    cost: Optional[float] = Field(None, gt=0)
    date: Optional[datetime.date] = None
    station: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = Field(None, max_length=500)


# ══════════════════════════════════════════════════════════════════════════════
# Read
# ══════════════════════════════════════════════════════════════════════════════
class FuelLogRead(FuelLogBase):
    id: int
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Response wrapper
# ══════════════════════════════════════════════════════════════════════════════
class FuelLogResponse(BaseModel):
    data: FuelLogRead
    message: str = "Success"


class FuelLogListResponse(BaseModel):
    data: List[FuelLogRead]
    total: int
    skip: int
    limit: int
    message: str = "Success"
