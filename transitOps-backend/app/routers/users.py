from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import get_current_user, RoleChecker
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate, UserRead
from app.services import user_service
from app.utils.response import success_response, SuccessResponse
from app.utils.pagination import paginate, PaginatedResponse
from app.crud import user as crud_user

router = APIRouter(prefix="/users", tags=["Users"])
read_role = RoleChecker([UserRole.FLEET_MANAGER, UserRole.DISPATCHER, UserRole.SAFETY_OFFICER, UserRole.FINANCIAL_ANALYST])
write_role = RoleChecker([UserRole.FLEET_MANAGER])



@router.get("", response_model=PaginatedResponse[UserRead], summary="List Users", description="Get paginated list of all users. Admin only.")
def list_users(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    items = user_service.get_users(db, skip=skip, limit=limit)
    total = crud_user.count_users(db)
    return paginate(items=[UserRead.model_validate(u) for u in items], total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=SuccessResponse[UserRead], summary="Get User", description="Get a single user by ID. Admin only.")
def get_user(id: int, db: Session = Depends(get_db), current_user: User = Depends(read_role)):
    user = user_service.get_user(db, id)
    return success_response(data=UserRead.model_validate(user), message="User retrieved successfully")


@router.post("", response_model=SuccessResponse[UserRead], status_code=status.HTTP_201_CREATED, summary="Create User", description="Create a new platform user. Admin only.")
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    user = user_service.create_user(db, user_in)
    return success_response(data=UserRead.model_validate(user), message="User created successfully")


@router.put("/{id}", response_model=SuccessResponse[UserRead], summary="Update User", description="Update user details. Admin only.")
def update_user(id: int, user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    user = user_service.update_user(db, id, user_in)
    return success_response(data=UserRead.model_validate(user), message="User updated successfully")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete User", description="Delete a user. Admin only.")
def delete_user(id: int, db: Session = Depends(get_db), current_user: User = Depends(write_role)):
    user_service.delete_user(db, id)
