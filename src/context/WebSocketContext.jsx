import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
// import { toast } from 'react-toastify';
import GlobalNotificationToast from '../components/GlobalNotificationToast';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket phải được sử dụng trong WebSocketProvider');
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


    if (isAuthenticated && user && !clientRef.current) {
      // ✅ Delay connection để đảm bảo authentication stable
      setTimeout(() => {
        if (isAuthenticated && user) { // Double check
          connectWebSocket();
        }
      }, 1000);
    } else if (!isAuthenticated && clientRef.current) {
      disconnectWebSocket();
    }

    return () => {
      if (clientRef.current) {
        disconnectWebSocket();
      }
    };
  }, [isAuthenticated, user]);

  // Thêm cleanup khi component unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const connectWebSocket = () => {
    if (clientRef.current) {
      return;
    }

    // Lấy token từ localStorage
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser || !user || !isAuthenticated) {
      return;
    }

    const client = new Client({
      brokerURL: undefined, // Sử dụng SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      reconnectDelay: 0, // ✅ Tắt auto-reconnect để tránh loop
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {
        // Silent debug
      },
      onConnect: (frame) => {
        setConnected(true);
        subscribeToTopics();
      },
      onStompError: (frame) => {
        setConnected(false);
        // WebSocket error không có nghĩa là authentication failed
      },
      onWebSocketError: (event) => {
        // Silent error handling
      },
      onDisconnect: () => {
        setConnected(false);
        setNotifications([]);
      }
    });

    clientRef.current = client;
    client.activate();
  };

  const disconnectWebSocket = () => {
    if (clientRef.current) {
      
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

      // ✅ TẠMTHỜI DISABLE CHAT SUBSCRIPTIONS
      // Subscribe tới chat confirmations
      // subscriptionsRef.current.chatConfirm = client.subscribe(`/user/${user.username}/queue/chat/confirm`, (message) => {
      //   const chatMessage = JSON.parse(message.body);
      //   console.log('✅ Chat message confirmed:', chatMessage);
      // });

      // Subscribe tới chat errors
      // subscriptionsRef.current.chatError = client.subscribe(`/user/${user.username}/queue/chat/error`, (message) => {
      //   const error = message.body;
      //   console.error('❌ Chat error:', error);
      //   toast.error(error);
      // });


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


    }

    if (user.role === 'ROLE_CONSULTANT' || user.role === 'consultant') {
      // ✅ TẠMTHỜI DISABLE CONSULTANT CHAT SUBSCRIPTIONS
      // Consultant subscribe tới chat confirmations và errors
      // subscriptionsRef.current.chatConfirm = client.subscribe(`/user/${user.username}/queue/chat/confirm`, (message) => {
      //   const chatMessage = JSON.parse(message.body);
      //   console.log('✅ Chat message confirmed:', chatMessage);
      // });

      // subscriptionsRef.current.chatError = client.subscribe(`/user/${user.username}/queue/chat/error`, (message) => {
      //   const error = message.body;
      //   console.error('❌ Chat error:', error);
      //   toast.error(error);
      // });


    }
  };

  const handleBookingUpdate = (update, isPrivate = false) => {
    try {

      // Thêm notification vào state
      const notification = {
        id: Date.now(),
        ...update,
        isPrivate,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Giảm xuống 10 notifications

      // ✅ KHÔNG gọi bất kỳ API nào từ đây để tránh authentication issues
      // ✅ KHÔNG hiển thị toast để tránh spam
      // Chỉ update state, để component tự handle việc refresh data nếu cần

    } catch (error) {
      // Silent error handling
    }
  };

  // Subscribe tới booking cụ thể
  const subscribeToBooking = (bookingId, onMessage) => {
    if (!clientRef.current || !connected) return null;

    const subscriptionKey = `booking_${bookingId}`;
    if (subscriptionsRef.current[subscriptionKey]) {
      return subscriptionsRef.current[subscriptionKey];
    }

    try {
      const subscription = clientRef.current.subscribe(`/topic/booking-updates/${bookingId}`, (message) => {
        try {
          const update = JSON.parse(message.body);
          if (onMessage) {
            // ✅ Wrap onMessage trong try-catch để tránh crash
            try {
              onMessage(update);
            } catch (error) {
              // Silent error handling
            }
          }
          handleBookingUpdate(update);
        } catch (error) {
          // Silent error handling
        }
      });

      subscriptionsRef.current[subscriptionKey] = subscription;
      return subscription;
    } catch (error) {
      return null;
    }
  };

  // Unsubscribe khỏi booking cụ thể
  const unsubscribeFromBooking = (bookingId) => {
    const subscriptionKey = `booking_${bookingId}`;
    const subscription = subscriptionsRef.current[subscriptionKey];
    
    if (subscription) {
      subscription.unsubscribe();
      delete subscriptionsRef.current[subscriptionKey];
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

  // Subscribe tới conversation cụ thể cho chat
  const subscribeToConversation = (conversationId, onMessage, onTyping, onRead) => {
    if (!clientRef.current || !connected) return null;

    const subscriptionKey = `conversation_${conversationId}`;

    // Unsubscribe existing subscription if any
    if (subscriptionsRef.current[subscriptionKey]) {
      subscriptionsRef.current[subscriptionKey].unsubscribe();
    }

    // Subscribe to conversation messages
    const messageSubscription = clientRef.current.subscribe(`/topic/chat/conversation/${conversationId}`, (message) => {
      try {
        const chatMessage = JSON.parse(message.body);
        if (onMessage) {
          onMessage(chatMessage);
        }
      } catch (error) {
        // Silent error handling
      }
    });

    // Subscribe to typing notifications
    const typingSubscription = clientRef.current.subscribe(`/topic/chat/conversation/${conversationId}/typing`, (message) => {
      const typingMsg = message.body;
      if (onTyping) onTyping(typingMsg);
    });

    // Subscribe to read notifications
    const readSubscription = clientRef.current.subscribe(`/topic/chat/conversation/${conversationId}/read`, (message) => {
      const readMsg = message.body;
      if (onRead) onRead(readMsg);
    });

    // Store subscriptions
    subscriptionsRef.current[subscriptionKey] = {
      message: messageSubscription,
      typing: typingSubscription,
      read: readSubscription,
      unsubscribe: () => {
        messageSubscription.unsubscribe();
        typingSubscription.unsubscribe();
        readSubscription.unsubscribe();
      }
    };

    return subscriptionsRef.current[subscriptionKey];
  };

  // Unsubscribe khỏi conversation cụ thể
  const unsubscribeFromConversation = (conversationId) => {
    const subscriptionKey = `conversation_${conversationId}`;
    const subscription = subscriptionsRef.current[subscriptionKey];

    if (subscription) {
      subscription.unsubscribe();
      delete subscriptionsRef.current[subscriptionKey];
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
    subscribeToConversation,
    unsubscribeFromConversation,
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
