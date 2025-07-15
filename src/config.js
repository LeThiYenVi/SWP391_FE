// API Configuration
// Use environment variable if available, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// App Configuration
export const APP_CONFIG = {
  name: "Gynexa Healthcare Platform",
  version: "2.0.0",
  environment: import.meta.env.NODE_ENV || "development",
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === "true",
  logLevel: import.meta.env.VITE_LOG_LEVEL || "debug"
};

console.log("🔧 API Configuration:", { API_BASE_URL });
