/**
 * WORKFLOW: Legacy BookingTrackingService - DEPRECATED
 *
 * MỤC ĐÍCH:
 * - Service cũ để tracking booking qua WebSocket
 * - Hiện tại đã deprecated, thay thế bằng WebSocketContext + useWebSocket hook
 * - Giữ lại để tương thích với code cũ (backward compatibility)
 *
 * KIẾN TRÚC MỚI:
 * - WebSocketContext: Global WebSocket connection management
 * - useWebSocket hook: Component-level WebSocket operations
 * - BookingTrackingService: Legacy wrapper (deprecated)
 *
 * WORKFLOW TRACKING:
 * 1. Customer mở trang tracking
 * 2. useWebSocket hook tự động connect WebSocket
 * 3. Subscribe /topic/booking/{bookingId}
 * 4. Nhận real-time updates từ backend
 * 5. Auto-cleanup khi unmount component
 */

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