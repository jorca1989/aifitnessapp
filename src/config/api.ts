// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  
  // Check for custom API URL in environment variables
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production backend URL
  return 'https://aifitnessapp-production.up.railway.app';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Food endpoints
  FOODS_SEARCH: `${API_BASE_URL}/api/foods/search`,
  FOODS_RECOGNIZE: `${API_BASE_URL}/api/foods/recognize`,
  USER_LOG_FOOD: `${API_BASE_URL}/api/user/log-food`,
  
  // Recipe endpoints
  RECIPES: `${API_BASE_URL}/api/recipes`,
  ADMIN_RECIPES: `${API_BASE_URL}/api/admin/recipes`,
  
  // Workout endpoints
  WORKOUTS: `${API_BASE_URL}/api/workouts`,
  ADMIN_WORKOUTS: `${API_BASE_URL}/api/admin/workouts`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;

export default API_BASE_URL;
