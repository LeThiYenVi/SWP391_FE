import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginTest = () => {
  const handleGoogleSuccess = (codeResponse) => {
    console.log('✅ Google login success:', codeResponse);
    console.log('✅ Code received:', codeResponse.code?.substring(0, 30) + '...');
  };

  const handleGoogleError = (error) => {
    console.error('❌ Google login error:', error);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: 'auth-code',
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Google Login Test</h3>
      <button 
        onClick={() => {
          console.log('🔍 Test Google login button clicked');
          googleLogin();
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Google Login
      </button>
    </div>
  );
};

export default GoogleLoginTest;
