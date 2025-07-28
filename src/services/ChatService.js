import axios from 'axios';
import { API_BASE_URL } from '../config';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

class ChatService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Lấy danh sách conversations
  async getConversations() {
    try {
      const response = await this.api.get('/api/chat/conversations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách conversations');
    }
  }

  // Lấy danh sách customers (cho consultant)
  async getCustomers() {
    try {
      const response = await this.api.get('/api/chat/customers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách customers');
    }
  }

  // Lấy danh sách consultants (cho customer)
  async getConsultants() {
    try {
      const response = await this.api.get('/api/chat/consultants');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách consultants');
    }
  }

  // Tạo conversation mới
  async createConversation(consultantId, initialMessage = '') {
    try {
      const response = await this.api.post('/api/chat/conversations', {
        consultantId,
        initialMessage
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo conversation');
    }
  }

  // Gửi tin nhắn
  async sendMessage(conversationId, content, messageType = 'TEXT') {
    try {
      const response = await this.api.post('/api/chat/messages', {
        conversationId,
        content,
        messageType
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi gửi tin nhắn');
    }
  }

  // Lấy tin nhắn trong conversation
  async getMessages(conversationId) {
    try {
      const response = await this.api.get(`/api/chat/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy tin nhắn');
    }
  }

  // Đánh dấu conversation đã đọc
  async markConversationAsRead(conversationId) {
    try {
      const response = await this.api.post(`/api/chat/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi đánh dấu đã đọc');
    }
  }
}

export default new ChatService();
