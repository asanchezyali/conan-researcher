from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID, uuid4
from enum import Enum

from pydantic import ConfigDict
from sqlalchemy import text, Enum as saEnum, ForeignKey
from sqlalchemy.dialects.postgresql import JSON, ARRAY
from sqlmodel import Field, SQLModel, Column, Relationship


class BaseModel(SQLModel):
    uuid: UUID | None = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        nullable=False,
        sa_column_kwargs={"server_default": text("gen_random_uuid()"), "unique": True},
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": text("current_timestamp(0)")},
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={
            "server_default": text("current_timestamp(0)"),
            "onupdate": text("current_timestamp(0)"),
        },
    )

    model_config = ConfigDict(validate_assignment=True)


class ScraperStatus(str, Enum):
    ready = "ready"
    running = "running"
    stopped = "stopped"
    failed = "failed"


class ScheduleUnit(str, Enum):
    day = "day"
    week = "week"


class ScheduleResponse(BaseModel):
    uuid: UUID
    repeat_every: int
    repeat_unit: str
    weekdays: List[int]
    time: str


class ScraperResponse(BaseModel):
    uuid: UUID
    name: str
    urls: List[str]
    description: str
    status: str
    created_at: datetime
    updated_at: datetime
    schedule: Optional[ScheduleResponse]

    class Config:
        orm_mode = True


class Schedule(BaseModel, table=True):
    __tablename__ = "schedule"
    repeat_every: int = Field(default=1)
    repeat_unit: ScheduleUnit = Field(sa_type=saEnum(ScheduleUnit))
    weekdays: List[int] = Field(sa_column=Column(JSON), default=[])
    time: str = Field(default="09:00")
    scraper_id: UUID = Field(foreign_key="scraper.uuid")
    scraper: "Scraper" = Relationship(back_populates="schedule")


class ScraperBase(SQLModel):
    name: str
    urls: List[str]
    description: str = ""


class ScheduleCreate(SQLModel):
    repeat_every: int = 1
    repeat_unit: ScheduleUnit
    weekdays: List[int] = []
    time: str = Field(default="09:00")


class ScraperCreate(ScraperBase):
    schedule: Optional[ScheduleCreate] = None


class ScraperUpdate(ScraperBase):
    uuid: UUID
    schedule: Optional[ScheduleCreate] = None


class ScraperRun(ScraperUpdate):
    pass


class Scraper(BaseModel, ScraperBase, table=True):
    __tablename__ = "scraper"
    urls: List[str] = Field(sa_column=Column(JSON))
    status: ScraperStatus = Field(
        default=ScraperStatus.stopped, sa_type=saEnum(ScraperStatus)
    )
    results: List["ScraperResults"] = Relationship(back_populates="scraper")
    schedule: Optional[Schedule] = Relationship(
        back_populates="scraper",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class ScraperResults(BaseModel, table=True):
    __tablename__ = "scraper_results"
    results: List[Dict] = Field(default=[], sa_column=Column(ARRAY(JSON)))
    scraper_id: UUID = Field(
        sa_column=Column(ForeignKey("scraper.uuid", ondelete="CASCADE"))
    )
    scraper: Optional[Scraper] = Relationship(back_populates="results")


class ResourceCreate(SQLModel):
    uuid: Optional[UUID] = None
    source: str
    downloader: str = "arxiv"


class Resource(BaseModel, table=True):
    __tablename__ = "resource"
    source: str
    downloader: str = "arxiv"
    status: str = "pending"


class QueryCreate(SQLModel):
    uuid: Optional[UUID] = None
    query: str
    context: Optional[str] = None
    num_results: int = 2
    model: str = "chroma"
    status: str = "pending"


class Query(BaseModel, table=True):
    __tablename__ = "query"
    query: str
    context: str = ""
    num_results: int = 2
    model: str = "chroma"
    status: str = "pending"
    result: str = ""


Scraper.update_forward_refs()
