from typing import List, Optional

from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def create_expense(db: Session, expense_in: ExpenseCreate) -> Expense:
    """Create a new expense record."""
    db_expense = Expense(**expense_in.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def get_all_expenses(db: Session, skip: int = 0, limit: int = 20) -> List[Expense]:
    """Retrieve a paginated list of all expenses."""
    stmt = select(Expense).order_by(desc(Expense.date)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def count_all_expenses(db: Session) -> int:
    """Count all expense records."""
    return db.execute(select(func.count()).select_from(Expense)).scalar_one()


def get_expense(db: Session, expense_id: int) -> Optional[Expense]:
    """Retrieve an expense record by ID."""
    return db.execute(select(Expense).where(Expense.id == expense_id)).scalar_one_or_none()


def get_vehicle_expenses(db: Session, vehicle_id: int, skip: int = 0, limit: int = 20) -> List[Expense]:
    """Retrieve expenses associated with a specific vehicle."""
    stmt = select(Expense).where(Expense.vehicle_id == vehicle_id).order_by(desc(Expense.date)).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def update_expense(db: Session, db_expense: Expense, expense_in: ExpenseUpdate) -> Expense:
    """Update an expense record."""
    update_data = expense_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, db_expense: Expense) -> None:
    """Delete an expense record."""
    db.delete(db_expense)
    db.commit()
