import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const SimpleWebSocketContext = createContext();

export const useSimpleWebSocket = () => {
  const context = useContext(SimpleWebSocketContext);
  if (!context) {
    throw new Error('useSimpleWebSocket must be used within a SimpleWebSocketProvider');
  }
  return context;
};

export const SimpleWebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  // Connect to WebSocket
  const connect = () => {
    if (clientRef.current?.connected) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket...');
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ WebSocket connected');
        setConnected(true);
      },
      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
        setConnected(false);
        // Clear all subscriptions
        subscriptionsRef.current = {};
      },
      onStompError: (frame) => {
        console.error('❌ WebSocket STOMP error:', frame);
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate();
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    if (clientRef.current) {
      console.log('🔌 Disconnecting WebSocket...');
      
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
      console.warn('⚠️ WebSocket not connected, cannot subscribe to booking');
      return null;
    }

    const topic = `/topic/booking-updates/${bookingId}`;
    const subscriptionKey = `booking_${bookingId}`;

    // Check if already subscribed
    if (subscriptionsRef.current[subscriptionKey]) {
      console.log(`⚠️ Already subscribed to booking #${bookingId}`);
      return subscriptionsRef.current[subscriptionKey];
    }

    try {
      const subscription = clientRef.current.subscribe(topic, (message) => {
        try {
          const update = JSON.parse(message.body);
          console.log('📨 Received booking update:', update);
          
          if (onMessage) {
            onMessage(update);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      });

      subscriptionsRef.current[subscriptionKey] = subscription;
      console.log(`📱 Subscribed to booking #${bookingId} at topic: ${topic}`);
      return subscription;
    } catch (error) {
      console.error('❌ Error subscribing to booking:', error);
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
      console.log(`📱 Unsubscribed from booking #${bookingId}`);
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
