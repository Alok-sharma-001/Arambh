## 2026-06-28T14:43:04+05:30

You are the Progression Milestone Orchestrator (role: orchestrator).
Your working directory is /home/alok/Projects_Antigravity/Arambh/Arambh/.agents/sub_orch_m1_progression.
Your mission is to implement Milestone 1: Backend Progression & Daily Rewards.
1. Read ORIGINAL_REQUEST.md and PROJECT.md.
2. Update the `UserStats` database model (in `backend/app/models/user.py`) and schema (in `backend/app/schemas/user.py`) to add the fields: `daily_streak`, `last_claimed_at` (DateTime), and `total_login_days`.
3. Implement `/api/progression/claim-daily` endpoint inside `backend/app/api/endpoints/progression.py` to validate, claim, and persist daily rewards in database. Ensure:
   - Claiming daily reward updates XP on the backend.
   - User cannot claim reward twice within 21 hours.
   - Database persists `daily_streak`, `last_claimed_at`, and `total_login_days`.
   - Streak resets to 1 if >48 hours since last claim, or increments (wrapping at 7 or resetting back to 1) if 21-48 hours.
4. Set up backend tests and run `venv/bin/pytest` using a Worker to verify the endpoint logic.
5. Coordinate the implementation using the Explorer -> Worker -> Reviewer -> Challenger -> Forensic Auditor iteration loop.
6. Report your completion and hand over findings back to the parent orchestrator at conversation ID 32429f0f-4026-4e3f-8de1-d73762ca6a6d.

Follow the Project Pattern and Workflow Protocol. Start by creating your own BRIEFING.md and progress.md in your working directory. You must delegate file changes and testing to Workers/Reviewers/Auditors.
