import asyncio
from fastapi.testclient import TestClient
from app.main import app

def test_startup():
    print("Initializing TestClient (this triggers lifespan)")
    with TestClient(app) as client:
        print("Testing /api/diag/db-status")
        response = client.get("/api/diag/db-status")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        print("Testing POST /api/auth/register")
        register_payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "Test123"
        }
        response = client.post("/api/auth/register", json=register_payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_startup()
