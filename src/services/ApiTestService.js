import instance from "./customize-axios";
import { testCorsConnection, testAllAPIs } from "./corsTest";

// Test all authenticated API endpoints
export const testAuthenticatedAPIs = async () => {
  console.log('🔐 Testing authenticated API endpoints...');
  
  const authTestEndpoints = [
    // User APIs (require auth)
    { name: 'User Profile', url: '/api/user/profile', method: 'GET', requiresAuth: true },
    { name: 'User Booking History', url: '/api/user/booking-history', method: 'GET', requiresAuth: true },
    { name: 'User Reminders', url: '/api/user/reminders', method: 'GET', requiresAuth: true },
    
    // Consultant APIs (require consultant auth)
    { name: 'Consultant Profile', url: '/api/consultant/getProfile', method: 'GET', requiresAuth: true, role: 'CONSULTANT' },
    { name: 'Consultant Unavailability', url: '/api/consultant/unavailability', method: 'GET', requiresAuth: true, role: 'CONSULTANT' },
    
    // Booking APIs (require auth)
    { name: 'My Bookings', url: '/api/bookings/my-bookings', method: 'GET', requiresAuth: true },
    
    // Consultation APIs (require auth)
    { name: 'User Consultations', url: '/api/consultation/user-bookings', method: 'GET', requiresAuth: true },
    { name: 'Upcoming Consultations', url: '/api/consultation/upcoming', method: 'GET', requiresAuth: true },
    
    // QA APIs (some require auth)
    { name: 'User Questions', url: '/api/qa/user/questions', method: 'GET', requiresAuth: true },
    
    // Menstrual Cycle APIs (require auth)
    { name: 'Menstrual Cycle Tracker', url: '/api/user/menstrual-cycle/tracker', method: 'GET', requiresAuth: true },
    { name: 'Menstrual Cycle Prediction', url: '/api/menstrual-cycle/prediction', method: 'GET', requiresAuth: true },
    { name: 'Fertility Window', url: '/api/menstrual-cycle/fertility-window', method: 'GET', requiresAuth: true },
  ];
  
  const results = [];
  
  for (const endpoint of authTestEndpoints) {
    try {
      console.log(`🔍 Testing ${endpoint.name}...`);
      
      let response;
      if (endpoint.method === 'GET') {
        response = await instance.get(endpoint.url);
      } else if (endpoint.method === 'POST') {
        response = await instance.post(endpoint.url, {});
      }
      
      const result = {
        name: endpoint.name,
        url: endpoint.url,
        status: 200,
        success: true,
        error: null,
        requiresAuth: endpoint.requiresAuth,
        role: endpoint.role || 'USER'
      };
      
      results.push(result);
      console.log(`✅ ${endpoint.name}: OK`);
      
    } catch (error) {
      const status = error.response?.status || 0;
      const isAuthError = status === 401 || status === 403;
      
      const result = {
        name: endpoint.name,
        url: endpoint.url,
        status: status,
        success: false,
        error: isAuthError ? 'Authentication required' : error.message,
        requiresAuth: endpoint.requiresAuth,
        role: endpoint.role || 'USER',
        expectedError: endpoint.requiresAuth && isAuthError
      };
      
      results.push(result);
      
      if (endpoint.requiresAuth && isAuthError) {
        console.log(`🔒 ${endpoint.name}: Auth required (${status}) - Expected`);
      } else {
        console.log(`❌ ${endpoint.name}: Error (${status}) - ${error.message}`);
      }
    }
  }
  
  console.log('📊 Authenticated API Test Results:');
  console.table(results);
  
  return {
    results,
    summary: {
      total: results.length,
      success: results.filter(r => r.success).length,
      authRequired: results.filter(r => r.expectedError).length,
      failed: results.filter(r => !r.success && !r.expectedError).length
    }
  };
};

// Test specific service functionality
export const testServiceFunctionality = async () => {
  console.log('🧪 Testing service functionality...');
  
  try {
    // Test CORS first
    console.log('1️⃣ Testing CORS...');
    const corsResult = await testCorsConnection();
    
    // Test public APIs
    console.log('2️⃣ Testing public APIs...');
    const publicResult = await testAllAPIs();
    
    // Test authenticated APIs
    console.log('3️⃣ Testing authenticated APIs...');
    const authResult = await testAuthenticatedAPIs();
    
    const overall = {
      cors: corsResult,
      publicAPIs: publicResult,
      authenticatedAPIs: authResult,
      timestamp: new Date().toISOString()
    };
    
    console.log('🎯 Complete API Test Results:');
    console.log(overall);
    
    return overall;
    
  } catch (error) {
    console.error('❌ Service functionality test failed:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to run quick connectivity test
export const quickConnectivityTest = async () => {
  console.log('⚡ Running quick connectivity test...');
  
  try {
    const response = await instance.get('/api/services/testing-services');
    console.log('✅ Backend is reachable!');
    return { success: true, message: 'Backend connected successfully' };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return { success: false, message: error.message };
  }
};

// Export test functions to window for easy access in dev tools
if (typeof window !== 'undefined') {
  window.testAuthAPIs = testAuthenticatedAPIs;
  window.testServiceFunctionality = testServiceFunctionality;
  window.quickTest = quickConnectivityTest;
}

export default {
  testAuthenticatedAPIs,
  testServiceFunctionality,
  quickConnectivityTest
}; 