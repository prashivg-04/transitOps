from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import user as crud_user
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def get_users(db: Session, skip: int = 0, limit: int = 20) -> List[User]:
    """Retrieve a paginated list of users."""
    return crud_user.get_users(db, skip=skip, limit=limit)

def get_user(db: Session, user_id: int) -> User:
    """Retrieve a user by ID or raise 404."""
    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def create_user(db: Session, user_in: UserCreate) -> User:
    """Create a new user, ensuring email uniqueness."""
    existing_user = crud_user.get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud_user.create_user(db, user_in)

def update_user(db: Session, user_id: int, user_in: UserUpdate) -> User:
    """Update a user's details, checking email conflicts if updated."""
    user = get_user(db, user_id)
    if user_in.email and user_in.email != user.email:
        existing = crud_user.get_user_by_email(db, user_in.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already taken")
    return crud_user.update_user(db, user, user_in)

def delete_user(db: Session, user_id: int) -> None:
    """Delete a user by ID."""
    user = get_user(db, user_id)
    crud_user.delete_user(db, user)
