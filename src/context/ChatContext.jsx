import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';
import ChatService from '../services/ChatService';
import { toast } from 'react-toastify';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { connected: wsConnected } = useWebSocket();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  // Kết nối WebSocket cho chat
  useEffect(() => {
    if (isAuthenticated && user && wsConnected) {
      connectChatWebSocket();
    } else if (!isAuthenticated) {
      disconnectChatWebSocket();
    }

    return () => {
      disconnectChatWebSocket();
    };
  }, [isAuthenticated, user, wsConnected]);

  // Load conversations khi user thay đổi
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
      loadUnreadCount();
    }
  }, [isAuthenticated, user]);

  const connectChatWebSocket = () => {
    if (clientRef.current) return;

    console.log('🔌 Connecting to Chat WebSocket...');
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('Chat STOMP Debug:', str);
      },
      onConnect: (frame) => {
        console.log('✅ Chat WebSocket connected:', frame);
        subscribeToChatTopics();
      },
      onStompError: (frame) => {
        console.error('❌ Chat STOMP error:', frame.headers['message']);
      },
      onWebSocketError: (event) => {
        console.error('❌ Chat WebSocket error:', event);
      },
      onDisconnect: () => {
        console.log('🔌 Chat WebSocket disconnected');
      }
    });

    clientRef.current = client;
    client.activate();
  };

  const disconnectChatWebSocket = () => {
    if (clientRef.current) {
      console.log('🔌 Disconnecting Chat WebSocket...');
      
      Object.values(subscriptionsRef.current).forEach(subscription => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current = {};
      
      clientRef.current.deactivate();
      clientRef.current = null;
    }
  };

  const subscribeToChatTopics = () => {
    if (!clientRef.current || !user) return;

    const client = clientRef.current;

    // Subscribe tới tin nhắn chat
    subscriptionsRef.current.chat = client.subscribe(`/user/${user.id}/queue/chat`, (message) => {
      const chatMessage = JSON.parse(message.body);
      handleNewMessage(chatMessage);
    });

    // Subscribe tới xác nhận tin nhắn
    subscriptionsRef.current.confirm = client.subscribe(`/user/${user.id}/queue/chat/confirm`, (message) => {
      const chatMessage = JSON.parse(message.body);
      handleMessageConfirmation(chatMessage);
    });

    // Subscribe tới thông báo typing
    subscriptionsRef.current.typing = client.subscribe(`/user/${user.id}/queue/chat/typing`, (message) => {
      const typingUser = message.body;
      handleTypingNotification(typingUser);
    });

    // Subscribe tới thông báo đã đọc
    subscriptionsRef.current.read = client.subscribe(`/user/${user.id}/queue/chat/read`, (message) => {
      const readNotification = message.body;
      handleReadNotification(readNotification);
    });

    // Subscribe tới lỗi
    subscriptionsRef.current.error = client.subscribe(`/user/${user.id}/queue/chat/error`, (message) => {
      const error = message.body;
      toast.error(error);
    });

    console.log('📱 Subscribed to chat topics');
  };

  const handleNewMessage = (message) => {
    console.log('📨 New chat message:', message);
    
    // Thêm tin nhắn vào state
    setMessages(prev => [...prev, message]);
    
    // Cập nhật conversation
    updateConversationWithMessage(message);
    
    // Tăng unread count nếu không phải tin nhắn của mình
    if (message.senderId !== user.id) {
      setUnreadCount(prev => prev + 1);
      toast.info(`Tin nhắn mới từ ${message.senderName}`);
    }
  };

  const handleMessageConfirmation = (message) => {
    console.log('✅ Message confirmed:', message);
    // Có thể cập nhật trạng thái tin nhắn nếu cần
  };

  const handleTypingNotification = (typingUser) => {
    console.log('⌨️ Typing notification:', typingUser);
    setTypingUsers(prev => new Set([...prev, typingUser]));
    
    // Tự động xóa typing indicator sau 3 giây
    setTimeout(() => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(typingUser);
        return newSet;
      });
    }, 3000);
  };

  const handleReadNotification = (readNotification) => {
    console.log('👁️ Read notification:', readNotification);
    // Có thể cập nhật trạng thái tin nhắn đã đọc
  };

  const updateConversationWithMessage = (message) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if ((conv.userId === message.senderId && conv.consultantId === message.receiverId) ||
            (conv.userId === message.receiverId && conv.consultantId === message.senderId)) {
          return {
            ...conv,
            lastMessage: message.content,
            lastMessageTime: message.createdAt,
            unreadCount: message.senderId !== user.id ? conv.unreadCount + 1 : conv.unreadCount
          };
        }
        return conv;
      });
      return updated;
    });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await ChatService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Không thể tải danh sách chat');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await ChatService.getUnreadMessageCount();
      if (response.success) {
        setUnreadCount(response.data);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      setLoading(true);
      const response = await ChatService.getMessages(otherUserId);
      if (response.success) {
        setMessages(response.data);
        
        // Đánh dấu tin nhắn đã đọc
        await ChatService.markMessagesAsRead(otherUserId);
        
        // Cập nhật unread count
        loadUnreadCount();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId, content) => {
    try {
      const response = await ChatService.sendMessage(receiverId, content);
      if (response.success) {
        // Tin nhắn sẽ được thêm qua WebSocket
        return response.data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
      throw error;
    }
  };

  const sendTypingNotification = (receiverId) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: '/app/chat.typing',
        body: receiverId.toString()
      });
    }
  };

  const markAsRead = async (senderId) => {
    try {
      await ChatService.markMessagesAsRead(senderId);
      
      // Gửi thông báo đã đọc qua WebSocket
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.publish({
          destination: '/app/chat.read',
          body: senderId.toString()
        });
      }
      
      // Cập nhật unread count
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    
    // Xác định otherUserId
    const otherUserId = user.role === 'ROLE_CONSULTANT' ? conversation.userId : conversation.consultantId;
    
    // Load tin nhắn
    await loadMessages(otherUserId);
    
    // Đánh dấu đã đọc
    await markAsRead(otherUserId);
  };

  const createConversation = async (consultantId) => {
    try {
      const response = await ChatService.getOrCreateConversation(consultantId);
      if (response.success) {
        const conversation = response.data;
        setConversations(prev => [conversation, ...prev]);
        await selectConversation(conversation);
        return conversation;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện');
      throw error;
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    loading,
    typingUsers,
    sendMessage,
    sendTypingNotification,
    selectConversation,
    createConversation,
    markAsRead,
    loadConversations,
    loadUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 