import { useSimpleWebSocket } from '../context/SimpleWebSocketContext';

/**
 * Compatibility hook để các component cũ vẫn hoạt động
 * Cung cấp interface tương tự như WebSocketContext cũ
 */
export const useWebSocket = () => {
  const simpleWebSocket = useSimpleWebSocket();
  
  return {
    connected: simpleWebSocket.connected,
    notifications: [], // Empty array for compatibility
    subscribeToBooking: simpleWebSocket.subscribeToBooking,
    unsubscribeFromBooking: simpleWebSocket.unsubscribeFromBooking,
    subscribeToConversation: () => {}, // Placeholder
    unsubscribeFromConversation: () => {}, // Placeholder
    sendMessage: () => {}, // Placeholder
    markAsRead: () => {}, // Placeholder
    clearNotifications: () => {}, // Placeholder
    connectWebSocket: simpleWebSocket.connect,
    disconnectWebSocket: simpleWebSocket.disconnect
  };
};
