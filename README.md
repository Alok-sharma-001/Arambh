# ARAMBH - MASTER PROJECT INSTRUCTION

You are the Lead Software Architect, Senior Full Stack Engineer, Product Manager, UI/UX Designer, and Technical Project Owner for this project.

Your responsibility is to build this project as a production-grade software product.

---

# PROJECT NAME

Arambh

Tagline:

Master Python Through Visual Adventures

---

# PROJECT OVERVIEW

Arambh is a web-based gamified Python learning and revision platform designed to help students and developers retain programming concepts through visual memory, interactive gameplay, and spaced repetition.

Unlike traditional coding platforms, Arambh combines:

* Interactive Python challenges
* RPG-style progression system
* Visual concept animations
* Spaced repetition learning
* Real-time code execution
* XP, Levels, Streaks, and Achievements

The goal is to transform Python revision into an engaging game experience.

---

# CORE VISION

Users often learn Python concepts but forget them after a few weeks.

Arambh solves this problem through:

1. Visual Learning
2. Active Coding Practice
3. Gamification
4. Memory Reinforcement

Every Python concept should become a playable visual experience.

Example:

When a user writes:

x = 5

They should not only see code.

They should see:

* A RAM memory grid
* A value box containing 5
* A memory slot allocation
* A variable label x attached to that slot

The objective is stronger memory retention through visualization.

---

# NON-GOALS

Do NOT:

* Build a generic LMS
* Build a generic coding platform
* Add multiple programming languages in MVP
* Add unnecessary features
* Sacrifice learning quality for flashy visuals

Focus exclusively on Python mastery and retention.

Every feature must answer:

"Will this help users remember Python concepts better?"

If the answer is no, do not build it.

---

# TARGET AUDIENCE

Students:

* School Students
* College Students
* Bootcamp Learners

Developers:

* Junior Developers
* Working Professionals
* Interview Preparation Candidates

---

# TECH STACK

Frontend:

* React.js
* TypeScript
* Tailwind CSS
* Framer Motion
* PixiJS
* Monaco Editor
* Axios

Backend:

* FastAPI
* SQLAlchemy
* Alembic
* PostgreSQL
* Pydantic

Authentication:

* JWT Authentication
* OAuth Ready Architecture

DevOps:

* Docker
* GitHub Actions
* Railway or Render Deployment

---

# SYSTEM ARCHITECTURE

Frontend (React)
↓
FastAPI Backend
↓
PostgreSQL Database

Use clean architecture and proper separation of concerns.

---

# CORE FEATURES

## Gamified Dashboard

Player HUD:

* Username
* Avatar
* XP
* Health
* Level
* Intelligence Stat
* Daily Streak

---

## Split Screen Interface

Left Side:

Visual Learning Arena

Contains:

* Python animations
* Concept simulations
* Memory visualizations
* Character movement

Right Side:

Interactive Coding Environment

Contains:

* Monaco Editor
* Run Code
* Submit Challenge
* Terminal Output

---

## XP System

Correct Challenge:

+100 XP

Level Formula:

Required XP = Current Level × 500

Examples:

Level 1 → 500 XP

Level 2 → 1000 XP

Level 3 → 1500 XP

---

## Intelligence Stat

Every Level Up:

+5 Intelligence

Represents mastery and progress.

---

## Spaced Repetition

Store:

* Review Interval
* Ease Factor
* Next Review Date

Automatically schedule reviews.

---

# DATABASE SCHEMA

User

* id
* username
* email
* hashed_password
* created_at

UserStats

* id
* user_id
* current_level
* total_xp
* intelligence_stat
* streak_days

SpacedRepetition

* id
* user_id
* topic_name
* interval_days
* ease_factor
* next_review_date

ChallengeProgress

* id
* user_id
* challenge_id
* completed
* score
* attempts
* completed_at

---

# API ENDPOINTS

Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

Progress

POST /api/progress/update

GET /api/progress/me

Challenges

GET /api/challenges

GET /api/challenges/{id}

POST /api/challenges/submit

---

# VISUAL LEARNING MODULES

Module 1

Variables & Memory

Example:

x = 5

Behavior:

* Value enters RAM slot
* Variable label attaches
* Slot glows

---

Module 2

Lists

Example:

nums = [1,2,3]

Behavior:

* Array containers appear
* Elements animate into slots

---

Module 3

Loops

Example:

for i in range(5)

Behavior:

* Character walks through checkpoints

---

Module 4

Functions

Example:

def add(a,b)

Behavior:

* Inputs enter a portal
* Function processes them
* Output emerges visually

---

# DEVELOPMENT PHASES

Phase 1 (MVP)

* Authentication
* Dashboard
* XP System
* Variables Animation
* Challenge Submission

Phase 2

* Lists
* Loops
* Functions
* Dictionaries

Phase 3

* Achievements
* Daily Quests
* Leaderboards

Phase 4

* AI Tutor
* AI Challenge Generator
* Personalized Revision

Phase 5

* Multiplayer
* Coding Duels
* Guilds

---

# CODE QUALITY RULES

1. Use TypeScript wherever possible.
2. Follow clean architecture.
3. Write reusable components.
4. Use responsive design.
5. Write production-grade code only.
6. Create tests for critical services.
7. Store secrets in environment variables.
8. Document APIs.
9. Keep animations smooth and performant.
10. Maintain consistent naming conventions.

---

# REQUIRED PROJECT STRUCTURE

arambh/

frontend/

src/

components/

pages/

hooks/

animations/

services/

store/

utils/

public/

backend/

app/

api/

models/

schemas/

services/

database/

auth/

core/

migrations/

tests/

docs/

docker/

README.md

TASKS.md

CHANGELOG.md

ARCHITECTURE.md

---

# WORKFLOW RULES

Before writing code:

1. Read this document completely.
2. Treat this document as the source of truth.
3. Create a detailed implementation plan.
4. Break work into milestones.

During development:

1. Build incrementally.
2. Never break working code.
3. Create reusable modules.
4. Keep commits small and meaningful.

After every completed milestone:

1. Update TASKS.md
2. Update CHANGELOG.md
3. Update ARCHITECTURE.md
4. Document important decisions

---

# FINAL OBJECTIVE

Build the world's most engaging Python learning and revision platform.

The final experience should feel like a combination of:

* Duolingo
* Codecademy
* LeetCode
* RPG Adventure Game

while remaining completely focused on Python mastery, retention, and long-term learning success.
