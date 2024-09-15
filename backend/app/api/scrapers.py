import logging
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import Response

from app.core.db import get_session
from app.crud.scrapers import (
    create_scraper,
    delete_scraper,
    get_scraper_by_id,
    get_scraper_by_name,
    get_scraper_last_result,
    get_scraper_results,
    get_scrapers,
    update_scraper,
)
from app.models.models import ScraperCreate, ScraperUpdate

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/")
async def add_scraper(scraper: ScraperCreate, session=Depends(get_session)):
    logger.info("Create a new scraper:" + str(scraper))
    try:
        scraper = await create_scraper(scraper=scraper, session=session)
        return scraper
    except Exception as e:
        logger.error(f"Error in create_scraper: {e}")
        return Response(content=str(e), status_code=500)


@router.get("/")
async def get_scrapers_list(session=Depends(get_session)):
    logger.info("Get a list of all registered scrapers:")
    try:
        scrapers = await get_scrapers(session=session)
        return scrapers
    except Exception as e:
        logger.error(f"Error in get_scraper_list: {e}")
        return Response(content=str(e), status_code=500)


@router.get("/{uuid:uuid}")
async def get_scraper_by_uuid(uuid: UUID, session=Depends(get_session)):
    logger.info(f"Get scraper by id: {uuid}")
    try:
        scraper = await get_scraper_by_id(session=session, uuid=uuid)
        return scraper
    except Exception as e:
        logger.error(f"Error in get_scraper_by_id: {e}")
        return Response(content=str(e), status_code=500)


@router.get("/name/{name}")
async def get_scraper_info_by_name(name: str, session=Depends(get_session)):
    logger.info(f"Get scraper by name: {name}")
    try:
        scraper = await get_scraper_by_name(session=session, name=name)
        return scraper
    except Exception as e:
        logger.error(f"Error in get_scraper_by_name: {e}")
        return Response(content=str(e), status_code=500)


@router.put("/")
async def update_scraper_info(scraper: ScraperUpdate, session=Depends(get_session)):
    logger.info(f"Update scraper: {scraper.uuid}")
    try:
        scraper = await update_scraper(new_scraper=scraper, session=session)
        return scraper
    except Exception as e:
        logger.error(f"Error in update_scraper: {e}")
        return Response(content=str(e), status_code=500)


@router.delete("/{uuid:uuid}")
async def delete_scraper_info(uuid: UUID, session=Depends(get_session)):
    logger.info(f"Delete scraper: {uuid}")
    try:
        scraper = await delete_scraper(session=session, uuid=uuid)
        return scraper
    except Exception as e:
        logger.error(f"Error in delete_scraper: {e}")
        return Response(content=str(e), status_code=500)


@router.get("/results")
async def get_all_scraper_results(session=Depends(get_session)):
    logger.info("Get all scraper results")
    try:
        results = await get_scraper_results(session=session)

        return results
    except Exception as e:
        logger.error(f"Error in get_all_scraper_results: {e}")
        return Response(content=str(e), status_code=500)


@router.get("/results/{scraper_uuid}")
async def get_last_results(scraper_uuid: UUID, session=Depends(get_session)):
    logger.info(f"Get scraper results for scraper with id: {scraper_uuid}")
    try:
        scraper = await get_scraper_last_result(
            session=session, scraper_uuid=scraper_uuid
        )
        print(scraper)
        return scraper.results
    except Exception as e:
        logger.error(f"Error in get_scraper_results: {e}")
        return Response(content=str(e), status_code=500)
