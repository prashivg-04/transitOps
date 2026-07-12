from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import RoleChecker
from app.models.user import User, UserRole
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseRead
from app.services import expense_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import expense as crud_expense

router = APIRouter(prefix="/expenses", tags=["Expenses"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.FINANCIAL_ANALYST])
write_role = RoleChecker([UserRole.FINANCIAL_ANALYST])



@router.get("", response_model=PaginatedResponse[ExpenseRead], summary="List Expenses", description="Get paginated list of all expenses.")
def list_expenses(skip: int = 0, limit: int = 20, db: Session = Depends(read_role), current_user: User = Depends(read_role)):
    items = expense_service.get_all_expenses(db, skip=skip, limit=limit)
    total = crud_expense.count_all_expenses(db)
    return paginate(items=[ExpenseRead.model_validate(e) for e in items], total=total, skip=skip, limit=limit)


@router.post("", response_model=SuccessResponse[ExpenseRead], status_code=status.HTTP_201_CREATED, summary="Create Expense", description="Record a new operational expense.")
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    expense = expense_service.create_expense(db, expense_in)
    return success_response(data=ExpenseRead.model_validate(expense), message="Expense recorded successfully")


@router.put("/{id}", response_model=SuccessResponse[ExpenseRead], summary="Update Expense", description="Modify an existing expense record.")
def update_expense(id: int, expense_in: ExpenseUpdate, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    expense = expense_service.update_expense(db, id, expense_in)
    return success_response(data=ExpenseRead.model_validate(expense), message="Expense updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Expense", description="Remove an expense record.")
def delete_expense(id: int, db: Session = Depends(write_role), current_user: User = Depends(write_role)):
    expense_service.delete_expense(db, id)
