// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Food & Nutrition
  FOODS_SEARCH: `${API_BASE_URL}/foods/search`,
  FOODS_RECOGNIZE: `${API_BASE_URL}/foods/recognize`,
  FOODS_CREATE: `${API_BASE_URL}/foods`,
  
  // Recipes
  RECIPES: `${API_BASE_URL}/recipes`,
  RECIPES_SEARCH: `${API_BASE_URL}/foods/search`,
  
  // Workouts & Exercises
  WORKOUTS: `${API_BASE_URL}/workouts`,
  EXERCISES_SEARCH: `${API_BASE_URL}/exercises/search`,
  
  // User Data
  USER_LOG_FOOD: `${API_BASE_URL}/user/log-food`,
  USER_LOG_EXERCISE: `${API_BASE_URL}/user/log-exercise`,
  USER_LOG_WEIGHT: `${API_BASE_URL}/user/log-weight`,
  USER_LOG_SLEEP: `${API_BASE_URL}/user/log-sleep`,
  USER_LOG_MOOD: `${API_BASE_URL}/user/log-mood`,
  
  // Admin
  ADMIN_RECIPES: `${API_BASE_URL}/admin/recipes`,
  ADMIN_WORKOUTS: `${API_BASE_URL}/admin/workouts`,
  ADMIN_UPLOAD_IMAGE: `${API_BASE_URL}/admin/upload/image`,
  ADMIN_UPLOAD_VIDEO: `${API_BASE_URL}/admin/upload/video`,
  ADMIN_UPLOAD_THUMBNAIL: `${API_BASE_URL}/admin/upload/thumbnail`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_ENDPOINTS;
