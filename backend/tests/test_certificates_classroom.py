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

SQLALCHEMY_DATABASE_URL = "sqlite:///file:testdb_cc?mode=memory&cache=shared"
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
    return db.query(User).filter(User.id == 666).first()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    u = User(id=666, username="certteacher", email="teacher@arambh.com", hashed_password="hashedpassword")
    db.add(u)
    db.add(UserStats(user_id=666, total_xp=500))
    from app.models.progression import RegionProgress
    db.add(RegionProgress(user_id=666, region_id="variables-forest", status="completed", boss_defeated=True))
    db.commit()
    db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    yield
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

def test_generate_and_verify_certificate():
    gen_res = client.post("/api/certificates/generate")
    assert gen_res.status_code == 200
    gdata = gen_res.json()
    assert "certificate_id" in gdata
    assert gdata["username"] == "certteacher"
    assert gdata["verified"] is True

    cert_id = gdata["certificate_id"]
    verify_res = client.get(f"/api/certificates/verify/{cert_id}")
    assert verify_res.status_code == 200
    vdata = verify_res.json()
    assert vdata["certificate_id"] == cert_id
    assert vdata["username"] == "certteacher"

def test_create_and_fetch_classroom():
    create_res = client.post("/api/classroom/create", json={"name": "CS101 Python Warriors"})
    assert create_res.status_code == 200
    cdata = create_res.json()
    assert cdata["name"] == "CS101 Python Warriors"
    assert cdata["is_teacher"] is True
    assert "join_code" in cdata

    my_classes_res = client.get("/api/classroom/my-class")
    assert my_classes_res.status_code == 200
    classes = my_classes_res.json()
    assert len(classes) >= 1
    assert classes[0]["name"] == "CS101 Python Warriors"
