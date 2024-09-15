export const ErrorResponse = (
  message = 'An unexpected error occurred during the operation',
) => {
  return { success: false, message: message, data: null };
};

export const SuccessResponse = (
  data: any,
  message = 'Operation completed successfully',
) => {
  return { success: true, data: data, message: message };
};

export type CompanyQuery = {
  query: string;
};

export type URLs = {
  urls: string[];
};

export type CompanyProfile = {
  company_name: string;
  founders: string[];
  description: string;
  company_website: string;
  location: string;
  ai_domain: string;
  linkedin_profile: string;
  stealth_mode: string;
  funding_status: string;
  key_technologies: string[];
  notable_clients: string[] | null;
  founding_year: string;
  employee_count: string;
  recent_developments: string;
};
