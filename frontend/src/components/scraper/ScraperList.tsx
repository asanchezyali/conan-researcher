import React from 'react';
import { Scraper } from '@/lib/schemas';
import { ScraperItem } from './ScraperItem';

interface ScraperListProps {
  filteredScrapers: Scraper[];
  expandedScraperId: string | null;
  loading: Record<string, boolean>;
  toggleAccordion: (scraper: Scraper) => void;
  runScraperHandler: (scraper: Scraper) => void;
  stopScraperHandler: (scraper: Scraper) => void;
  handleDeleteScraper: (scraperId: string) => void;
  openModal: (scraper: Scraper) => void;
}

export const ScraperList: React.FC<ScraperListProps> = ({
  filteredScrapers,
  expandedScraperId,
  loading,
  toggleAccordion,
  runScraperHandler,
  stopScraperHandler,
  handleDeleteScraper,
  openModal,
}) => {
  return (
    <div className="space-y-4">
      {filteredScrapers.map(scraper => (
        <ScraperItem
          key={scraper.uuid}
          scraper={scraper}
          isExpanded={expandedScraperId === scraper.uuid}
          loading={loading[scraper.uuid]}
          toggleAccordion={toggleAccordion}
          runScraperHandler={runScraperHandler}
          stopScraperHandler={stopScraperHandler}
          handleDeleteScraper={handleDeleteScraper}
          openModal={openModal}
        />
      ))}
    </div>
  );
};