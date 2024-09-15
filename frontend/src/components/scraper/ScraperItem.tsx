import React from 'react';
import { Scraper } from '@/lib/schemas';
import { CompanyProfile } from '@/lib/types';
import { Table } from '@/components/table/Table';
import { ScraperActions } from './ScraperActions';
import {
  Search,
  Compass,
  MapPin,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface ScraperItemProps {
  scraper: Scraper;
  isExpanded: boolean;
  loading: boolean;
  toggleAccordion: (scraper: Scraper) => void;
  runScraperHandler: (scraper: Scraper) => void;
  stopScraperHandler: (scraper: Scraper) => void;
  handleDeleteScraper: (scraperId: string) => void;
  openModal: (scraper: Scraper) => void;
}

export const ScraperItem: React.FC<ScraperItemProps> = ({
  scraper,
  isExpanded,
  loading,
  toggleAccordion,
  runScraperHandler,
  stopScraperHandler,
  handleDeleteScraper,
  openModal,
}) => {
  const statusConfig: {
    [key: string]: { icon: React.ElementType; color: string; text: string };
  } = {
    running: { icon: Search, color: 'text-green-500', text: 'Exploring' },
    ready: { icon: Compass, color: 'text-blue-500', text: 'Ready' },
    stopped: { icon: MapPin, color: 'text-red-500', text: 'Not Started' },
  };

  const {
    icon: StatusIcon,
    color,
    text,
  } = statusConfig[scraper.status] || statusConfig.stopped;

  return (
    <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
      <div className="flex items-center p-4">
        <button
          className="mr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600"
          onClick={() => toggleAccordion(scraper)}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-gray-900">{scraper.name}</h3>
          <div className="mt-1 flex items-center">
            <StatusIcon size={16} className={`mr-2 ${color}`} />
            <span className={`text-sm ${color}`}>
              {loading && scraper.status === 'running' ? 'Exploring...' : text}
            </span>
          </div>
        </div>
        <ScraperActions
          scraper={scraper}
          loading={loading}
          runScraperHandler={runScraperHandler}
          stopScraperHandler={stopScraperHandler}
          handleDeleteScraper={handleDeleteScraper}
          openModal={openModal}
        />
      </div>
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {scraper.status === 'ready' &&
          scraper?.results &&
          scraper?.results.length > 0 ? (
            <Table data={scraper?.results as CompanyProfile[]} />
          ) : (
            <p className="text-sm text-gray-500">
              No discoveries yet. Start your exploration!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
