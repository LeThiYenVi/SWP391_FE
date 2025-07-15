import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class BookingTrackingService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = {};
  }

  connect(onConnect) {
    if (this.connected) return;
    this.client = new Client({
      brokerURL: undefined, // Dùng SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: onConnect,
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
      }
    });
    this.client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
    };
    this.client.onDisconnect = () => {
      this.connected = false;
    };
    this.client.activate();
    this.connected = true;
  }

  subscribeBooking(bookingId, onMessage) {
    if (!this.client || !this.connected) return;
    if (this.subscriptions[bookingId]) return;
    this.subscriptions[bookingId] = this.client.subscribe(`/topic/booking-updates/${bookingId}`, (msg) => {
      const body = JSON.parse(msg.body);
      onMessage(body);
    });
  }

  unsubscribeBooking(bookingId) {
    if (this.subscriptions[bookingId]) {
      this.subscriptions[bookingId].unsubscribe();
      delete this.subscriptions[bookingId];
    }
  }

  disconnect() {
    if (this.client) {
      Object.keys(this.subscriptions).forEach((bookingId) => {
        this.unsubscribeBooking(bookingId);
      });
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export default new BookingTrackingService(); 