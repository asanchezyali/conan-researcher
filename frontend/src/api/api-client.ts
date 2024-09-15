import { ErrorResponse, SuccessResponse } from '@/lib/types';
import { URLs } from '@/lib/types';
import { Scraper, ScraperFormSchemaInputType } from '@/lib/schemas';

import axiosInstance from './axios-instance';


export const runScraper = async (ulrs: URLs) => {
  try {
    const response = await axiosInstance.post('/scrape/', ulrs);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
};

export const getScraperList = async () => {
  try {
    const response = await axiosInstance.get('/scrapers/');
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
};

export const addScraper = async (scraper: ScraperFormSchemaInputType) => {
  try {
    const response = await axiosInstance.post('/scrapers/', scraper);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
};

export const getScraper = async (scraperId: string) => {
  try {
    const response = await axiosInstance.get(`/scrapers/${scraperId}`);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
};

export const getScraperByName = async (scraperName: string) => {
  try {
    const response = await axiosInstance.get(`/scrapers/name/${scraperName}`);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
};

export const updateScraper = async (scraper: Scraper) => {
  try {
    const response = await axiosInstance.put('/scrapers/', scraper);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
};


export const deleteScraper = async ( scraperId: string) => {
  try {
    const response = await axiosInstance.delete(`/scrapers/${scraperId}`);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
}

export const getScraperResults = async (scraperId: string) => {
  try {
    const response = await axiosInstance.get(`/scrapers/results/${scraperId}`);
    if (response.status === 200) {
      return SuccessResponse(response.data);
    } else {
      return ErrorResponse(response.data.message);
    }
  } catch (error) {
    console.error(error);
    return ErrorResponse('An unexpected error occurred during the operation');
  }
}