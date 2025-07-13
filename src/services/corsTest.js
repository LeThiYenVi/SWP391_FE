// Test CORS configuration and API connectivity for Healthcare system
import { API_BASE_URL } from '../config.js';

export const testCorsConnection = async () => {
  try {
    console.log('🔍 Testing API connection with base URL:', API_BASE_URL);
    const token = localStorage.getItem('token');
    
    // Test a simple GET request to check if CORS is working
    const response = await fetch(`${API_BASE_URL}/api/services/testing-services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
    });
    
    console.log('📊 CORS test response status:', response.status);
    console.log('📋 CORS test response headers:', [...response.headers.entries()]);
    
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

export const testAllAPIs = async () => {
  console.log('🚀 Starting comprehensive API connectivity test...');
  
  const testEndpoints = [
    { name: 'Testing Services', url: '/api/services/testing-services', method: 'GET' },
    { name: 'Blog Posts', url: '/api/blog/posts', method: 'GET' },
    { name: 'Blog Categories', url: '/api/blog/categories', method: 'GET' },
    { name: 'FAQ', url: '/api/qa/faq', method: 'GET' },
    { name: 'Popular Categories (QA)', url: '/api/qa/categories/popular', method: 'GET' }
  ];
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`🔍 Testing ${endpoint.name}...`);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
      });
      
      const result = {
        name: endpoint.name,
        url: endpoint.url,
        status: response.status,
        success: response.ok,
        error: response.ok ? null : `HTTP ${response.status}`
      };
      
      results.push(result);
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: OK (${response.status})`);
      } else {
        console.log(`❌ ${endpoint.name}: Failed (${response.status})`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name}: Error -`, error.message);
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: 0,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('📊 API Test Results Summary:');
  console.table(results);
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`✅ ${successCount}/${totalCount} API endpoints working correctly`);
  
  return {
    success: successCount > 0,
    results,
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount
    }
  };
};

// Call these functions to test connectivity
window.testCors = testCorsConnection;
window.testAllAPIs = testAllAPIs;
