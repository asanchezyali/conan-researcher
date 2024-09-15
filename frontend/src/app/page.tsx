'use client';

import { useState, useCallback, useEffect } from 'react';
import { ScraperCreate } from '@/components/scraper/ScraperCreate';
import { ScraperModal } from '@/components/scraper/ScraperModal';
import { ScraperContent } from '@/components/scraper/ScraperContent';
import { useScrapers } from '@/hooks/useScrapers';
import { Scraper, ScraperFormSchemaInputType } from '@/lib/schemas';
import { defaultScraperFormValues } from '@/constant/form';

export default function StartUpsScraper() {
  const {
    loading,
    scrapers,
    expandedScraperId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleScraperSubmit,
    runScraperHandler,
    stopScraperHandler,
    handleDeleteScraper,
    toggleAccordion,
    filteredScrapers,
  } = useScrapers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingScraper, setEditingScraper] = useState<
    Scraper | ScraperFormSchemaInputType | null
  >(null);

  const openModal = useCallback((scraper: Scraper | null = null) => {
    scraper ? setIsEditing(true) : setIsEditing(false);
    scraper
      ? setEditingScraper(scraper)
      : setEditingScraper(defaultScraperFormValues);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingScraper(null);
  }, []);
  return (
    <section className="relative">
      <ScraperContent
        scrapers={scrapers}
        filteredScrapers={filteredScrapers}
        expandedScraperId={expandedScraperId}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        toggleAccordion={toggleAccordion}
        runScraperHandler={runScraperHandler}
        stopScraperHandler={stopScraperHandler}
        handleDeleteScraper={handleDeleteScraper}
        openModal={openModal}
      />
      <ScraperModal
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        editingScraper={editingScraper as Scraper}
        handleScraperSubmit={handleScraperSubmit}
      />
      <ScraperCreate openModal={openModal} />
    </section>
  );
}
