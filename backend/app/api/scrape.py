import logging

from fastapi import APIRouter, Depends
from fastapi.responses import Response

from app.core.db import get_session
from app.crud.scrapers import save_scraper_results, update_scraper_status
from app.models.models import ScraperRun, ScraperStatus
from app.services.scrape import ScrapeService
from app.utils.shared_pools import run_blocking_code_in_thread

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/")
async def scrape(query: ScraperRun, session=Depends(get_session)):
    logger.info(f"Running Scraper {query.name}\nSearching info in: {query.urls}")
    try:
        await update_scraper_status(
            session=session, scraper_id=query.uuid, status=ScraperStatus.running
        )
        query_service = ScrapeService(verbose=True)
        response = await run_blocking_code_in_thread(query_service.extract_data, query)

        if "error" not in response:
            scraper_results = await save_scraper_results(
                session=session, scraper_id=query.uuid, results=response
            )
            logger.info(f"Scraper {query.name} results saved: {scraper_results}")
            await update_scraper_status(
                session=session, scraper_id=query.uuid, status=ScraperStatus.ready
            )
        return response
    except Exception as e:
        logger.error(f"Error in search: {e}")
        await update_scraper_status(
            session=session, scraper_id=query.uuid, status=ScraperStatus.failed
        )
        return Response(content=str(e))
