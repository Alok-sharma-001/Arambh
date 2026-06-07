# ARCHITECTURE

## Overview
Arambh follows a clean architecture with a clear separation between the FastAPI backend and the React frontend.

## Backend (app/)
- **api/**: API route definitions and logic.
- **auth/**: JWT authentication utilities and routers.
- **core/**: Global configuration and settings.
- **database/**: Database connection and session management.
- **models/**: SQLAlchemy database models.
- **schemas/**: Pydantic models for data validation.
- **services/**: Business logic (e.g., XP calculation).

## Frontend (src/)
- **components/**: Reusable UI components.
- **pages/**: Page-level components (Dashboard, Arena, etc.).
- **services/**: API interaction layer using Axios.
- **store/**: State management with Zustand.
- **animations/**: Memory and concept visualization logic.

## Data Flow
1. User interacts with the React frontend.
2. Frontend sends requests to FastAPI using Axios (with JWT in headers).
3. Backend validates requests, interacts with PostgreSQL via SQLAlchemy.
4. Backend returns Pydantic-validated JSON responses.
5. Frontend updates state and UI accordingly.
