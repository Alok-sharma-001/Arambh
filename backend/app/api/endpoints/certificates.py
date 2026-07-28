import secrets
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User
from app.models.certificate import Certificate

router = APIRouter(prefix="/certificates", tags=["certificates"])

class CertificateResponse(BaseModel):
    certificate_id: str
    username: str
    course_name: str
    issued_at: datetime
    verified: bool

from app.models.progression import RegionProgress

@router.post("/generate", response_model=CertificateResponse)
def generate_certificate(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has completed at least 1 region to be eligible
    completed_regions = db.query(RegionProgress).filter(
        RegionProgress.user_id == current_user.id,
        RegionProgress.status == "completed"
    ).count()

    if completed_regions < 1:
        raise HTTPException(
            status_code=400,
            detail="Complete at least 1 region before claiming your certificate of completion."
        )

    cert = db.query(Certificate).filter(Certificate.user_id == current_user.id).first()
    
    if not cert:
        random_suffix = secrets.token_hex(3).upper()
        cert_id = f"ARM-2026-{random_suffix}"
        cert = Certificate(
            certificate_id=cert_id,
            user_id=current_user.id,
            course_name="Python Warrior — 12 Regions Mastery",
            verified=True
        )
        db.add(cert)
        db.commit()
        db.refresh(cert)

    return CertificateResponse(
        certificate_id=cert.certificate_id,
        username=current_user.username,
        course_name=cert.course_name,
        issued_at=cert.issued_at,
        verified=cert.verified
    )

@router.get("/verify/{certificate_id}", response_model=CertificateResponse)
def verify_certificate(
    certificate_id: str,
    db: Session = Depends(get_db)
):
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found or invalid.")

    user = db.query(User).filter(User.id == cert.user_id).first()
    username = user.username if user else "Python Developer"

    return CertificateResponse(
        certificate_id=cert.certificate_id,
        username=username,
        course_name=cert.course_name,
        issued_at=cert.issued_at,
        verified=cert.verified
    )
