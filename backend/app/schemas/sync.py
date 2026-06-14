from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StatsSync(BaseModel):
    current_level: int
    total_xp: int
    intelligence_stat: int
    streak_days: int
    player_class: Optional[str] = None
    rank: str
    title: Optional[str] = None

class InventorySync(BaseModel):
    item_id: str
    acquired_at: datetime

class LessonSync(BaseModel):
    lesson_id: str
    status: str
    completed_at: Optional[datetime] = None
    code_snapshot: Optional[str] = None

class RegionSync(BaseModel):
    region_id: str
    status: str
    boss_defeated: bool
    completed_at: Optional[datetime] = None

class AchievementSync(BaseModel):
    achievement_id: str
    progress: int
    completed: bool
    completed_at: Optional[datetime] = None

class QuestSync(BaseModel):
    quest_id: str
    progress: int
    completed: bool
    completed_at: Optional[datetime] = None

class KnowledgeGraphSync(BaseModel):
    variables: int
    data_types: int
    loops: int
    functions: int
    collections: int
    oop: int
    exceptions: int
    files: int
    modules: int
    algorithms: int

class TowerProgressSync(BaseModel):
    max_floor: int
    current_floor: int
    resonance: int

class PushPayload(BaseModel):
    timestamp: datetime
    stats: Optional[StatsSync] = None
    inventory: Optional[List[InventorySync]] = None
    lessons: Optional[List[LessonSync]] = None
    regions: Optional[List[RegionSync]] = None
    achievements: Optional[List[AchievementSync]] = None
    quests: Optional[List[QuestSync]] = None
    knowledge_graph: Optional[KnowledgeGraphSync] = None
    tower_progress: Optional[TowerProgressSync] = None

class PullResponse(BaseModel):
    timestamp: datetime
    stats: Optional[StatsSync]
    inventory: List[InventorySync]
    lessons: List[LessonSync]
    regions: List[RegionSync]
    achievements: List[AchievementSync]
    quests: List[QuestSync]
    knowledge_graph: Optional[KnowledgeGraphSync]
    tower_progress: Optional[TowerProgressSync]
