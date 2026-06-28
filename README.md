# Arambh — Master Python Through Visual Adventures

Arambh is a production-grade, web-based gamified Python learning and revision platform designed to help students and developers retain programming concepts through visual memory, interactive gameplay, and spaced repetition.

Arambh combines:
* **Interactive Python Challenges**: Solve quizzes and complete training grounds with combo streak bonuses.
* **RPG-style Progression System**: Choose a class, earn XP, level up, increase your Intelligence stat, and unlock achievements.
* **Visual Concept Animations**: View step-by-step executions of variables, lists, loops, and iterators.
* **Spaced Repetition (SRS)**: Schedule concept reviews using a memory vault built around the SuperMemo SM-2 algorithm.
* **AI Mentor**: Chat with an AI assistant tailored to your active learning context.
* **Guild System**: Form alliances, chat, track members, and clear dungeons together.
* **Founder Dashboard**: Full analytics suite checking retention cohort curves, funnels, dropoffs, and friction reports.

---

## Technical Stack

* **Frontend**: React.js, TypeScript, Vite, CSS, GSAP, Framer Motion, Monaco Editor, Lucide Icons, Axios.
* **Backend**: Python 3.13, FastAPI, SQLAlchemy, Alembic, Pydantic, SQLite/PostgreSQL.
* **Authentication**: JWT Token-based authentication.

---

## Directory Structure

```text
arambh/
├── frontend/             # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── components/   # UI elements, widgets, layout, mentor, analytics
│   │   ├── pages/        # Dashboard, onboarding, maps, learning arena, admin
│   │   ├── services/     # API integration services (axios calls)
│   │   ├── store/        # State managers (zustand stores)
│   │   └── data/         # Mock curriculums, regions, library topics
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── api/          # Route controller endpoints (auth, progression, analytics, mentor)
│   │   ├── models/       # Database entities (user, progression, analytics, mentor)
│   │   ├── schemas/      # Pydantic parsing schemas
│   │   ├── database/     # SQLAlchemy connection session configurations
│   │   └── core/         # Project setting configurations
│   ├── migrations/       # Database migration scripts (Alembic)
│   └── tests/            # Automated unit and integration tests
```

---

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=sqlite:///./arambh.db
SECRET_KEY=supersecretkeyforphase1mvp
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (`frontend/.env.development` or `frontend/.env.production`)
Create a `.env.development` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## Installation & Setup

### Prerequisites
* Python 3.13+
* Node.js 18+
* npm or yarn

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Running Automated Tests
To run the automated python integration test suite:
```bash
cd backend
source venv/bin/activate
pytest
```

---

## Beta Testing Guide
1. **Register & Onboard**: Create a new account, view the Welcome dialog, choose your class (Python Mage, Automation Rogue, or Data Warrior), and begin your journey.
2. **Interactive Lessons**: Start the first lesson inside *Variables Forest*. Run python steps, read concept hooks, and request AI Mentor chats on the side panel.
3. **Training Grounds**: Take quizzes to test your memory and keep up combo streak multipliers.
4. **Memory Vault**: Review active cards and select your recall level to test the SRS scheduling algorithm.
5. **Beta Feedback**: Report bugs, feature requests, or general friction using the `/beta-feedback` route.
6. **Founder Analytics**: Log in with username `founder` to view the comprehensive analytics suite.
