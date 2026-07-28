import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi import Depends
from fastapi.testclient import TestClient

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User, UserStats

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb_qa?mode=memory&cache=shared"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=StaticPool,
    connect_args={"check_same_thread": False, "uri": True}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user(db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == 777).first()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    u = User(id=777, username="qauser", email="qauser@arambh.com", hashed_password="hashedpassword")
    db.add(u)
    db.add(UserStats(user_id=777, total_xp=150, streak_days=3))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_get_active_quests():
    res = client.get("/api/quests/active")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    # Quest q3 (Earn 500 XP) progress should be 150
    q3 = next(q for q in data if q["id"] == "q3")
    assert q3["progress"] == 150
    # Quest q4 (Maintain 3 Day Streak) should be completed
    q4 = next(q for q in data if q["id"] == "q4")
    assert q4["completed"] is True
    assert q4["claimed"] is False

def test_claim_quest_reward():
    # First fetch active quests to populate DB
    client.get("/api/quests/active")
    # Claim q4
    claim_res = client.post("/api/quests/claim", json={"quest_id": "q4"})
    assert claim_res.status_code == 200
    cdata = claim_res.json()
    assert cdata["status"] == "success"
    assert cdata["xp_reward"] == 100
    assert cdata["total_xp"] == 250  # 150 + 100

def test_get_achievements():
    res = client.get("/api/achievements")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    # First Login (a1) & 100 XP Club (a6) should be unlocked
    a1 = next(a for a in data if a["id"] == "a1")
    assert a1["unlocked"] is True
    a6 = next(a for a in data if a["id"] == "a6")
    assert a6["unlocked"] is True
