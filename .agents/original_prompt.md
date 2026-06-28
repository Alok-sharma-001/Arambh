## 2026-06-28T09:10:39Z

# Teamwork Project Prompt — Draft

Implement Sprint 17 for Arambh, focusing on onboarding, daily reward persistence, and analytics telemetry.

Working directory: `/home/alok/Projects_Antigravity/Arambh/Arambh`
Integrity mode: development

## Requirements

### R1. Onboarding Redirection Flow
- Modify registration redirect to point to `/onboarding`.
- Create a two-step `/onboarding` page:
  - Step 1: Welcome To Arambh Modal/Screen.
  - Step 2: Class Selection (Archetype select: Python Mage, Automation Rogue, Data Warrior).
- On class selection, save selection to backend and auto-redirect to `/lesson/variables-forest/v1`.
- Prevent access to `/dashboard` for un-onboarded users (stats.player_class is empty/null) and redirect them to `/onboarding`.
- Prevent onboarded users from accessing `/onboarding` (redirect to `/dashboard`).

### R2. Daily Login Reward Backend Persistence
- Add `daily_streak`, `last_claimed_at` (DateTime), and `total_login_days` to backend `UserStats` model.
- Implement `/api/progression/claim-daily` endpoint to validate, claim, and persist daily rewards in database.
- Update frontend `DailyLoginRewards.tsx` and `progressionApi.ts` to use backend storage as the source of truth, caching in localStorage.

### R3. Analytics Telemetry
- Log new telemetry events: `lesson_completion_modal_viewed`, `next_lesson_clicked`, `return_to_map_clicked` in frontend `LessonCompletionModal.tsx`.
- Update backend analytics endpoints and `FounderDashboardResponse` to compute counts of these events.
- Display these three new metrics inside the Founder Dashboard analytics tab.

## Acceptance Criteria

### Onboarding Flow
- [ ] Registered user lands on Onboarding flow instead of Dashboard.
- [ ] Selecting class redirects user to `/lesson/variables-forest/v1`.
- [ ] Direct navigation to `/dashboard` redirects to `/onboarding` if class is not set.

### Daily Rewards
- [ ] Claiming daily reward updates XP on the backend.
- [ ] Database persists `daily_streak`, `last_claimed_at`, and `total_login_days`.
- [ ] User cannot claim reward twice within 21 hours.

### Telemetry & Testing
- [ ] Telemetry events `lesson_completion_modal_viewed`, `next_lesson_clicked`, and `return_to_map_clicked` are logged and shown on Founder Dashboard.
- [ ] Backend test suite passes: `venv/bin/pytest`
- [ ] Frontend builds successfully: `npm run build`
