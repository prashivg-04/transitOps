from __future__ import annotations

import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.expense import ExpenseCategory


# ══════════════════════════════════════════════════════════════════════════════
# Base
# ══════════════════════════════════════════════════════════════════════════════
class ExpenseBase(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    category: ExpenseCategory = Field(..., examples=["Toll"])
    amount: float = Field(..., gt=0, description="Expense amount", examples=[250.0])
    remarks: Optional[str] = Field(None, max_length=500, examples=["Nairobi–Mombasa highway"])
    date: datetime.date = Field(..., examples=["2026-07-12"])


# ══════════════════════════════════════════════════════════════════════════════
# Create
# ══════════════════════════════════════════════════════════════════════════════
class ExpenseCreate(ExpenseBase):
    pass


# ══════════════════════════════════════════════════════════════════════════════
# Update  (all optional)
# ══════════════════════════════════════════════════════════════════════════════
class ExpenseUpdate(BaseModel):
    vehicle_id: Optional[int] = Field(None, gt=0)
    category: Optional[ExpenseCategory] = None
    amount: Optional[float] = Field(None, gt=0)
    remarks: Optional[str] = Field(None, max_length=500)
    date: Optional[datetime.date] = None


# ══════════════════════════════════════════════════════════════════════════════
# Read
# ══════════════════════════════════════════════════════════════════════════════
class ExpenseRead(ExpenseBase):
    id: int
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
# Response wrapper
# ══════════════════════════════════════════════════════════════════════════════
class ExpenseResponse(BaseModel):
    data: ExpenseRead
    message: str = "Success"


class ExpenseListResponse(BaseModel):
    data: List[ExpenseRead]
    total: int
    skip: int
    limit: int
    message: str = "Success"
