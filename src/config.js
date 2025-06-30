// Use environment variables for API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? "https://snaproom-e7asc0ercvbxazb8.southeastasia-01.azurewebsites.net"
    : "");
