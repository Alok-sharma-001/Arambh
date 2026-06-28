# CHANGELOG

## [1.2.0] - 2026-06-28
### Added
- Implemented global session analytics tracking (duration stats, page duration logs, active timers on unload).
- Added `BetaFeedback` and `ExitSurveyResponse` database schemas and POST endpoints.
- Created `/beta-feedback` page allowing users to submit bugs, features, and content issues.
- Created `ExitSurveyModal` to collect dropoff reasons when exiting lessons early.
- Upgraded Founder Dashboard with cohort retention curves (D1, D3, D7), activation funnels, engagement stats, dropoff counts, friction report analysis, and chronological user journey timelines.

## [1.1.0] - 2026-06-28
### Added
- Persisted Daily Login Rewards in Postgres backend via new `UserStats` columns and `/api/progression/claim-daily` endpoint.
- Brand new onboarding flow page `/onboarding` for Welcome Screen and Character Archetype Class selection.
- Redirected new users to `/onboarding` instead of `/dashboard` upon registering.
- Implemented `/onboarding` check for protected routes.
- Added telemetry tracking for `lesson_completion_modal_viewed`, `next_lesson_clicked`, and `return_to_map_clicked`.
- Added telemetry statistics card inside Founder Analytics dashboard page.

## [1.0.0] - 2024-06-07
### Added
- Complete Phase 1 MVP Implementation.
- FastAPI Backend with JWT Authentication and SQLAlchemy models.
- Vite-based React Frontend with TypeScript and Tailwind CSS.
- Gamified Dashboard with XP, Level, and Intelligence tracking.
- Split-screen Learning Arena with Monaco Editor integration.
- Memory Visualization module using Framer Motion.
- Docker and Docker Compose configuration.
- XP Service with unit tests.
