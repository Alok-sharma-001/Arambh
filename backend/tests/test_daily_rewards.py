import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from datetime import datetime, timezone, timedelta

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User, UserStats

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb_rewards?mode=memory&cache=shared"
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

mock_user = User(id=999, username="testrewardsuser", email="testrewards@example.com")

from sqlalchemy.orm import Session
from app.database.session import get_db
from fastapi import Depends

def override_get_current_user(db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == 999).first()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.add(User(id=999, username="testrewardsuser", email="testrewards@example.com", hashed_password="hashedpassword"))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_claim_daily_success():
    # First claim
    response = client.post("/api/progression/claim-daily")
    assert response.status_code == 200
    data = response.json()
    assert data["stats"]["daily_streak"] == 1
    assert data["stats"]["total_login_days"] == 1
    assert data["stats"]["total_xp"] == 25  # Day 1 reward is 25 XP
    assert data["stats"]["last_claimed_at"] is not None

def test_claim_daily_too_early():
    # First claim
    response = client.post("/api/progression/claim-daily")
    assert response.status_code == 200
    
    # Second claim immediately should fail
    response = client.post("/api/progression/claim-daily")
    assert response.status_code == 400
    assert "Too early to claim" in response.json()["detail"]

def test_claim_daily_streak_increment():
    # First claim
    client.post("/api/progression/claim-daily")
    
    # Manually adjust last_claimed_at to 22 hours ago
    db = TestingSessionLocal()
    stats = db.query(UserStats).filter(UserStats.user_id == 999).first()
    stats.last_claimed_at = datetime.now(timezone.utc) - timedelta(hours=22)
    db.commit()
    db.close()
    
    # Claim second day
    response = client.post("/api/progression/claim-daily")
    assert response.status_code == 200
    data = response.json()
    assert data["stats"]["daily_streak"] == 2
    assert data["stats"]["total_login_days"] == 2
    assert data["stats"]["total_xp"] == 75  # 25 + 50 = 75 XP

def test_claim_daily_streak_reset():
    # First claim
    client.post("/api/progression/claim-daily")
    
    # Manually adjust last_claimed_at to 50 hours ago (streak broken >48 hours)
    db = TestingSessionLocal()
    stats = db.query(UserStats).filter(UserStats.user_id == 999).first()
    stats.last_claimed_at = datetime.now(timezone.utc) - timedelta(hours=50)
    db.commit()
    db.close()
    
    # Claim should reset streak to 1
    response = client.post("/api/progression/claim-daily")
    assert response.status_code == 200
    data = response.json()
    assert data["stats"]["daily_streak"] == 1
    assert data["stats"]["total_login_days"] == 2
