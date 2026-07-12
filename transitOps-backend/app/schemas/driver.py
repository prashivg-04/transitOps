from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from app.models.driver import DriverStatus, LicenseCategory


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class DriverBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, examples=["Alex Mwangi"])
    license_number: str = Field(
        ..., min_length=1, max_length=100, examples=["DL-20240001"]
    )
    license_category: LicenseCategory
    license_expiry: date = Field(..., examples=["2026-12-31"])
    contact_number: str = Field(..., max_length=20, examples=["+254712345678"])
    safety_score: float = Field(
        default=100.0, ge=0, le=100, description="Composite safety score 0–100"
    )


# ══════════════════════════════════════════════════════════════════════════════
# Create
# ══════════════════════════════════════════════════════════════════════════════
class DriverCreate(DriverBase):
    status: DriverStatus = DriverStatus.AVAILABLE


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all optional)
# ══════════════════════════════════════════════════════════════════════════════
class DriverUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    license_number: Optional[str] = Field(None, min_length=1, max_length=100)
    license_category: Optional[LicenseCategory] = None
    license_expiry: Optional[date] = None
    contact_number: Optional[str] = Field(None, max_length=20)
    safety_score: Optional[float] = Field(None, ge=0, le=100)
    status: Optional[DriverStatus] = None


# ══════════════════════════════════════════════════════════════════════════════
# Read
# ══════════════════════════════════════════════════════════════════════════════
class DriverRead(DriverBase):
    id: int
    status: DriverStatus
    is_license_expired: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_expiry(cls, driver: object) -> "DriverRead":
        """Build DriverRead and compute the is_license_expired flag."""
        obj = cls.model_validate(driver)
        obj.is_license_expired = driver.license_expiry < date.today()  # type: ignore[attr-defined]
        return obj


# ══════════════════════════════════════════════════════════════════════════════
# Response wrapper
# ══════════════════════════════════════════════════════════════════════════════
class DriverResponse(BaseModel):
    data: DriverRead
    message: str = "Success"


class DriverListResponse(BaseModel):
    data: List[DriverRead]
    total: int
    skip: int
    limit: int
    message: str = "Success"
