from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserStats(BaseModel):
    current_level: int
    total_xp: int
    intelligence_stat: int
    streak_days: int
    
    # RPG Progression
    player_class: Optional[str] = None
    rank: str = "Novice"
    title: Optional[str] = None

    class Config:
        from_attributes = True

class InventoryItemResponse(BaseModel):
    id: int
    item_id: str
    acquired_at: datetime

    class Config:
        from_attributes = True

class ProgressionResponse(BaseModel):
    stats: UserStats
    inventory: list[InventoryItemResponse]

class ClassSelectionRequest(BaseModel):
    player_class: str

class XPRewardRequest(BaseModel):
    amount: int
    reason: str

class InventoryRewardRequest(BaseModel):
    item_id: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
