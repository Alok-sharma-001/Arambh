from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User
from app.models.guild import Guild, GuildMember, GuildProgress
from app.schemas.guild import GuildCreate, GuildResponse, GuildSummary, GuildActionResponse, GuildMemberSchema, GuildProgressSchema

router = APIRouter()

@router.post("/", response_model=GuildActionResponse)
def create_guild(guild_in: GuildCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.guild_membership:
        raise HTTPException(status_code=400, detail="User is already in a guild.")
    
    # In a real system, verify user has rank Master and 1000 XP
    
    existing_guild = db.query(Guild).filter(Guild.name == guild_in.name).first()
    if existing_guild:
        raise HTTPException(status_code=400, detail="Guild name already taken.")
        
    new_guild = Guild(
        name=guild_in.name,
        description=guild_in.description,
        crest_id=guild_in.crest_id
    )
    db.add(new_guild)
    db.flush()
    
    new_member = GuildMember(
        guild_id=new_guild.id,
        user_id=current_user.id,
        role="founder"
    )
    db.add(new_member)
    
    progress = GuildProgress(guild_id=new_guild.id)
    db.add(progress)
    
    db.commit()
    
    return {"status": "success", "detail": "Guild created successfully."}

@router.get("/list", response_model=List[GuildSummary])
def list_guilds(db: Session = Depends(get_db)):
    guilds = db.query(Guild).order_by(Guild.reputation.desc()).limit(50).all()
    result = []
    for g in guilds:
        result.append(GuildSummary(
            id=g.id,
            name=g.name,
            crest_id=g.crest_id,
            level=g.level,
            member_count=len(g.members),
            reputation=g.reputation
        ))
    return result

@router.get("/me", response_model=GuildResponse)
def get_my_guild(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = current_user.guild_membership
    if not membership:
        raise HTTPException(status_code=404, detail="Not in a guild.")
        
    g = membership.guild
    members = []
    for m in g.members:
        u_stats = m.user.stats
        members.append(GuildMemberSchema(
            user_id=m.user_id,
            username=m.user.username,
            role=m.role,
            joined_at=m.joined_at,
            contribution_gxp=m.contribution_gxp,
            level=u_stats.current_level if u_stats else 1,
            rank=u_stats.rank if u_stats else "Novice"
        ))
        
    prog = g.progress
    prog_schema = None
    if prog:
        prog_schema = GuildProgressSchema(
            active_boss_id=prog.active_boss_id,
            boss_health_remaining=prog.boss_health_remaining,
            completed_bosses=prog.completed_bosses or [],
            active_quests=prog.active_quests or []
        )
        
    return GuildResponse(
        id=g.id,
        name=g.name,
        description=g.description,
        crest_id=g.crest_id,
        level=g.level,
        total_gxp=g.total_gxp,
        reputation=g.reputation,
        created_at=g.created_at,
        members=members,
        progress=prog_schema
    )

@router.post("/{guild_id}/join", response_model=GuildActionResponse)
def join_guild(guild_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.guild_membership:
        raise HTTPException(status_code=400, detail="User is already in a guild.")
        
    g = db.query(Guild).filter(Guild.id == guild_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Guild not found.")
        
    if len(g.members) >= 50:
        raise HTTPException(status_code=400, detail="Guild is full.")
        
    new_member = GuildMember(
        guild_id=g.id,
        user_id=current_user.id,
        role="recruit"
    )
    db.add(new_member)
    db.commit()
    
    return {"status": "success", "detail": f"Successfully joined {g.name}."}

@router.post("/leave", response_model=GuildActionResponse)
def leave_guild(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = current_user.guild_membership
    if not membership:
        raise HTTPException(status_code=400, detail="Not in a guild.")
        
    if membership.role == "founder":
        if len(membership.guild.members) > 1:
            raise HTTPException(status_code=400, detail="Founder must transfer leadership before leaving.")
        else:
            db.delete(membership.guild) # Cascades delete everything
    else:
        db.delete(membership)
        
    db.commit()
    return {"status": "success", "detail": "Left guild."}
