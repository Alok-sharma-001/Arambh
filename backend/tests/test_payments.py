import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.database.session import get_db, Base
from app.auth.router import get_current_user
from app.models.user import User
from app.models.subscription import Subscription

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb_payments?mode=memory&cache=shared"
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

mock_user = User(id=888, username="payuser", email="payuser@arambh.com")

def override_get_current_user():
    return mock_user

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.add(User(id=888, username="payuser", email="payuser@arambh.com", hashed_password="hashedpassword"))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_get_initial_subscription_status():
    res = client.get("/api/payments/status")
    assert res.status_code == 200
    data = res.json()
    assert data["plan"] == "free"
    assert data["is_premium"] is False

def test_create_payment_order():
    res = client.post("/api/payments/create-order", json={"plan": "monthly"})
    assert res.status_code == 200
    data = res.json()
    assert "order_id" in data
    assert data["amount"] == 49900
    assert data["currency"] == "INR"

def test_verify_payment_and_activate():
    # 1. Verify payment
    verify_res = client.post("/api/payments/verify", json={
        "razorpay_order_id": "order_test_123",
        "razorpay_payment_id": "pay_test_456",
        "razorpay_signature": "sig_test_789",
        "plan": "monthly"
    })
    assert verify_res.status_code == 200
    vdata = verify_res.json()
    assert vdata["plan"] == "monthly"
    assert vdata["is_premium"] is True
    assert vdata["status"] == "active"

    # 2. Check status now
    status_res = client.get("/api/payments/status")
    assert status_res.status_code == 200
    sdata = status_res.json()
    assert sdata["plan"] == "monthly"
    assert sdata["is_premium"] is True
