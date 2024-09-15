from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import init_db
from app.api.scrape import router as ScrapeRouter
from app.api.scrapers import router as ScrapersRouter
from app.utils.shared_pools import initialize_pools, shutdown_pools


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Initializing database...")
    await init_db()
    logging.info("Database initialized successfully.")
    logging.info("Initializing thread and process pools...")
    initialize_pools()
    logging.info("Thread and process pools initialized successfully.")
    yield
    logging.info("Shutting down thread and process pools...")
    shutdown_pools()
    logging.info("Thread and process pools shut down successfully.")


app = FastAPI(lifespan=lifespan)

ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return "Hello from Conan Researcher API!"


@app.get("/health")
async def health():
    return {"status": "Healthy"}

app.include_router(ScrapeRouter, prefix="/scrape", tags=["scrape"])
app.include_router(ScrapersRouter, prefix="/scrapers", tags=["scrapers"])
