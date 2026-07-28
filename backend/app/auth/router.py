from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt
from app.database.session import get_db
from app.models.user import User, UserStats
from app.schemas.user import UserCreate, User as UserSchema, Token, TokenData
from app.auth.utils import get_password_hash, verify_password, create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = request.cookies.get("access_token") or request.cookies.get("session")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

from app.core.limiter import limiter

@router.post("/register", response_model=UserSchema)
@limiter.limit("3/minute")
def register(request: Request, response: Response, user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize stats
    stats = UserStats(user_id=new_user.id)
    db.add(stats)
    
    # Log registration event
    from app.models.analytics import AnalyticsEvent
    reg_event = AnalyticsEvent(user_id=new_user.id, event_type="registration")
    db.add(reg_event)
    
    db.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )

    import os
    cookie_secure = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=cookie_secure,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return new_user

failed_login_attempts: dict = {}

def check_account_lockout(username: str):
    record = failed_login_attempts.get(username)
    if not record:
        return
    if record.get("locked_until") and datetime.now(timezone.utc) < record["locked_until"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Account locked due to 5 failed login attempts. Please try again in 15 minutes."
        )

def record_failed_login(username: str):
    now = datetime.now(timezone.utc)
    record = failed_login_attempts.get(username, {"count": 0, "locked_until": None})
    if record.get("locked_until") and now >= record["locked_until"]:
        record = {"count": 0, "locked_until": None}
    record["count"] += 1
    if record["count"] >= 5:
        record["locked_until"] = now + timedelta(minutes=15)
    failed_login_attempts[username] = record

def reset_failed_login(username: str):
    failed_login_attempts.pop(username, None)

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def login(request: Request, response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    check_account_lockout(form_data.username)

    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        record_failed_login(form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    reset_failed_login(form_data.username)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Log login event
    from app.models.analytics import AnalyticsEvent
    login_event = AnalyticsEvent(user_id=user.id, event_type="login")
    db.add(login_event)
    db.commit()

    import os
    cookie_secure = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=cookie_secure,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="session", path="/")
    return {"message": "Logged out successfully"}

from pydantic import BaseModel, EmailStr
from app.models.password_reset import PasswordResetToken
from datetime import datetime, timezone
import logging
logger = logging.getLogger(__name__)

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

class GoogleLoginRequest(BaseModel):
    email: str
    name: str

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.email == req.email) | (User.username == req.email)).first()
    if not user:
        return {"status": "success", "message": "If that account exists, an OTP has been generated."}

    import random
    generated_otp = f"{random.randint(100000, 999999)}"
    hashed_otp = get_password_hash(generated_otp)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    db.query(PasswordResetToken).filter(PasswordResetToken.email == user.email).delete()

    reset_token = PasswordResetToken(
        email=user.email,
        hashed_otp=hashed_otp,
        expires_at=expires_at
    )
    db.add(reset_token)
    db.commit()

    logger.info(f"OTP for {user.email}: {generated_otp}")

    return {
        "status": "success",
        "message": f"Verification OTP generated for {user.email}",
        "otp_demo": generated_otp
    }

@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == req.email,
        PasswordResetToken.expires_at > datetime.now(timezone.utc)
    ).order_by(PasswordResetToken.id.desc()).first()

    if not token_record or not verify_password(req.otp.strip(), token_record.hashed_otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")

    return {"status": "valid"}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == req.email,
        PasswordResetToken.expires_at > datetime.now(timezone.utc)
    ).order_by(PasswordResetToken.id.desc()).first()

    if not token_record or not verify_password(req.otp.strip(), token_record.hashed_otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")

    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(req.new_password)
    db.delete(token_record)
    db.commit()

    return {"status": "success", "message": "Password reset successfully"}

class GoogleAuthRequest(BaseModel):
    id_token: str

@router.post("/google")
@limiter.limit("10/minute")
def google_auth(request: Request, body: GoogleAuthRequest, response: Response, db: Session = Depends(get_db)):
    from app.auth.google import verify_google_token
    idinfo = verify_google_token(body.id_token)

    google_sub = idinfo["sub"]
    email = idinfo["email"]
    name = idinfo.get("name", "")
    picture = idinfo.get("picture", "")

    user = db.query(User).filter((User.google_sub == google_sub) | (User.email == email)).first()
    if not user:
        clean_uname = email.split('@')[0].replace('.', '_')
        existing_uname = db.query(User).filter(User.username == clean_uname).first()
        if existing_uname:
            import random
            clean_uname = f"{clean_uname}_{random.randint(100, 999)}"

        user = User(
            username=clean_uname,
            email=email,
            google_sub=google_sub,
            hashed_password=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        stats = UserStats(user_id=user.id, rank="Novice", title="Google Adventurer")
        db.add(stats)
        db.commit()
    elif not user.google_sub:
        user.google_sub = google_sub
        db.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    import os
    cookie_secure = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=cookie_secure,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": name,
            "avatar_url": picture
        },
        "access_token": token,
        "token_type": "bearer"
    }

