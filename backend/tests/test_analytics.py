import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User
from app.models.analytics import AnalyticsEvent, LessonFeedback, BugReport

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testanalyticsdb?mode=memory&cache=shared"
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

# Start with a normal test user
current_mock_user = User(id=999, username="teststudent", email="student@example.com")

def override_get_current_user():
    return current_mock_user

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed users
    db.add(User(id=999, username="teststudent", email="student@example.com", hashed_password="hashedpassword"))
    db.add(User(id=1000, username="founder", email="founder@example.com", hashed_password="hashedpassword"))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_log_event():
    payload = {
        "event_type": "lesson_start",
        "details": {"region_id": "variables-forest", "lesson_id": "v1"}
    }
    response = client.post("/api/analytics/event", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify DB entry
    db = TestingSessionLocal()
    event = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_type == "lesson_start").first()
    assert event is not None
    assert event.user_id == 999
    db.close()

def test_submit_feedback():
    payload = {
        "region_id": "variables-forest",
        "lesson_id": "v1",
        "helpful": True
    }
    response = client.post("/api/analytics/feedback", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify DB entry
    db = TestingSessionLocal()
    feedback = db.query(LessonFeedback).filter(LessonFeedback.lesson_id == "v1").first()
    assert feedback is not None
    assert feedback.helpful is True
    db.close()

def test_submit_bug_report():
    payload = {
        "category": "bug",
        "description": "Infinite loop running forever on variables forest challenge",
        "context_info": "URL: /challenge"
    }
    response = client.post("/api/analytics/bug-report", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify DB
    db = TestingSessionLocal()
    bug = db.query(BugReport).filter(BugReport.category == "bug").first()
    assert bug is not None
    assert "Infinite loop" in bug.description
    db.close()

def test_founder_dashboard_forbidden_for_student():
    # As student (id=999, teststudent)
    response = client.get("/api/analytics/founder-dashboard")
    assert response.status_code == 403

def test_founder_dashboard_allowed_for_founder():
    global current_mock_user
    # Temporarily switch mock user to founder
    current_mock_user = User(id=1000, username="founder", email="founder@example.com")
    
    response = client.get("/api/analytics/founder-dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "active_users_today" in data
    assert "user_funnel" in data

    # Restore student mock
    current_mock_user = User(id=999, username="teststudent", email="student@example.com")
