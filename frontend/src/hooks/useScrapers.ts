import { useState, useCallback, useEffect } from 'react';
import { Scraper, ScraperFormSchemaInputType } from '@/lib/schemas';
import {
  runScraper,
  getScraperList,
  deleteScraper,
  getScraperResults,
} from '@/api/api-client';

export function useScrapers() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [expandedScraperId, setExpandedScraperId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const setLoadingState = useCallback((key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const updateScraper = useCallback((uuid: string, updates: Partial<Scraper>) => {
    setScrapers(prev =>
      prev.map(scraper =>
        scraper.uuid === uuid ? { ...scraper, ...updates } : scraper
      )
    );
  }, []);

  const fetchScrapers = useCallback(async () => {
    try {
      setLoadingState('fetchScrapers', true);
      const response = await getScraperList();
      setScrapers(response.data);
    } catch (error) {
      console.error('Error fetching scrapers:', error);
    } finally {
      setLoadingState('fetchScrapers', false);
    }
  }, [setLoadingState]);

  const handleScraperSubmit = useCallback(
    async (data: ScraperFormSchemaInputType, editingScraper: Scraper | null) => {
      setLoadingState('submit', true);
      try {
        if (editingScraper) {
          updateScraper(editingScraper.uuid, data);
        } else {
          const newScraper: Scraper = {
            uuid: data.uuid as string,
            status: 'stopped',
            ...data,
          };
          setScrapers(prev => [...prev, newScraper]);
        }
        await fetchScrapers();
      } catch (error) {
        console.error('Error submitting scraper:', error);
      } finally {
        setLoadingState('submit', false);
      }
    },
    [fetchScrapers, updateScraper, setLoadingState]
  );

  const handleScraperAction = useCallback(async (scraper: Scraper, action: 'run' | 'stop') => {
    try {
      setLoadingState(scraper.uuid, true);
      updateScraper(scraper.uuid, { status: action === 'run' ? 'running' : 'stopped' });
      if (action === 'run') {
        await runScraper(scraper);
        updateScraper(scraper.uuid, { status: 'ready' });
      }
    } catch (error) {
      console.error(`Error ${action}ning scraper:`, error);
    } finally {
      setLoadingState(scraper.uuid, false);
    }
  }, [updateScraper, setLoadingState]);

  const runScraperHandler = useCallback((scraper: Scraper) => handleScraperAction(scraper, 'run'), [handleScraperAction]);
  const stopScraperHandler = useCallback((scraper: Scraper) => handleScraperAction(scraper, 'stop'), [handleScraperAction]);

  const handleDeleteScraper = useCallback(async (scraperId: string) => {
    try {
      await deleteScraper(scraperId);
      setScrapers(prev => prev.filter(scraper => scraper.uuid !== scraperId));
    } catch (error) {
      console.error('Error deleting scraper:', error);
    }
  }, []);

  const toggleAccordion = useCallback(
    async (scraper: Scraper) => {
      const newExpandedId = expandedScraperId === scraper.uuid ? null : scraper.uuid;
      setExpandedScraperId(newExpandedId);

      if (newExpandedId && scraper.status === 'ready') {
        try {
          setLoadingState(scraper.uuid, true);
          const response = await getScraperResults(scraper.uuid);
          updateScraper(scraper.uuid, { results: response.data });
        } catch (error) {
          console.error('Error fetching scraper results:', error);
        } finally {
          setLoadingState(scraper.uuid, false);
        }
      }
    },
    [expandedScraperId, setLoadingState, updateScraper]
  );

  useEffect(() => {
    fetchScrapers();
  }, [fetchScrapers]);

  const filteredScrapers = scrapers.filter(
    scraper =>
      scraper.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? scraper.status === statusFilter : true)
  );

  return {
    loading,
    scrapers,
    expandedScraperId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    fetchScrapers,
    handleScraperSubmit,
    runScraperHandler,
    stopScraperHandler,
    handleDeleteScraper,
    toggleAccordion,
    filteredScrapers,
  };
}