import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User, UserStats
from app.models.mentor import MentorConversation, MentorMessage

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

mock_user = User(id=999, username="testmentoruser", email="testmentor@example.com")

def override_get_current_user():
    return mock_user

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.add(User(id=999, username="testmentoruser", email="testmentor@example.com", hashed_password="hashedpassword"))
    db.add(UserStats(user_id=999, current_level=3, total_xp=1500, player_class="Loop Master"))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_create_conversation():
    payload = {
        "concept_id": "recursion",
        "lesson_id": "f4"
    }
    response = client.post("/api/v1/mentor/conversation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["concept_id"] == "recursion"
    assert data["lesson_id"] == "f4"
    assert "id" in data

def test_get_conversation():
    # Pre-populate conversation
    db = TestingSessionLocal()
    conv = MentorConversation(user_id=999, concept_id="variables", lesson_id="v1")
    db.add(conv)
    db.commit()
    conv_id = conv.id
    db.close()

    response = client.get(f"/api/v1/mentor/conversation/{conv_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["concept_id"] == "variables"
    assert data["lesson_id"] == "v1"

def test_chat_message():
    db = TestingSessionLocal()
    conv = MentorConversation(user_id=999, concept_id="recursion", lesson_id="f4")
    db.add(conv)
    db.commit()
    conv_id = conv.id
    db.close()

    chat_payload = {
        "conversation_id": conv_id,
        "message": "Can you explain recursion using an analogy?",
        "code_context": "def recurse():\n    pass"
    }
    response = client.post("/api/v1/mentor/chat", json=chat_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "assistant"
    assert "content" in data
    
    # Check that messages are persisted in DB
    db = TestingSessionLocal()
    messages = db.query(MentorMessage).filter(MentorMessage.conversation_id == conv_id).all()
    assert len(messages) == 2  # One user message, one assistant message
    assert messages[0].role == "user"
    assert messages[0].content == "Can you explain recursion using an analogy?"
    assert messages[0].code_snapshot == "def recurse():\n    pass"
    assert messages[1].role == "assistant"
    db.close()
