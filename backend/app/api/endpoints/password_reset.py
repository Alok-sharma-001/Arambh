from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import random
import logging
from passlib.context import CryptContext

from app.database.session import get_db
from app.models.user import User
from app.models.password_reset import PasswordResetToken

logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        return {"message": "If that email is registered, you will receive an OTP shortly."}
    
    otp = str(random.randint(100000, 999999))
    hashed_otp = pwd_context.hash(otp)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    reset_token = PasswordResetToken(
        email=req.email,
        hashed_otp=hashed_otp,
        expires_at=expires_at
    )
    db.add(reset_token)
    db.commit()
    
    logger.info(f"OTP for {req.email}: {otp}")
    
    return {"message": "If that email is registered, you will receive an OTP shortly."}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")
        
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == req.email,
        PasswordResetToken.expires_at > datetime.now(timezone.utc)
    ).order_by(PasswordResetToken.id.desc()).first()
    
    if not token_record or not pwd_context.verify(req.otp, token_record.hashed_otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    user.hashed_password = pwd_context.hash(req.new_password)
    db.delete(token_record)
    db.commit()
    
    return {"message": "Password reset successful"}
