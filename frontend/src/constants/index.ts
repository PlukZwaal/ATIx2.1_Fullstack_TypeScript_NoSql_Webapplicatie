// Frontend constanten

// API configuratie
export const API_TIMEOUT = 30000; // 30 seconden

// Toast durations (in milliseconds)
export const TOAST_DURATION = {
  SUCCESS: 5000,
  ERROR: 7000
} as const;

// Paginering
export const MODULES_PER_PAGE = 25;

// Zoek delay (debounce)
export const SEARCH_DELAY_MS = 1000;

// LocalStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  MODULES: '/modules',
  MODULES_CREATE: '/modules/create',
  MODULE_DETAIL: '/modules/:id',
  MODULE_EDIT: '/modules/edit/:id',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
