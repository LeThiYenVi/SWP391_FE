import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import GlobalNotificationToast from '../components/GlobalNotificationToast';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  // Kết nối WebSocket khi user đăng nhập
  useEffect(() => {
    if (isAuthenticated && user && !connected) {
      connectWebSocket();
    } else if (!isAuthenticated && connected) {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, user]);

  const connectWebSocket = () => {
    if (clientRef.current && connected) return;

    console.log('🔌 Connecting to WebSocket...');
    
    const client = new Client({
      brokerURL: undefined, // Sử dụng SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: (frame) => {
        console.log('✅ WebSocket connected:', frame);
        setConnected(true);
        subscribeToTopics();
        toast.success('Đã kết nối thông báo real-time!');
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        toast.error('Lỗi kết nối WebSocket');
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event);
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected');
        setConnected(false);
        setNotifications([]);
      }
    });

    clientRef.current = client;
    client.activate();
  };

  const disconnectWebSocket = () => {
    if (clientRef.current) {
      console.log('🔌 Disconnecting WebSocket...');
      
      // Unsubscribe tất cả subscriptions
      Object.values(subscriptionsRef.current).forEach(subscription => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current = {};
      
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
      setNotifications([]);
    }
  };

  const subscribeToTopics = () => {
    if (!clientRef.current || !user) return;

    const client = clientRef.current;

    // Subscribe theo role của user
    if (user.role === 'ROLE_CUSTOMER' || user.role === 'customer') {
      // Customer subscribe tới general updates và private queue
      subscriptionsRef.current.general = client.subscribe('/topic/booking-updates', (message) => {
        const update = JSON.parse(message.body);
        handleBookingUpdate(update);
      });

      // Subscribe tới private queue cho customer này
      subscriptionsRef.current.private = client.subscribe(`/user/${user.id}/queue/booking-updates`, (message) => {
        const update = JSON.parse(message.body);
        handleBookingUpdate(update, true); // true = private message
      });

      console.log('📱 Customer subscribed to booking updates');
    }

    if (user.role === 'ROLE_STAFF' || user.role === 'staff' || 
        user.role === 'ROLE_ADMIN' || user.role === 'admin') {
      // Staff/Admin subscribe tới staff updates
      subscriptionsRef.current.staff = client.subscribe('/topic/staff/booking-updates', (message) => {
        const update = JSON.parse(message.body);
        handleBookingUpdate(update);
      });

      // Cũng subscribe tới general updates
      subscriptionsRef.current.general = client.subscribe('/topic/booking-updates', (message) => {
        const update = JSON.parse(message.body);
        handleBookingUpdate(update);
      });

      console.log('👨‍💼 Staff/Admin subscribed to booking updates');
    }
  };

  const handleBookingUpdate = (update, isPrivate = false) => {
    try {
      console.log('📨 Received booking update:', update);

      // Thêm notification vào state
      const notification = {
        id: Date.now(),
        ...update,
        isPrivate,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Giữ tối đa 50 notifications

      // Chỉ hiển thị simple toast, không dùng GlobalNotificationToast để tránh lỗi
      if (update.status && update.message && update.bookingId) {
        const toastMessage = `Booking #${update.bookingId}: ${update.message}`;
        switch (update.status) {
          case 'CONFIRMED':
          case 'SAMPLE_COLLECTED':
          case 'COMPLETED':
          case 'Results Ready':
            toast.success(toastMessage);
            break;
          case 'CANCELLED':
            toast.error(toastMessage);
            break;
          default:
            toast.info(toastMessage);
        }
      }
    } catch (error) {
      console.error('Error handling booking update:', error);
      toast.error('Có lỗi khi xử lý thông báo cập nhật');
    }
  };

  // Subscribe tới booking cụ thể
  const subscribeToBooking = (bookingId, onMessage) => {
    if (!clientRef.current || !connected) return null;

    const subscriptionKey = `booking_${bookingId}`;
    if (subscriptionsRef.current[subscriptionKey]) {
      return subscriptionsRef.current[subscriptionKey];
    }

    const subscription = clientRef.current.subscribe(`/topic/booking-updates/${bookingId}`, (message) => {
      const update = JSON.parse(message.body);
      if (onMessage) onMessage(update);
      handleBookingUpdate(update);
    });

    subscriptionsRef.current[subscriptionKey] = subscription;
    console.log(`📱 Subscribed to booking #${bookingId}`);
    return subscription;
  };

  // Unsubscribe khỏi booking cụ thể
  const unsubscribeFromBooking = (bookingId) => {
    const subscriptionKey = `booking_${bookingId}`;
    const subscription = subscriptionsRef.current[subscriptionKey];
    
    if (subscription) {
      subscription.unsubscribe();
      delete subscriptionsRef.current[subscriptionKey];
      console.log(`📱 Unsubscribed from booking #${bookingId}`);
    }
  };

  // Gửi message qua WebSocket
  const sendMessage = (destination, message) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message)
      });
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    connected,
    notifications,
    subscribeToBooking,
    unsubscribeFromBooking,
    sendMessage,
    markAsRead,
    clearNotifications,
    connectWebSocket,
    disconnectWebSocket
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
      {/* Tạm thời disable GlobalNotificationToast để tránh crash */}
      {/* {currentToast && (
        <GlobalNotificationToast
          notification={currentToast}
          onClose={() => setCurrentToast(null)}
        />
      )} */}
    </WebSocketContext.Provider>
  );
};
