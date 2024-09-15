import logging

from app.workflows.data_extractor import DataExtractor


logger = logging.getLogger(__name__)


class ScrapeService:
    def __init__(self, verbose: bool = False):
        self.data_extractor = DataExtractor(verbose=verbose)

    def extract_data(self, query) -> str | dict[str, any]:
        logger.info(f"Searching for: {query.urls}")
        try:
            result = self.data_extractor.extract_data(
                urls=query.urls, description=query.description
            )
            return result
        except Exception as e:
            logger.error(f"Error in search: {e}")
            return str(e)
