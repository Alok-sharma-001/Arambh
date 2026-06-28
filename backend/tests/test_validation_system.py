import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from datetime import datetime, timezone, timedelta

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb_validation?mode=memory&cache=shared"
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

mock_user = User(id=999, username="founder", email="founder@arambh.com")

def override_get_current_user():
    # Retrieve mock founder user
    db_session = TestingSessionLocal()
    u = db_session.query(User).filter(User.id == 999).first()
    db_session.close()
    return u

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.add(User(id=999, username="founder", email="founder@arambh.com", hashed_password="hashedpassword"))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_submit_beta_feedback():
    payload = {
        "feedback_type": "bug",
        "description": "Visual rendering glitched on variables lesson.",
        "context_info": "Firefox 125, MacOS 14"
    }
    response = client.post("/api/analytics/beta-feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["feedback_type"] == "bug"
    assert data["description"] == "Visual rendering glitched on variables lesson."
    assert data["user_id"] == 999
    assert data["username"] == "founder"

def test_submit_exit_survey():
    payload = {
        "reason": "Too difficult",
        "details": "The dynamic typing concept was hard to understand without hints.",
        "context": "first_lesson"
    }
    response = client.post("/api/analytics/exit-survey", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "success"}

def test_founder_dashboard_extended_metrics():
    # Submit some telemetry/feedback so we have data
    client.post("/api/analytics/exit-survey", json={
        "reason": "Confusing",
        "details": "",
        "context": "registration"
    })
    
    response = client.get("/api/analytics/founder-dashboard")
    assert response.status_code == 200
    data = response.json()
    
    # Assert Sprint 18 metrics exist in response
    assert "retention_d1" in data
    assert "retention_d3" in data
    assert "retention_d7" in data
    assert "activation_signup_to_lesson" in data
    assert "activation_lesson_to_completion" in data
    assert "avg_session_length" in data
    assert "dropoffs" in data
    assert "friction_lesson_exit_rates" in data
    assert "friction_quiz_failure_rates" in data
    assert "friction_mentor_prompts" in data
    assert "friction_revisited_concepts" in data
    assert "user_journeys" in data
    
    # Check dropoffs contain registration dropoff
    assert "registered_no_lesson" in data["dropoffs"]
