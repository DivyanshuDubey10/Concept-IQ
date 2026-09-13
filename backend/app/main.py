"""
ConceptIQ FastAPI Application

Run locally from project root:
    uvicorn backend.app.main:app --reload --port 8000

Setup:
    1. cp backend/.env.example backend/.env  (fill in your values)
    2. docker-compose up -d db               (start PostgreSQL)
    3. alembic -c backend/alembic.ini upgrade head   (create tables)
    4. python -m backend.app.seed.seed_data  (insert demo data)
    5. uvicorn backend.app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.database import Base, engine
from backend.app.routers import auth, users, topics, quizzes, progress, revision, tutor

app = FastAPI(
    title="ConceptIQ API",
    description="Adaptive AI learning platform — API layer",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server and any deployed frontend origin
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Create tables on startup (dev convenience — use Alembic in production)
# ---------------------------------------------------------------------------
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(topics.router)
app.include_router(quizzes.router)
app.include_router(progress.router)
app.include_router(revision.router)
app.include_router(tutor.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "ConceptIQ API"}
