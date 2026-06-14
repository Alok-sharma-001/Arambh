from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats, InventoryItem
from app.models.progression import LessonProgress, RegionProgress, AchievementProgress, QuestProgress
from app.schemas.sync import PushPayload, PullResponse, StatsSync, InventorySync, LessonSync, RegionSync, AchievementSync, QuestSync

router = APIRouter()

@router.get("/pull", response_model=PullResponse)
def pull_state(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Gather Stats
    stats = current_user.stats
    stats_sync = None
    if stats:
        stats_sync = StatsSync(
            current_level=stats.current_level,
            total_xp=stats.total_xp,
            intelligence_stat=stats.intelligence_stat,
            streak_days=stats.streak_days,
            player_class=stats.player_class,
            rank=stats.rank,
            title=stats.title
        )
    
    # Gather Inventory
    inventory = [
        InventorySync(item_id=item.item_id, acquired_at=item.acquired_at)
        for item in current_user.inventory
    ]
    
    # Gather Lessons
    lessons = [
        LessonSync(
            lesson_id=l.lesson_id,
            status=l.status,
            completed_at=l.completed_at,
            code_snapshot=l.code_snapshot
        )
        for l in current_user.lessons
    ]
    
    # Gather Regions
    regions = [
        RegionSync(
            region_id=r.region_id,
            status=r.status,
            boss_defeated=r.boss_defeated,
            completed_at=r.completed_at
        )
        for r in current_user.regions
    ]
    
    # Gather Achievements
    achievements = [
        AchievementSync(
            achievement_id=a.achievement_id,
            progress=a.progress,
            completed=a.completed,
            completed_at=a.completed_at
        )
        for a in current_user.achievements
    ]
    
    # Gather Quests
    quests = [
        QuestSync(
            quest_id=q.quest_id,
            progress=q.progress,
            completed=q.completed,
            completed_at=q.completed_at
        )
        for q in current_user.quests
    ]
    
    resp = PullResponse(
        timestamp=datetime.utcnow(),
        stats=stats_sync,
        inventory=inventory,
        lessons=lessons,
        regions=regions,
        achievements=achievements,
        quests=quests,
        knowledge_graph=None,
        tower_progress=None
    )
    
    # Gather Knowledge Graph
    if current_user.knowledge_graph:
        kg = current_user.knowledge_graph
        resp.knowledge_graph = KnowledgeGraphSync(
            variables=kg.variables,
            data_types=kg.data_types,
            loops=kg.loops,
            functions=kg.functions,
            collections=kg.collections,
            oop=kg.oop,
            exceptions=kg.exceptions,
            files=kg.files,
            modules=kg.modules,
            algorithms=kg.algorithms
        )
        
    # Gather Tower Progress
    if current_user.tower_progress:
        tp = current_user.tower_progress
        resp.tower_progress = TowerProgressSync(
            max_floor=tp.max_floor,
            current_floor=tp.current_floor,
            resonance=tp.resonance
        )
        
    return resp

@router.post("/push")
def push_state(payload: PushPayload, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Note: A true robust system would check timestamps. For Sprint 22 MVP, we overwrite.
    
    # Update Stats
    if payload.stats:
        stats = current_user.stats
        if not stats:
            stats = UserStats(user_id=current_user.id)
            db.add(stats)
        stats.current_level = payload.stats.current_level
        stats.total_xp = payload.stats.total_xp
        stats.intelligence_stat = payload.stats.intelligence_stat
        stats.streak_days = payload.stats.streak_days
        stats.player_class = payload.stats.player_class
        stats.rank = payload.stats.rank
        stats.title = payload.stats.title
        
    # Update Inventory (Upsert)
    if payload.inventory is not None:
        existing = {item.item_id: item for item in current_user.inventory}
        for item_data in payload.inventory:
            if item_data.item_id not in existing:
                new_item = InventoryItem(
                    user_id=current_user.id,
                    item_id=item_data.item_id,
                    acquired_at=item_data.acquired_at
                )
                db.add(new_item)
                
    # Update Lessons (Upsert)
    if payload.lessons is not None:
        existing = {l.lesson_id: l for l in current_user.lessons}
        for l_data in payload.lessons:
            if l_data.lesson_id in existing:
                existing[l_data.lesson_id].status = l_data.status
                existing[l_data.lesson_id].completed_at = l_data.completed_at
                existing[l_data.lesson_id].code_snapshot = l_data.code_snapshot
            else:
                new_lesson = LessonProgress(
                    user_id=current_user.id,
                    lesson_id=l_data.lesson_id,
                    status=l_data.status,
                    completed_at=l_data.completed_at,
                    code_snapshot=l_data.code_snapshot
                )
                db.add(new_lesson)
                
    # Update Regions (Upsert)
    if payload.regions is not None:
        existing = {r.region_id: r for r in current_user.regions}
        for r_data in payload.regions:
            if r_data.region_id in existing:
                existing[r_data.region_id].status = r_data.status
                existing[r_data.region_id].boss_defeated = r_data.boss_defeated
                existing[r_data.region_id].completed_at = r_data.completed_at
            else:
                new_region = RegionProgress(
                    user_id=current_user.id,
                    region_id=r_data.region_id,
                    status=r_data.status,
                    boss_defeated=r_data.boss_defeated,
                    completed_at=r_data.completed_at
                )
                db.add(new_region)

    # Update Knowledge Graph
    if payload.knowledge_graph:
        kg = current_user.knowledge_graph
        if not kg:
            from app.models.progression import KnowledgeGraph
            kg = KnowledgeGraph(user_id=current_user.id)
            db.add(kg)
        kg.variables = payload.knowledge_graph.variables
        kg.data_types = payload.knowledge_graph.data_types
        kg.loops = payload.knowledge_graph.loops
        kg.functions = payload.knowledge_graph.functions
        kg.collections = payload.knowledge_graph.collections
        kg.oop = payload.knowledge_graph.oop
        kg.exceptions = payload.knowledge_graph.exceptions
        kg.files = payload.knowledge_graph.files
        kg.modules = payload.knowledge_graph.modules
        kg.algorithms = payload.knowledge_graph.algorithms

    # Update Tower Progress
    if payload.tower_progress:
        tp = current_user.tower_progress
        if not tp:
            from app.models.progression import TowerProgress
            tp = TowerProgress(user_id=current_user.id)
            db.add(tp)
        tp.max_floor = payload.tower_progress.max_floor
        tp.current_floor = payload.tower_progress.current_floor
        tp.resonance = payload.tower_progress.resonance

    db.commit()
    return {"status": "success", "synced_at": datetime.utcnow()}

@router.post("/migrate")
def migrate_local_state(payload: PushPayload, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # In a migration, we just push the whole state. Reusing push_state.
    return push_state(payload, db, current_user)
