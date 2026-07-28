import pytest
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.main import app as fastapi_app
from app.database.session import get_db, Base
from app.models.user import User
import app.auth.google

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb_google?mode=memory&cache=shared"
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

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    fastapi_app.dependency_overrides[get_db] = override_get_db
    yield
    fastapi_app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

client = TestClient(fastapi_app)

def test_google_login_creates_new_user():
    fake_idinfo = {
        "email": "google_test_user@example.com",
        "email_verified": True,
        "name": "Google Test User",
        "sub": "google_sub_123456789",
        "picture": "https://example.com/photo.jpg",
    }
    
    with patch("app.auth.google.verify_google_token", return_value=fake_idinfo):
        response = client.post("/api/auth/google", json={"id_token": "fake-valid-google-id-token"})

    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "google_test_user@example.com"
    assert "access_token" in response.cookies

    # Verify database persistence
    db = TestingSessionLocal()
    user = db.query(User).filter(User.google_sub == "google_sub_123456789").first()
    assert user is not None
    assert user.email == "google_test_user@example.com"
    assert user.hashed_password is None
    db.close()

def test_google_login_unverified_email_rejection():
    with patch("app.auth.google.verify_google_token", side_effect=HTTPException(status_code=401, detail="Email not verified by Google")):
        response = client.post("/api/auth/google", json={"id_token": "fake-invalid-token"})

    assert response.status_code == 401
