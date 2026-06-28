from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User
from app.models.progression import Revision
from app.schemas.sync import RevisionSync

router = APIRouter()

class ReviewSubmission(BaseModel):
    concept_id: str
    quality: int  # 0-5 scale, 0=Blackout, 3=Hard, 4=Good, 5=Perfect

@router.get("/due", response_model=List[RevisionSync])
def get_due_revisions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    # Get revisions where next_review_date is in the past
    due = db.query(Revision).filter(
        Revision.user_id == current_user.id,
        Revision.next_review_date <= now
    ).all()
    
    return due

@router.post("/review", response_model=RevisionSync)
def submit_review(review: ReviewSubmission, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not (0 <= review.quality <= 5):
        raise HTTPException(status_code=400, detail="Quality must be between 0 and 5")

    revision = db.query(Revision).filter(
        Revision.user_id == current_user.id,
        Revision.concept_id == review.concept_id
    ).first()

    if not revision:
        # User is reviewing this for the first time
        revision = Revision(
            user_id=current_user.id,
            concept_id=review.concept_id,
            next_review_date=datetime.now(timezone.utc),
            interval=0,
            ease_factor=2.5,
            repetitions=0
        )
        db.add(revision)

    # SM-2 Algorithm implementation
    if review.quality >= 3:
        if revision.repetitions == 0:
            revision.interval = 1
        elif revision.repetitions == 1:
            revision.interval = 6
        else:
            revision.interval = round(revision.interval * revision.ease_factor)
        revision.repetitions += 1
    else:
        revision.repetitions = 0
        revision.interval = 1

    # Update ease factor
    revision.ease_factor = revision.ease_factor + (0.1 - (5 - review.quality) * (0.08 + (5 - review.quality) * 0.02))
    if revision.ease_factor < 1.3:
        revision.ease_factor = 1.3

    # Set next review date
    now = datetime.now(timezone.utc)
    revision.next_review_date = now + timedelta(days=revision.interval)

    db.commit()
    db.refresh(revision)
    
    # Log memory vault review event
    from app.models.analytics import AnalyticsEvent
    import json
    rev_event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="vault_review",
        details=json.dumps({"concept_id": review.concept_id, "quality": review.quality})
    )
    db.add(rev_event)
    db.commit()
    
    return RevisionSync(
        concept_id=revision.concept_id,
        next_review_date=revision.next_review_date,
        interval=revision.interval,
        ease_factor=revision.ease_factor,
        repetitions=revision.repetitions
    )
