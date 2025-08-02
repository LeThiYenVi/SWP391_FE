import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimpleWebSocket } from '../../context/SimpleWebSocketContext';

const AuthDebug = () => {
  const { user, token, isAuthenticated } = useAuth();
  const { connected } = useSimpleWebSocket();

  const debugInfo = {
    authentication: {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userId: user?.id,
      userRole: user?.role,
      username: user?.username
    },
    localStorage: {
      hasAuthToken: !!localStorage.getItem('authToken'),
      hasUser: !!localStorage.getItem('user'),
      hasRefreshToken: !!localStorage.getItem('refreshToken')
    },
    webSocket: {
      connected,
      notificationCount: 0,
      latestNotification: null
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Auth Debug Info</h3>
      <div className="text-xs space-y-2">
        <div>
          <strong>Auth Status:</strong>
          <div className="ml-2">
            <div>✅ Authenticated: {debugInfo.authentication.isAuthenticated ? 'Yes' : 'No'}</div>
            <div>👤 User: {debugInfo.authentication.hasUser ? 'Yes' : 'No'}</div>
            <div>🔑 Token: {debugInfo.authentication.hasToken ? 'Yes' : 'No'}</div>
            <div>🆔 User ID: {debugInfo.authentication.userId || 'N/A'}</div>
            <div>👥 Role: {debugInfo.authentication.userRole || 'N/A'}</div>
          </div>
        </div>
        
        <div>
          <strong>LocalStorage:</strong>
          <div className="ml-2">
            <div>🔑 Auth Token: {debugInfo.localStorage.hasAuthToken ? 'Yes' : 'No'}</div>
            <div>👤 User Data: {debugInfo.localStorage.hasUser ? 'Yes' : 'No'}</div>
            <div>🔄 Refresh Token: {debugInfo.localStorage.hasRefreshToken ? 'Yes' : 'No'}</div>
          </div>
        </div>
        
        <div>
          <strong>WebSocket:</strong>
          <div className="ml-2">
            <div>🔌 Connected: {debugInfo.webSocket.connected ? 'Yes' : 'No'}</div>
            <div>📨 Notifications: {debugInfo.webSocket.notificationCount}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
