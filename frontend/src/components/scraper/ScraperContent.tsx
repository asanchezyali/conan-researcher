import React from 'react';
import { Scraper } from '@/lib/schemas';
import { ScraperFilters } from './ScraperFilters';
import { ScraperList } from './ScraperList';
import { Compass, Map, Book,  ArrowRight } from 'lucide-react';

interface ScraperContentProps {
  scrapers: Scraper[];
  filteredScrapers: Scraper[];
  expandedScraperId: string | null;
  loading: Record<string, boolean>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  toggleAccordion: (scraper: Scraper) => void;
  runScraperHandler: (scraper: Scraper) => void;
  stopScraperHandler: (scraper: Scraper) => void;
  handleDeleteScraper: (scraperId: string) => void;
  openModal: (scraper: Scraper | null) => void;
}

export const ScraperContent: React.FC<ScraperContentProps> = ({
  scrapers,
  filteredScrapers,
  expandedScraperId,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  toggleAccordion,
  runScraperHandler,
  stopScraperHandler,
  handleDeleteScraper,
  openModal,
}) => {
  return (
    <div className="pt-2 pb-10">
      {scrapers.length > 0 ? (
        <>
          <ScraperFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <ScraperList
            filteredScrapers={filteredScrapers}
            expandedScraperId={expandedScraperId}
            loading={loading}
            toggleAccordion={toggleAccordion}
            runScraperHandler={runScraperHandler}
            stopScraperHandler={stopScraperHandler}
            handleDeleteScraper={handleDeleteScraper}
            openModal={openModal}
          />
        </>
      ) : (
        <div className="mt-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                Uncover the World's Hidden Insights
              </h3>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Embark on a journey of discovery with Conan Researcher. Create your first explorer and chart new territories of knowledge.
              </p>
              <button onClick={() => openModal(null)} className="group flex items-center text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-full py-3 px-6 w-fit">
                Start Your Expedition
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            <div className="bg-blue-800 p-12 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
              </div>
              <div className="relative z-10 flex justify-center space-x-8 mb-8">
                {[Compass, Book, Map].map((Icon, index) => (
                  <div key={index} className="bg-blue-700 p-4 rounded-2xl">
                    <Icon className="w-12 h-12 text-blue-200" />
                  </div>
                ))}
              </div>
              <blockquote className="text-blue-200 italic text-center mt-8 relative z-10">
                <p className="text-lg mb-4">"The world is full of obvious things which nobody by any chance ever observes."</p>
                <footer className="text-blue-300">— Arthur Conan Doyle</footer>
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
