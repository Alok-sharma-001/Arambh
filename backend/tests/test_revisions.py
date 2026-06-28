import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from datetime import datetime, timezone, timedelta

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User
from app.models.progression import Revision

# Use an in-memory SQLite database with shared cache and StaticPool to keep connection alive
SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb?mode=memory&cache=shared"
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

# Mock user for authentication
mock_user = User(id=999, username="testreviewuser", email="testreview@example.com")

def override_get_current_user():
    return mock_user

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Setup: Create all tables in the database
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Create the test user
    db.add(User(id=999, username="testreviewuser", email="testreview@example.com", hashed_password="hashedpassword"))
    db.commit()
    db.close()
    
    # Set overrides inside fixture so they don't leak to other tests
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    # Clean up overrides after test
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_get_due_revisions_empty():
    response = client.get("/api/v1/revisions/due")
    assert response.status_code == 200
    assert response.json() == []

def test_submit_review_new_and_due():
    # 1. Submit a review for a brand new concept
    review_payload = {
        "concept_id": "variables_basics",
        "quality": 4 # "Good" review
    }
    response = client.post("/api/v1/revisions/review", json=review_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["concept_id"] == "variables_basics"
    assert data["interval"] == 1 # First interval for quality >= 3 is 1
    assert data["repetitions"] == 1
    assert data["ease_factor"] > 1.3
    
    # 2. Get due revisions (should be empty since next_review_date is 1 day in the future)
    response = client.get("/api/v1/revisions/due")
    assert response.status_code == 200
    assert len(response.json()) == 0

    # 3. Manually update the next_review_date to the past to simulate time passing
    db = TestingSessionLocal()
    revision = db.query(Revision).filter(Revision.concept_id == "variables_basics").first()
    revision.next_review_date = datetime.now(timezone.utc) - timedelta(hours=1)
    db.commit()
    db.close()

    # 4. Now it should show up in due revisions
    response = client.get("/api/v1/revisions/due")
    assert response.status_code == 200
    due_list = response.json()
    assert len(due_list) == 1
    assert due_list[0]["concept_id"] == "variables_basics"

def test_submit_review_quality_invalid():
    # Submit review with invalid quality
    review_payload = {
        "concept_id": "variables_basics",
        "quality": 6
    }
    response = client.post("/api/v1/revisions/review", json=review_payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Quality must be between 0 and 5"
