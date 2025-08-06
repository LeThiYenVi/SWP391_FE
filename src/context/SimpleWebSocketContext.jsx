import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthContext } from './AuthContext';

const SimpleWebSocketContext = createContext();

export const useSimpleWebSocket = () => {
  const context = useContext(SimpleWebSocketContext);
  if (!context) {
    throw new Error('useSimpleWebSocket must be used within a SimpleWebSocketProvider');
  }
  return context;
};

export const SimpleWebSocketProvider = ({ children }) => {
  // Safely get auth context with error handling
  const authContext = useContext(AuthContext);

  // If AuthContext is not available, don't crash - just return children
  if (!authContext) {
    console.warn('SimpleWebSocketProvider: AuthContext not available yet');
    return children;
  }

  const user = authContext?.user;
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  // Connect to WebSocket
  const connect = () => {
    if (clientRef.current?.connected) {
      return;
    }
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
      },
      onDisconnect: () => {
        setConnected(false);
        // Clear all subscriptions
        subscriptionsRef.current = {};
      },
      onStompError: (frame) => {
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate();
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    if (clientRef.current) {

      
      // Unsubscribe from all topics
      Object.values(subscriptionsRef.current).forEach(subscription => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      });
      subscriptionsRef.current = {};
      
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
    }
  };

  // Subscribe to booking-specific topic
  const subscribeToBooking = (bookingId, onMessage) => {
    if (!clientRef.current?.connected) {
      return null;
    }

    const topic = `/topic/booking-updates/${bookingId}`;
    const subscriptionKey = `booking_${bookingId}`;

    // Check if already subscribed
    if (subscriptionsRef.current[subscriptionKey]) {
      return subscriptionsRef.current[subscriptionKey];
    }

    try {
      const subscription = clientRef.current.subscribe(topic, (message) => {
        try {
          const update = JSON.parse(message.body);

          if (onMessage) {
            onMessage(update);
          }
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

  // Unsubscribe from booking-specific topic
  const unsubscribeFromBooking = (bookingId) => {
    const subscriptionKey = `booking_${bookingId}`;
    const subscription = subscriptionsRef.current[subscriptionKey];
    
    if (subscription) {
      subscription.unsubscribe();
      delete subscriptionsRef.current[subscriptionKey];
    }
  };

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [user]);

  const value = {
    connected,
    subscribeToBooking,
    unsubscribeFromBooking,
    connect,
    disconnect
  };

  return (
    <SimpleWebSocketContext.Provider value={value}>
      {children}
    </SimpleWebSocketContext.Provider>
  );
};
