from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.core.security import get_current_user
from backend.app.schemas.auth import UserOut, ProfileUpdateRequest

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the authenticated student's full profile."""
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the student's display name."""
    if not payload.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name cannot be empty.",
        )
    current_user.name = payload.name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user
