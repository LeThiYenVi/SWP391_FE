import { useEffect } from 'react';
import { useWebSocket } from './useWebSocketCompat';
import BookingTrackingService from '../services/BookingTrackingService';

/**
 * Hook để tích hợp BookingTrackingService với WebSocketContext
 * Đảm bảo tương thích ngược với code cũ
 */
export const useBookingTracking = () => {
  const webSocketContext = useWebSocket();

  useEffect(() => {
    // Set WebSocket context cho BookingTrackingService
    BookingTrackingService.setWebSocketContext(webSocketContext);
  }, [webSocketContext]);

  return {
    // WebSocket methods
    connected: webSocketContext.connected,
    notifications: webSocketContext.notifications,
    subscribeToBooking: webSocketContext.subscribeToBooking,
    unsubscribeFromBooking: webSocketContext.unsubscribeFromBooking,
    sendMessage: webSocketContext.sendMessage,
    markAsRead: webSocketContext.markAsRead,
    clearNotifications: webSocketContext.clearNotifications,
    
    // Legacy methods for backward compatibility
    connect: (onConnect) => {
      console.warn('⚠️ connect() is deprecated. WebSocket auto-connects on login.');
      if (webSocketContext.connected && onConnect) {
        onConnect();
      }
    },
    
    subscribeBooking: (bookingId, onMessage) => {
      return webSocketContext.subscribeToBooking(bookingId, onMessage);
    },
    
    unsubscribeBooking: (bookingId) => {
      webSocketContext.unsubscribeFromBooking(bookingId);
    },
    
    disconnect: () => {
      console.warn('⚠️ disconnect() is deprecated. WebSocket auto-disconnects on logout.');
    }
  };
};
