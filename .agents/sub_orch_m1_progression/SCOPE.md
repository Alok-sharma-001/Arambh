# Scope: Backend Progression & Daily Rewards

## Architecture
- Backend Models: `backend/app/models/user.py`
  - Modify `UserStats` class to add:
    - `daily_streak` (Integer, default=0, nullable=False)
    - `last_claimed_at` (DateTime, nullable=True)
    - `total_login_days` (Integer, default=0, nullable=False)
- Backend Schemas: `backend/app/schemas/user.py`
  - Update schemas containing `UserStats` fields or representations (such as `UserStatsResponse` or similar) to include the new fields.
- Backend Router: `backend/app/api/endpoints/progression.py`
  - Implement `/api/progression/claim-daily` endpoint (POST) for daily reward claims.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Database Models & Schemas Update | Add fields to `UserStats` model and schema | None | PLANNED |
| 2 | Claim Daily Rewards Endpoint | Implement claim-daily endpoint with streak/XP/time validation | M1 | PLANNED |
| 3 | Backend Unit Tests | Add test suite in `backend/tests/` to verify claim-daily logic, including streak reset/wrap, 21-hour window, XP rewards | M1, M2 | PLANNED |

## Interface Contracts
### Daily Rewards endpoint `/api/progression/claim-daily`
- Method: POST
- Route: `/api/progression/claim-daily`
- Auth: Required (depends on existing current_user dependencies)
- Response: `ProgressionResponse` or equivalent that returns updated stats.
- Error states:
  - 400 Bad Request if claimed within 21 hours.
- XP Rewards:
  - Day 1: 25 XP
  - Day 2: 50 XP
  - Day 3: 75 XP
  - Day 4: 100 XP
  - Day 5: 125 XP
  - Day 6: 150 XP
  - Day 7: 250 XP
- Validation logic:
  - If `last_claimed_at` is None:
    - Streak is 1.
    - Day reward: Day 1 (25 XP).
  - If `last_claimed_at` is set:
    - Time elapsed: `now - last_claimed_at`.
    - If elapsed < 21 hours: raise 400 Bad Request.
    - If elapsed > 48 hours: reset streak to 1.
    - If elapsed >= 21 hours and <= 48 hours:
      - If streak was 7: reset streak to 1 (or wraps to 1). Let's wrap at 7 (so after day 7, next claim is day 1).
      - Otherwise: increment streak by 1.
  - On successful claim:
    - Add XP according to streak day.
    - Increment `total_login_days` by 1.
    - Set `last_claimed_at` to current time.
    - Save changes to database.
    - Return updated user stats.
