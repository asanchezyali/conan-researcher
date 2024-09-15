import React from 'react';
import { Scraper } from '@/lib/schemas';
import { Play, Pause, Edit, Trash2 } from 'lucide-react';

interface ScraperActionsProps {
  scraper: Scraper;
  loading: boolean;
  runScraperHandler: (scraper: Scraper) => void;
  stopScraperHandler: (scraper: Scraper) => void;
  handleDeleteScraper: (scraperId: string) => void;
  openModal: (scraper: Scraper) => void;
}

export const ScraperActions: React.FC<ScraperActionsProps> = ({
  scraper,
  loading,
  runScraperHandler,
  stopScraperHandler,
  handleDeleteScraper,
  openModal,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {scraper.status === 'running' ? (
        <button
          onClick={() => stopScraperHandler(scraper)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50"
          disabled={loading}
          title="Stop Scraper"
        >
          <Pause size={24} />
        </button>
      ) : (
        <button
          onClick={() => runScraperHandler(scraper)}
          className="p-2 text-gray-400 hover:text-green-500 transition-colors duration-200 rounded-full hover:bg-green-50"
          disabled={loading}
          title="Run Scraper"
        >
          <Play size={24} />
        </button>
      )}
      <button
        onClick={() => openModal(scraper)}
        className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200 rounded-full hover:bg-blue-50"
        disabled={loading || scraper.status === 'running'}
        title="Edit Scraper"
      >
        <Edit size={24} />
      </button>
      <button
        onClick={() => handleDeleteScraper(scraper.uuid)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50"
        disabled={loading || scraper.status === 'running'}
        title="Delete Scraper"
      >
        <Trash2 size={24} />
      </button>
    </div>
  );
};