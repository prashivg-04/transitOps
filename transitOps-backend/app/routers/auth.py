from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import verify_password, create_access_token, create_refresh_token, get_current_user
from app.auth.dependencies import oauth2_scheme
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, Token, RefreshTokenRequest
from app.services import user_service
from app.utils.response import success_response, SuccessResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token, summary="Login", description="Authenticate and obtain JWT.")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    from app.crud.user import get_user_by_email
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # We must construct UserRead manually if from_attributes requires it, but FastAPI usually handles it.
    # Return UserRead schema representation
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/register", response_model=SuccessResponse[UserRead], status_code=status.HTTP_201_CREATED, summary="Register", description="Register a new user.")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = user_service.create_user(db, user_in)
    return success_response(data=UserRead.model_validate(user), message="Registration successful")

@router.post("/refresh", response_model=Token, summary="Refresh Token", description="Get a new access token using a refresh token.")
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    from app.auth.security import decode_token
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
    user = user_service.get_user(db, int(user_id))
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=SuccessResponse[UserRead], summary="Current User", description="Get the currently authenticated user's profile.")
def get_me(current_user: User = Depends(get_current_user)):
    return success_response(data=UserRead.model_validate(current_user), message="Profile retrieved successfully")
