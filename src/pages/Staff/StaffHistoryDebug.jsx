import React, { useState } from 'react';
import { getBookingsByStatusAPI } from '../../services/StaffService';

const StaffHistoryDebug = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Check authentication
      const token = localStorage.getItem('authToken');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Test API call
      console.log('Calling API: /api/bookings/status/COMPLETED');
      const response = await getBookingsByStatusAPI('COMPLETED', 1, 10);
      
      console.log('API Response:', response);
      setResult(JSON.stringify(response, null, 2));
      
    } catch (error) {
      console.error('API Error:', error);
      setResult(`Error: ${error.message}\n\nDetails:\n${JSON.stringify({
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code
      }, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testOtherStatuses = async () => {
    setLoading(true);
    const statuses = ['PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'COMPLETED', 'CANCELLED'];
    const results = {};
    
    for (const status of statuses) {
      try {
        console.log(`Testing status: ${status}`);
        const response = await getBookingsByStatusAPI(status, 1, 5);
        results[status] = {
          success: true,
          count: response?.content?.length || 0,
          totalElements: response?.totalElements || 0
        };
      } catch (error) {
        results[status] = {
          success: false,
          error: error.message,
          status: error.response?.status
        };
      }
    }
    
    setResult(JSON.stringify(results, null, 2));
    setLoading(false);
  };

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/actuator/health');
      if (response.ok) {
        const data = await response.json();
        setResult(`Backend Health: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`Backend Health Check Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`Backend Connection Failed: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Staff History API Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Debug Tools</h2>
          
          <div className="space-y-4">
            <button
              onClick={testAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test COMPLETED Status API'}
            </button>
            
            <button
              onClick={testOtherStatuses}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test All Statuses'}
            </button>
            
            <button
              onClick={checkBackendHealth}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Checking...' : 'Check Backend Health'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {result || 'Click a button to test...'}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Auth Token:</strong> {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
            <p><strong>User Role:</strong> {localStorage.getItem('userRole') || 'Not set'}</p>
            <p><strong>API Base URL:</strong> http://localhost:8080</p>
            <p><strong>Expected Endpoint:</strong> GET /api/bookings/status/COMPLETED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffHistoryDebug;
