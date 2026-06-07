from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User, UserStats

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/me")
def get_my_progress(db: Session = Depends(get_db)):
    # Mock user for now until auth dependency is fully wired
    user_stats = db.query(UserStats).first()
    if not user_stats:
        return {"level": 1, "xp": 0, "intelligence": 10, "streak": 0}
    return {
        "level": user_stats.current_level,
        "xp": user_stats.total_xp,
        "intelligence": user_stats.intelligence_stat,
        "streak": user_stats.streak_days
    }
