# Project: Arambh Sprint 17

## Architecture
- Backend (FastAPI, SQLAlchemy, PostgreSQL):
  - Models: `app/models/user.py` (UserStats), `app/models/analytics.py` (AnalyticsEvent)
  - Schemas: `app/schemas/user.py`, `app/schemas/analytics.py`
  - Routes: `app/api/endpoints/progression.py`, `app/api/endpoints/analytics.py`
- Frontend (React, TypeScript, Vite, TailwindCSS, Zustand):
  - Pages: `frontend/src/pages/Register.tsx`, `frontend/src/pages/Dashboard.tsx`, `frontend/src/pages/Onboarding.tsx` (new)
  - Components: `frontend/src/components/dashboard/DailyLoginRewards.tsx`, `frontend/src/components/progression/LessonCompletionModal.tsx`
  - Stores/Services: `frontend/src/store/progressionStore.ts`, `frontend/src/services/progressionApi.ts`, `frontend/src/services/analyticsApi.ts`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Backend Progression & Daily Rewards | Add daily login columns to UserStats model/schema and implement `/api/progression/claim-daily` endpoint | None | PLANNED |
| 2 | Frontend Onboarding Redirection Flow | Create two-step /onboarding page, redirect registration to /onboarding, enforce /dashboard router guard | Milestone 1 | PLANNED |
| 3 | Analytics Telemetry & Dashboard | Log 3 new telemetry events, update backend analytics endpoint to compute counts, show metrics in Founder Dashboard | Milestone 1, 2 | PLANNED |
| 4 | Final E2E Test Pass & Hardening | Run all E2E test tiers (1-4) and execute Tier 5 adversarial coverage hardening | Milestone 1, 2, 3 | PLANNED |

## Interface Contracts
### Daily Rewards endpoint `/api/progression/claim-daily`
- Method: POST
- Response: `ProgressionResponse` (with updated stats and inventory)
- Error states:
  - 400 Bad Request if claimed within 21 hours
  - 401 Unauthorized if token missing/invalid
- Logic:
  - Verify last claim was > 21 hours ago
  - If last claim was > 48 hours ago, reset streak to 1
  - Otherwise, increment streak by 1 (wrapping at 7 or resetting back to 1)
  - Award appropriate XP (Day 1: 25, Day 2: 50, Day 3: 75, Day 4: 100, Day 5: 125, Day 6: 150, Day 7: 250)
  - Increment `total_login_days` by 1
  - Save `last_claimed_at` to current timestamp
  - Update user's XP, level, and rank on the backend.

### Onboarding Selection endpoint `/api/progression/class`
- Already exists, but we verify it receives `{ player_class: string }` and updates `player_class` in `UserStats`.

### Founder Dashboard analytics `/api/analytics/founder-dashboard`
- Response schema: `FounderDashboardResponse`
- Extended fields:
  - `lesson_completion_modal_viewed_count: int`
  - `next_lesson_clicked_count: int`
  - `return_to_map_clicked_count: int`

## Code Layout
- Backend: `/home/alok/Projects_Antigravity/Arambh/Arambh/backend`
- Frontend: `/home/alok/Projects_Antigravity/Arambh/Arambh/frontend`
