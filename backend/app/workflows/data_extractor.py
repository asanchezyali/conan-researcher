import logging
from typing import Dict, Any

from app.agents.scrapegraph_agent.scrapegraph_agent import SmartScraperResearchAgent
from app.agents.scrapegraph_agent.schemas import PropertySchema


default_data_schema = PropertySchema.generate_schema_dict()
logger = logging.getLogger(__name__)


class DataExtractor:
    def __init__(
        self,
        verbose: bool = False,
        headless: bool = True,
    ):
        self.smart_scraper_research_agent = SmartScraperResearchAgent(
            verbose=verbose, headless=headless
        )
        self.verbose = verbose

    def extract_data(
        self,
        urls: list[str],
        data_schema: dict = None,
        prompt: str = None,
        description: str = None,
    ) -> Dict[str, Any]:
        data_schema = data_schema or default_data_schema
        try:
            results = self.smart_scraper_research_agent.run(
                urls=urls,
                data_schema=data_schema,
                prompt=prompt,
                user_description=description,
            )
            return results
        except Exception as e:
            error_message = f"An error occurred during data extraction: {str(e)}"
            if self.verbose:
                print(error_message)
            return error_message
