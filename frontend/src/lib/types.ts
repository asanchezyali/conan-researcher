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

export type URLs = {
  urls: string[];
};

export type PropertyProfile = {
  property_type: string;
  price: string;
  location: string;
  size: string;
  source_url: string;
};
