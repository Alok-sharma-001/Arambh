from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User, UserStats
from app.auth.router import get_current_user
from app.services.xp_service import XPService

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/me")
def get_my_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        # Should not happen due to registration logic
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)

    return {
        "username": current_user.username,
        "level": stats.current_level,
        "xp": stats.total_xp,
        "intelligence": stats.intelligence_stat,
        "streak": stats.streak_days
    }

@router.post("/award-xp")
def award_xp(amount: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    stats.total_xp += amount

    # Calculate new level
    new_level = XPService.calculate_level(stats.total_xp)
    if new_level > stats.current_level:
        stats.current_level = new_level
        stats.intelligence_stat = XPService.get_intelligence(new_level)

    db.commit()
    db.refresh(stats)
    return {"message": f"Awarded {amount} XP", "current_xp": stats.total_xp, "level": stats.current_level}
