# TASKS

## Phase 1: MVP - COMPLETE ✅

### Milestone 1: Project Initialization & Infrastructure
- [x] Initialize Backend (FastAPI, SQLAlchemy, Pydantic)
- [x] Initialize Frontend (Vite, React, TypeScript, Tailwind)
- [x] Setup Docker Compose (PostgreSQL, Backend, Frontend)
- [x] Configure Environment Variables

### Milestone 2: Database & Authentication
- [x] Implement Database Models (User, UserStats, ChallengeProgress, SpacedRepetition)
- [x] Setup Alembic Migrations
- [x] Implement JWT Authentication Backend (Refined with Current User Dependency)
- [x] Implement Register/Login/Profile Endpoints
- [x] Frontend: Auth Pages and Services

### Milestone 3: XP System & Dashboard
- [x] Implement XP and Level Logic in Backend (Tested & Verified)
- [x] Implement Progress API Endpoints (Me & Award-XP)
- [x] Frontend: Dashboard UI with Player HUD (XP, Level, Intelligence)
- [x] Frontend: Progress Integration

### Milestone 4: Learning Interface (Split-Screen)
- [x] Implement Split-Screen Layout
- [x] Integrate Monaco Editor
- [x] Implement Basic Python Execution API (Mock UI Integration)
- [x] Implement "Variables & Memory" Visual Module (Animation Ready)

### Milestone 5: Finalization & Testing
- [x] End-to-End Integration (Signup -> Login -> Level Up flow verified)
- [x] Basic Unit and Integration Tests (4/4 Passed)
- [x] Documentation Cleanup

## Sprint 17: User Onboarding, Daily Rewards & Telemetry - COMPLETE ✅
- [x] Redirect new users to `/onboarding` instead of `/dashboard` upon registration
- [x] Implement Welcome To Arambh screen & Character Archetype Class selection on Onboarding page
- [x] Protect Dashboard and other screens with Onboarding completion check
- [x] Persist Daily Login Rewards to backend using new database fields (`daily_streak`, `last_claimed_at`, `total_login_days`)
- [x] Implement `POST /api/progression/claim-daily` endpoint with 21h claim rule and streak logic
- [x] Update frontend `DailyLoginRewards` component to read/write daily rewards to the backend
- [x] Track telemetry events `lesson_completion_modal_viewed`, `next_lesson_clicked`, `return_to_map_clicked`
- [x] Expose telemetry event counts inside Founder Dashboard analytics page
- [x] Run full verification test suite (`pytest`) and frontend production build (`npm run build`)

## Sprint 18: Real User Validation System - COMPLETE ✅
- [x] Implement global session telemetry (`session_started`, `session_ended`, session durations)
- [x] Create `BetaFeedback` and `ExitSurveyResponse` database schemas and POST endpoints
- [x] Create `/beta-feedback` page allowing users to submit bug/feature feedback
- [x] Render `ExitSurveyModal` to log dropoff reasons when exiting the first lesson before completion
- [x] Upgrade Founder Dashboard with retention curves (D1, D3, D7), activation rates, and engagement cards
- [x] Build Dropoff detection summaries and Friction report hotspots inside Founder Dashboard
- [x] Design chronological User Journey timelines in Founder Dashboard
- [x] Pass new integration test suite (`tests/test_validation_system.py`) and frontend compilation checks
