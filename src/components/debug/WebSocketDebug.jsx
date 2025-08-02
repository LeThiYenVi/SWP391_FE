import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../hooks/useWebSocketCompat';

const WebSocketDebug = () => {
  const { user, isAuthenticated } = useAuth();
  const { connected, notifications, subscribeToBooking, sendMessage } = useWebSocket();
  const [testBookingId, setTestBookingId] = useState('');
  const [testMessage, setTestMessage] = useState('');

  const debugInfo = {
    authentication: {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userRole: user?.role,
      username: user?.username
    },
    webSocket: {
      connected,
      notificationCount: notifications.length,
      latestNotifications: notifications.slice(0, 3)
    }
  };

  const handleTestSubscription = () => {
    if (testBookingId) {
      subscribeToBooking(testBookingId, (update) => {
        console.log('🧪 Test subscription received:', update);
      });
    }
  };

  const handleSendTestMessage = () => {
    if (testMessage) {
      sendMessage('/app/booking-status-update', {
        bookingId: parseInt(testBookingId) || 1,
        status: 'TEST',
        message: testMessage,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-lg mb-3">WebSocket Debug</h3>
      
      {/* Authentication Info */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm">Authentication:</h4>
        <div className="text-xs space-y-1">
          <div>Authenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? 'Yes' : 'No'}
          </span></div>
          <div>User ID: {user?.id || 'N/A'}</div>
          <div>Role: {user?.role || 'N/A'}</div>
        </div>
      </div>

      {/* WebSocket Info */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm">WebSocket:</h4>
        <div className="text-xs space-y-1">
          <div>Connected: <span className={connected ? 'text-green-600' : 'text-red-600'}>
            {connected ? 'Yes' : 'No'}
          </span></div>
          <div>Notifications: {notifications.length}</div>
        </div>
      </div>

      {/* Latest Notifications */}
      {notifications.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm">Latest Notifications:</h4>
          <div className="text-xs max-h-32 overflow-y-auto">
            {notifications.slice(0, 3).map((notif, index) => (
              <div key={index} className="border-b border-gray-200 py-1">
                <div>ID: {notif.bookingId}</div>
                <div>Status: {notif.status}</div>
                <div>Message: {notif.message}</div>
                <div>Private: {notif.isPrivate ? 'Yes' : 'No'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Controls */}
      <div className="space-y-2">
        <div>
          <input
            type="text"
            placeholder="Booking ID"
            value={testBookingId}
            onChange={(e) => setTestBookingId(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button
          onClick={handleTestSubscription}
          className="w-full text-xs bg-blue-500 text-white rounded px-2 py-1"
        >
          Subscribe to Booking
        </button>
        
        <div>
          <input
            type="text"
            placeholder="Test message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button
          onClick={handleSendTestMessage}
          className="w-full text-xs bg-green-500 text-white rounded px-2 py-1"
        >
          Send Test Message
        </button>
      </div>

      {/* Raw Debug Data */}
      <details className="mt-3">
        <summary className="text-xs cursor-pointer">Raw Debug Data</summary>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-32">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default WebSocketDebug;
