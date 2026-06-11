from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserStats, InventoryItem
from app.schemas.user import (
    ProgressionResponse, 
    ClassSelectionRequest, 
    XPRewardRequest, 
    InventoryRewardRequest,
    InventoryItemResponse
)

router = APIRouter()

RANKS = [
    (0, "Novice"),
    (5, "Apprentice"),
    (10, "Explorer"),
    (20, "Scholar"),
    (30, "Master"),
    (40, "Grandmaster"),
    (50, "Legend")
]

def calculate_rank(level: int) -> str:
    current_rank = "Novice"
    for rank_level, rank_name in RANKS:
        if level >= rank_level:
            current_rank = rank_name
    return current_rank

@router.get("/me", response_model=ProgressionResponse)
def get_progression(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
        
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )

@router.post("/class", response_model=ProgressionResponse)
def set_player_class(
    request: ClassSelectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
    
    if stats.player_class:
        raise HTTPException(status_code=400, detail="Class is already set.")
        
    stats.player_class = request.player_class
    db.commit()
    db.refresh(stats)
    
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )

@router.post("/xp", response_model=ProgressionResponse)
def add_xp(
    request: XPRewardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = current_user.stats
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        
    stats.total_xp += request.amount
    
    # Calculate level (XP thresholds: Level * 500)
    # Simple calculation: level = floor(sqrt(total_xp / 250)) or similar.
    # Let's use a simpler linear scale: Level N requires N * 500 cumulative XP.
    # Actually, a fixed 500 per level is easier to manage on frontend without heavy math.
    new_level = 1 + (stats.total_xp // 500)
    
    if new_level > stats.current_level:
        stats.current_level = new_level
        stats.rank = calculate_rank(stats.current_level)
        
    db.commit()
    db.refresh(stats)
    
    return ProgressionResponse(
        stats=stats,
        inventory=current_user.inventory
    )

@router.post("/inventory", response_model=ProgressionResponse)
def add_inventory_item(
    request: InventoryRewardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user already has it
    existing = db.query(InventoryItem).filter(
        InventoryItem.user_id == current_user.id,
        InventoryItem.item_id == request.item_id
    ).first()
    
    if not existing:
        new_item = InventoryItem(user_id=current_user.id, item_id=request.item_id)
        db.add(new_item)
        db.commit()
        
    # Refresh user to get updated inventory
    db.refresh(current_user)
    
    return ProgressionResponse(
        stats=current_user.stats,
        inventory=current_user.inventory
    )
