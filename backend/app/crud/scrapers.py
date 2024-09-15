import logging
from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from app.utils.dates import handle_date

from app.models.models import Scraper, ScraperResults, Schedule, ScraperResponse

logger = logging.getLogger(__name__)


async def get_scrapers(*, session: AsyncSession):
    statement = select(Scraper).options(selectinload(Scraper.schedule))
    result = await session.execute(statement)
    scrapers = result.scalars().all()
    return [ScraperResponse.model_validate(scraper) for scraper in scrapers]


async def get_scraper_by_id(
    *,
    session: AsyncSession,
    uuid: UUID,
):
    scraper = await session.get(Scraper, uuid)
    return scraper


async def get_scraper_by_name(
    *,
    session: AsyncSession,
    name: str,
):
    scraper = (await session.exec(select(Scraper).where(Scraper.name == name))).first()
    return scraper


async def create_scraper(
    *,
    session: AsyncSession,
    scraper: Scraper,
):
    existing_scraper = await session.execute(
        select(Scraper).where(Scraper.name == scraper.name)
    )
    if existing_scraper.scalars().first():
        raise ValueError(f"Scraper with name {scraper.name} already exists")

    new_scraper = Scraper(
        name=scraper.name,
        urls=scraper.urls,
        description=scraper.description,
    )
    logger.info(f"Creating scraper: {scraper.name}")
    session.add(new_scraper)

    try:
        await session.flush()
    except IntegrityError:
        await session.rollback()
        raise ValueError(f"Error creating scraper: {scraper.name}")

    if scraper.schedule:
        logger.info(f"Creating schedule for scraper: {scraper.name}")
        new_schedule = Schedule(
            scraper_id=new_scraper.uuid,
            repeat_every=scraper.schedule.repeat_every,
            repeat_unit=scraper.schedule.repeat_unit,
            weekdays=scraper.schedule.weekdays,
            time=scraper.schedule.time,
        )
        session.add(new_schedule)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise ValueError(f"Error creating scraper or schedule for: {scraper.name}")

    await session.refresh(new_scraper)
    return new_scraper


async def update_scraper(
    *,
    session: AsyncSession,
    new_scraper: Scraper,
):
    existing_scraper = await session.get(Scraper, new_scraper.uuid)
    if not existing_scraper:
        raise ValueError(f"Scraper with uuid {new_scraper.uuid} does not exist")

    existing_scraper.name = new_scraper.name
    existing_scraper.urls = new_scraper.urls
    existing_scraper.description = new_scraper.description

    logger.info(f"Updating scraper: {existing_scraper.name}")

    if new_scraper.schedule:
        logger.info(f"Updating schedule for scraper: {existing_scraper.name}")
        existing_schedule = await session.execute(
            select(Schedule).where(Schedule.scraper_id == existing_scraper.uuid)
        )
        existing_schedule = existing_schedule.scalars().first()

        end_date = handle_date(new_scraper.schedule.end_date)

        if existing_schedule:
            existing_schedule.repeat_every = new_scraper.schedule.repeat_every
            existing_schedule.repeat_unit = new_scraper.schedule.repeat_unit
            existing_schedule.weekdays = new_scraper.schedule.weekdays
            existing_schedule.time = new_scraper.schedule.time
        else:
            new_schedule = Schedule(
                scraper_id=existing_scraper.uuid,
                repeat_every=new_scraper.schedule.repeat_every,
                repeat_unit=new_scraper.schedule.repeat_unit,
                weekdays=new_scraper.schedule.weekdays,
                time=new_scraper.schedule.time,
                end_date=new_scraper.schedule.end_date,
            )
            session.add(new_schedule)
    else:
        existing_schedule = await session.execute(
            select(Schedule).where(Schedule.scraper_id == existing_scraper.uuid)
        )
        existing_schedule = existing_schedule.scalars().first()
        if existing_schedule:
            await session.delete(existing_schedule)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise ValueError(
            f"Error updating scraper or schedule for: {existing_scraper.name}"
        )

    await session.refresh(existing_scraper)
    return existing_scraper


async def delete_scraper(
    *,
    session: AsyncSession,
    uuid: UUID,
):
    scraper = await session.get(Scraper, uuid)
    await session.delete(scraper)
    await session.commit()
    return scraper


async def save_scraper_results(
    *,
    session: AsyncSession,
    scraper_id: UUID,
    results: dict,
):
    scraper_results = ScraperResults(results=results, scraper_id=scraper_id)
    session.add(scraper_results)
    await session.commit()
    await session.refresh(scraper_results)
    return scraper_results


async def get_scraper_last_result(
    *,
    session: AsyncSession,
    scraper_uuid: UUID,
):
    query = (
        select(ScraperResults)
        .where(ScraperResults.scraper_id == scraper_uuid)
        .order_by(ScraperResults.created_at.desc())
        .limit(1)
    )
    scraper_results = (await session.exec(query)).first()
    return scraper_results


async def get_scraper_results(
    *,
    session: AsyncSession,
):
    scraper_results = (await session.exec(select(ScraperResults))).all()
    return scraper_results


async def update_scraper_status(
    *,
    session: AsyncSession,
    scraper_id: UUID,
    status: str,
):
    scraper = await session.get(Scraper, scraper_id)
    scraper.status = status
    await session.commit()
    await session.refresh(scraper)
    logger.info(f"Scraper {scraper_id} status updated to {status}")
