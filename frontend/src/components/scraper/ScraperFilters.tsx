import React from 'react';
import { Search } from 'lucide-react';

interface ScraperFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

export const ScraperFilters: React.FC<ScraperFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="relative w-full sm:w-[300px]">
        <input
          type="text"
          placeholder="Search scrapers..."
          className="pl-10 pr-4 py-2 text-sm bg-white text-blue-900 rounded-md w-full placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
        />
      </div>
      <div className="flex space-x-2">
        {['Exploring', 'Ready', 'Paused'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status.toLowerCase() ? null : status.toLowerCase())}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
              statusFilter === status.toLowerCase()
                ? 'bg-blue-100 text-blue-800'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};