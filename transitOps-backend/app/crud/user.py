from typing import List, Optional

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.password import get_password_hash


def create_user(db: Session, user_in: UserCreate) -> User:
    """Create a new user in the database."""
    db_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Retrieve a user by their unique ID."""
    return db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve a user by their unique email."""
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def get_users(db: Session, skip: int = 0, limit: int = 20) -> List[User]:
    """Retrieve a paginated list of users."""
    return list(db.execute(select(User).offset(skip).limit(limit)).scalars().all())


def count_users(db: Session) -> int:
    """Count all users."""
    return db.execute(select(func.count()).select_from(User)).scalar_one()


def update_user(db: Session, db_user: User, user_in: UserUpdate) -> User:
    """Update a user's details."""
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    for field, value in update_data.items():
        setattr(db_user, field, value)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, db_user: User) -> None:
    """Delete a user from the database."""
    db.delete(db_user)
    db.commit()
