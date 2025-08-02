import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocketCompat';
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
  const { connected: wsConnected, sendMessage: wsSendMessage } = useWebSocket();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  // Sử dụng ref để tránh infinite loop
  const hasLoadedRef = useRef(false);

  // ✅ TẠMTHỜI DISABLE CHAT CONTEXT ĐỂ TRÁNH INFINITE LOOP
  // Load conversations khi user thay đổi - chỉ load một lần
  useEffect(() => {
    // ❌ Tạm thời disable để tránh gọi API chat
    console.log('🚫 ChatContext disabled - không load conversations');

    if (!isAuthenticated) {
      hasLoadedRef.current = false;
      setConversations([]);
      setMessages([]);
    }

    return () => {
      if (!isAuthenticated) {
        hasLoadedRef.current = false;
      }
    };
  }, [isAuthenticated]); // ✅ Chỉ phụ thuộc vào isAuthenticated để tránh re-render khi user object thay đổi

  // Subscribe tới chat topics khi WebSocket connected
  useEffect(() => {
    if (wsConnected && user) {
      subscribeToChatTopics();
    }
  }, [wsConnected, user?.id]);

  const subscribeToChatTopics = () => {
    // Sử dụng WebSocketContext thay vì tạo connection riêng
    console.log('📱 Subscribing to chat topics via WebSocketContext');
    
    // Chat topics sẽ được handle qua WebSocketContext
    // Không cần tạo connection riêng nữa
  };

  const handleNewMessage = (message) => {
    console.log('📨 New chat message:', message);
    
    // Kiểm tra xem tin nhắn đã tồn tại chưa (tránh duplicate)
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === message.id);
      if (!exists) {
        return [...prev, message];
      }
      return prev;
    });
    
    // Cập nhật conversation
    updateConversationWithMessage(message);
    
    // Hiển thị thông báo nếu không phải tin nhắn của mình
    if (message.senderId !== user.id) {
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
      
      // Interceptor đã extract data từ ApiResponse, nên response bây giờ là mảng trực tiếp
      if (Array.isArray(response) && response.length > 0) {
        setConversations(response);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
      toast.error('Không thể tải danh sách chat');
    } finally {
      setLoading(false);
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
      // Gửi tin nhắn qua WebSocket
      if (wsConnected) {
        const message = {
          receiverId: receiverId,
          content: content,
          messageType: 'TEXT'
        };
        
        wsSendMessage(message);
        
        // Tạo tin nhắn tạm thời để hiển thị ngay lập tức
        const tempMessage = {
          id: Date.now(),
          senderId: user.id,
          senderName: user.fullName,
          senderRole: user.role,
          receiverId: receiverId,
          content: content,
          messageType: 'TEXT',
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        // Thêm tin nhắn vào state ngay lập tức
        setMessages(prev => [...prev, tempMessage]);
        
        return true;
      } else {
        // Fallback: gửi qua REST API nếu WebSocket không kết nối
        const response = await ChatService.sendMessage(receiverId, content);
        if (response.success) {
          return response.data;
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
      throw error;
    }
  };

  const sendTypingNotification = (receiverId) => {
    if (wsConnected) {
      wsSendMessage({
        destination: '/app/chat.typing',
        body: receiverId.toString()
      });
    }
  };

  const markAsRead = async (senderId) => {
    try {
      await ChatService.markMessagesAsRead(senderId);
      
      // Gửi thông báo đã đọc qua WebSocket
      if (wsConnected) {
        wsSendMessage({
          destination: '/app/chat.read',
          body: senderId.toString()
        });
      }
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
        // Gọi loadConversations để cập nhật sidebar
        await loadConversations();
        return conversation;
      }
    } catch (error) {
      toast.error('Không thể tạo cuộc trò chuyện');
      throw error;
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    typingUsers,
    sendMessage,
    sendTypingNotification,
    selectConversation,
    createConversation,
    markAsRead,
    loadConversations
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 