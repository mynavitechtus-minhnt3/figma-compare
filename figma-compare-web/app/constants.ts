// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  GET_IMAGE: `${API_BASE_URL}/image`,
  COMPARE: `${API_BASE_URL}/compare`,
} as const;

// File Upload Constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: /image\/(png|jpeg|jpg)/,
  ALLOWED_EXTENSIONS: ['png', 'jpg', 'jpeg'],
} as const;

// Zoom Constraints
export const ZOOM_CONSTRAINTS = {
  MIN: 50,
  MAX: 200,
  STEP: 10,
} as const;
