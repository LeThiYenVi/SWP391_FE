// Test CORS configuration
import { API_BASE_URL } from '../config.js';

export const testCorsConnection = async () => {
  try {
    console.log('Testing API connection with base URL:', API_BASE_URL);
    
    // Test a simple GET request to check if CORS is working
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('CORS test response status:', response.status);
    console.log('CORS test response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      console.log('✅ CORS is working correctly!');
      return { success: true, status: response.status };
    } else {
      console.log('⚠️  API responded but with error status:', response.status);
      return { success: false, status: response.status, error: 'HTTP Error' };
    }
  } catch (error) {
    console.error('❌ CORS test failed:', error);
    return { success: false, error: error.message };
  }
};

// Call this function to test CORS
window.testCors = testCorsConnection;
