import instance from './customize-axios';

const ChatService = {
  // Gửi tin nhắn
  sendMessage: async (receiverId, content, messageType = 'TEXT') => {
    try {
      const response = await instance.post('/api/chat/send', {
        receiverId,
        content,
        messageType
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Lấy tin nhắn giữa 2 user
  getMessages: async (otherUserId) => {
    try {
      const response = await instance.get(`/api/chat/messages/${otherUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Lấy tin nhắn với pagination
  getMessagesWithPagination: async (otherUserId, page = 0, size = 20) => {
    try {
      const response = await instance.get(`/api/chat/messages/${otherUserId}/page?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages with pagination:', error);
      throw error;
    }
  },

  // Đánh dấu tin nhắn đã đọc
  markMessagesAsRead: async (senderId) => {
    try {
      const response = await instance.post(`/api/chat/read/${senderId}`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Lấy danh sách conversation
  getConversations: async () => {
    try {
      const response = await instance.get('/api/chat/conversations');
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  // Tạo hoặc lấy conversation
  getOrCreateConversation: async (consultantId) => {
    try {
      const response = await instance.post(`/api/chat/conversations/${consultantId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw error;
    }
  },

  // Lấy số tin nhắn chưa đọc
  getUnreadMessageCount: async () => {
    try {
      const response = await instance.get('/api/chat/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      throw error;
    }
  },

  // Lấy tin nhắn chưa đọc
  getUnreadMessages: async () => {
    try {
      const response = await instance.get('/api/chat/unread-messages');
      return response.data;
    } catch (error) {
      console.error('Error getting unread messages:', error);
      throw error;
    }
  }
};

export default ChatService; 