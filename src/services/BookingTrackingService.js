// Legacy service - Sử dụng WebSocketContext thay thế
// Giữ lại để tương thích với code cũ

class BookingTrackingService {
  constructor() {
    this.webSocketContext = null;
    console.warn('⚠️ BookingTrackingService is deprecated. Use useWebSocket hook instead.');
  }

  // Phương thức để set WebSocket context từ component
  setWebSocketContext(context) {
    this.webSocketContext = context;
  }

  connect(onConnect) {
    console.warn('⚠️ BookingTrackingService.connect() is deprecated. WebSocket auto-connects on login.');
    if (this.webSocketContext?.connected && onConnect) {
      onConnect();
    }
  }

  subscribeBooking(bookingId, onMessage) {
    if (this.webSocketContext) {
      return this.webSocketContext.subscribeToBooking(bookingId, onMessage);
    }
    console.warn('⚠️ WebSocket context not available. Make sure user is logged in.');
    return null;
  }

  unsubscribeBooking(bookingId) {
    if (this.webSocketContext) {
      this.webSocketContext.unsubscribeFromBooking(bookingId);
    }
  }

  disconnect() {
    console.warn('⚠️ BookingTrackingService.disconnect() is deprecated. WebSocket auto-disconnects on logout.');
    // Không làm gì - WebSocket sẽ tự disconnect khi logout
  }

  get connected() {
    return this.webSocketContext?.connected || false;
  }
}

export default new BookingTrackingService();