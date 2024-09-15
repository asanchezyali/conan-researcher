import json
import logging
from scrapegraphai.graphs import SmartScraperMultiGraph
from app.agents.scrapegraph_agent.prompts import real_estate_extractor_prompt
from app.core.config import settings


logger = logging.getLogger(__name__)


class SmartScraperResearchAgent:
    def __init__(
        self, verbose: bool = False, headless: bool = True, config: dict = None
    ):
        self.verbose = verbose
        self.headless = headless
        self.config = config or self.__get_scrapegraph_config()

    def run(
        self,
        urls: list[str],
        data_schema: dict,
        prompt: str = None,
        user_description: str = None,
    ):
        logger.info(f"Start scraping Agent with urls: {urls}")
        if len(urls) == 0:
            raise ValueError("The SmartScraperResearchAgent expects exactly one URL.")

        self.prompt = prompt or self._generate_prompt(
            data_schema, user_description=user_description
        )

        smart_scraper = SmartScraperMultiGraph(
            source=urls, prompt=self.prompt, config=self.config
        )
        results = smart_scraper.run()
        return results

    def _generate_prompt(self, data_schema, user_description, **kwargs):
        logger.info("Generating prompt for the SmartScraperMultiGraph")
        prompt_template = real_estate_extractor_prompt()
        formatted_data_schema = json.dumps(data_schema, indent=2)
        return prompt_template.format(
            data_schema=formatted_data_schema, user_description=user_description
        )

    def __get_scrapegraph_config(self):
        config_by_provider = {
            "openai": {
                "model": "openai/gpt-4o-mini",
                "api_key": settings.OPENAI_API_KEY,
            },
        }
        config = {
            "llm": config_by_provider.get("openai"),
            "verbose": self.verbose,
            "headless": self.headless,
        }

        return config
