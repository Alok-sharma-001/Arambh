# 📊 Arambh Beta Success Metrics

This document defines the Key Performance Indicators (KPIs) for the Arambh Beta Program. All metrics are sourced from the telemetry layer built into the Analytics API and visible on the Founder Dashboard (`/admin`).

---

## Core Metrics Dashboard

### 1. Registration Rate

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| Total Registrations | Count of `registration` events | 20-50 users in first 2 weeks | `AnalyticsEvent` table, `event_type = 'registration'` |
| Registration-to-First-Lesson Rate | % of registered users who start at least 1 lesson | ≥ 80% | Funnel: `register → first_lesson` |
| Registration Conversion (from landing page) | % of landing page visitors who click "Join Guild" | Track manually via page_view events | `page_view` with path `/register` vs `/` |

### 2. Day 1 Retention

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| D1 Retention | % of users who registered on Day N and logged at least 1 event on Day N+1 | ≥ 40% | Founder Dashboard → "Day-1 Retention" card |
| D1 Lesson Retention | % of users who completed a lesson on Day 1 AND started another lesson on Day 2 | ≥ 30% | Cross-reference `lesson_complete` events across days |

### 3. Day 7 Retention

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| D7 Retention | % of users who registered on Day N and logged at least 1 event on Day N+7 | ≥ 20% | Requires manual query or dashboard extension after 7 days |
| Weekly Active Users (WAU) | Unique users with ≥1 event in the last 7 days | ≥ 50% of total registrations | `AnalyticsEvent` aggregation |

### 4. Lesson Completion Rate

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| Lesson Start Rate | % of sessions that include a `lesson_start` event | ≥ 70% per active session | `AnalyticsEvent` where `event_type = 'lesson_start'` |
| Lesson Completion Rate | Ratio of `lesson_complete` to `lesson_start` events | ≥ 75% | Dropoff Report on Founder Dashboard |
| Average Completion Time | Mean duration (seconds) from lesson start to lesson complete | 120-300s (2-5 min) | `lesson_complete` event details → `duration_seconds` |
| Per-Lesson Success Rate | Success rate for each individual lesson | ≥ 60% per lesson | Dropoff Report table |

### 5. Boss Completion Rate

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| Boss Attempt Rate | % of users who have completed all region lessons AND attempted the boss | ≥ 80% | `boss_attempt` events |
| Boss Victory Rate | Ratio of `boss_victory` to `boss_attempt` | ≥ 50% first try, ≥ 90% within 3 tries | `boss_victory` vs `boss_attempt` counts |
| Boss Failure Hotspot | Boss with lowest victory rate | Identify, don't target | Admin Panel → "Difficult Regions" |

### 6. AI Mentor Usage Rate

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| Mentor Adoption | % of users who opened the Mentor panel at least once | ≥ 50% | `ai_mentor_query` events with distinct user_id |
| Mentor Queries Per User | Average number of mentor interactions per user | 3-10 per session | `AnalyticsEvent` where `event_type = 'ai_mentor_query'` |
| Mentor Satisfaction | Qualitative from feedback form Q12 | ≥ 7/10 average | FEEDBACK_FORM.md responses |
| Mentorship Hotspot Concepts | Concepts generating most mentor queries | Identify top 5 | Admin Panel → "Difficult Concepts" |

### 7. Memory Vault Usage Rate

| Metric | Definition | Target | Data Source |
|--------|-----------|--------|-------------|
| Vault Adoption | % of users who visited `/vault` at least once | ≥ 40% | `page_view` events with path `/vault` |
| Reviews Completed | Total revision submissions across all users | ≥ 100 total in first 2 weeks | `memory_vault_review` events |
| Daily Vault Users | Users who complete ≥1 vault review on a given day | ≥ 5 per day after Week 1 | Daily aggregation |

---

## User Funnel Tracking

The funnel tracks progression through the core user journey. Each stage is measured as a count and a conversion percentage from the previous stage.

```
Register (100%)
  → First Lesson Start (Target: ≥ 80%)
    → First Region Complete (Target: ≥ 50%)
      → First Boss Defeated (Target: ≥ 40%)
        → Memory Vault Usage (Target: ≥ 30%)
          → Region 12 Arrival (Target: ≥ 5%)
```

All funnel data is computed in real-time on the Founder Dashboard.

---

## Dropoff & Friction Tracking

For each lesson, the following metrics are tracked automatically:

| Lesson ID | Attempts | Success Rate | Avg Duration | Action Required? |
|-----------|----------|-------------|--------------|-----------------|
| v1 | — | — | — | |
| v2 | — | — | — | |
| ... | — | — | — | |

**Decision Rules:**
- If success rate < 50% → Flag as "needs content revision"
- If avg duration > 600s (10 min) → Flag as "too complex or unclear"
- If attempts > 0 but success rate = 0% → Flag as "possible bug"

---

## Stuck User Detection

A user is flagged as "stuck" when:
- They have not logged any event for ≥ 3 days
- They are not on Region 12 (i.e., they haven't completed the game)

**Target:** ≤ 20% of active users flagged as stuck at any point.

Stuck users are visible on the Admin Panel and should be contacted via email or Discord.

---

## Reporting Cadence

| Report | Frequency | Owner |
|--------|-----------|-------|
| Daily Metrics Check | Every day | Founder |
| Weekly Retention Report | Every Monday | Founder |
| Lesson Dropoff Audit | After 50+ lesson attempts recorded | Founder |
| Full Beta Report | End of 2-week beta period | Founder |

---

## Success Criteria for Public Launch

The beta is considered **successful** and ready for public launch if:

- [ ] ≥ 20 users registered
- [ ] D1 Retention ≥ 40%
- [ ] D7 Retention ≥ 20%
- [ ] Lesson Completion Rate ≥ 75%
- [ ] Boss Completion Rate ≥ 50% (first attempt)
- [ ] AI Mentor used by ≥ 50% of users
- [ ] Memory Vault used by ≥ 40% of users
- [ ] No critical bugs blocking progression
- [ ] Average feedback form rating ≥ 7/10 across all features
- [ ] ≥ 60% of users would recommend Arambh to a friend
