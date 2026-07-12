from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import UserRole


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class UserBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255, examples=["Jane Doe"])
    email: EmailStr = Field(..., examples=["jane@transitops.com"])
    role: UserRole = Field(default=UserRole.DISPATCHER)


# ══════════════════════════════════════════════════════════════════════════════
# Create  (password is required on creation)
# ══════════════════════════════════════════════════════════════════════════════
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128, examples=["Password123"])

    @field_validator("password")
    @classmethod
    def _strong_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit.")
        return v


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all fields optional)
# ══════════════════════════════════════════════════════════════════════════════
class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    password: Optional[str] = Field(None, min_length=8, max_length=128)


# ══════════════════════════════════════════════════════════════════════════════
# Read  (returned from API – no password)
# ══════════════════════════════════════════════════════════════════════════════
class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Response wrappers
# ══════════════════════════════════════════════════════════════════════════════
class UserResponse(BaseModel):
    """Envelope used for single-user endpoints."""
    data: UserRead
    message: str = "Success"


# ── Auth helpers ──────────────────────────────────────────────────────────────
class UserLogin(BaseModel):
    email: EmailStr = Field(..., examples=["admin@transitops.com"])
    password: str = Field(..., examples=["Password123"])


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None
