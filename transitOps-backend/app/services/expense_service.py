from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import expense as crud_expense
from app.services import vehicle_service
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

from typing import List

def get_all_expenses(db: Session, skip: int = 0, limit: int = 20) -> List[Expense]:
    from sqlalchemy import select
    return list(db.execute(select(Expense).offset(skip).limit(limit)).scalars().all())

def get_expense(db: Session, expense_id: int) -> Expense:
    """Retrieve an expense record by ID."""
    expense = crud_expense.get_expense(db, expense_id)
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found")
    return expense

def create_expense(db: Session, expense_in: ExpenseCreate) -> Expense:
    """
    Create a new expense record.
    """
    vehicle_service.get_vehicle(db, expense_in.vehicle_id)
    return crud_expense.create_expense(db, expense_in)

def update_expense(db: Session, expense_id: int, expense_in: ExpenseUpdate) -> Expense:
    """Update an expense record."""
    expense = get_expense(db, expense_id)
    return crud_expense.update_expense(db, expense, expense_in)

def delete_expense(db: Session, expense_id: int) -> None:
    """Delete an expense record."""
    expense = get_expense(db, expense_id)
    crud_expense.delete_expense(db, expense)

def calculate_operational_cost(db: Session, vehicle_id: int) -> float:
    """
    Calculate total operational cost for a vehicle (expenses + fuel + maintenance).
    """
    # Sum of expenses
    expenses = crud_expense.get_vehicle_expenses(db, vehicle_id, limit=1000)
    total_expense = sum(e.amount for e in expenses)
    
    # Fuel logs
    from app.crud.fuel_log import get_fuel_logs_by_vehicle
    fuel_logs = get_fuel_logs_by_vehicle(db, vehicle_id, limit=1000)
    total_fuel = sum(f.cost for f in fuel_logs)
    
    # Maintenance
    from sqlalchemy import select
    from app.models.maintenance import Maintenance
    maintenances = db.execute(select(Maintenance).where(Maintenance.vehicle_id == vehicle_id)).scalars().all()
    total_maintenance = sum(m.cost for m in maintenances)
    
    return round(total_expense + total_fuel + total_maintenance, 2)
