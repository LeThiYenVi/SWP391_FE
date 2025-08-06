import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useWebSocket } from '../../hooks/useWebSocketCompat';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ChatPage.css';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const {
    connected,
    subscribeToConversation,
    unsubscribeFromConversation,
    sendMessage: wsSendMessage
  } = useWebSocket();

  // States
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [availableConsultants, setAvailableConsultants] = useState([]);
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const conversationSubscriptionRef = useRef(null);

  // Debug user object
  useEffect(() => {
    console.log('Current user object:', user);
  }, [user]);

  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadConversations(),
        loadAvailableConsultants()
      ]);
      // Không cần tạo WebSocket riêng, sử dụng global WebSocket
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Lỗi khi khởi tạo chat');
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to conversation khi chọn conversation
  useEffect(() => {
    if (selectedConversation && connected) {
      subscribeToSelectedConversation();
    }

    return () => {
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
        conversationSubscriptionRef.current = null;
      }
    };
  }, [selectedConversation, connected]);

  const subscribeToSelectedConversation = () => {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    // Unsubscribe previous conversation
    if (conversationSubscriptionRef.current) {
      conversationSubscriptionRef.current.unsubscribe();
    }

    // Subscribe to new conversation using global WebSocket
    conversationSubscriptionRef.current = subscribeToConversation(
      conversationId,
      (message) => {
        setMessages(prev => [...prev, message]);
        updateConversationLastMessage(conversationId, message);
      },
      (typingMsg) => {
        setTypingUser(typingMsg);
        setIsTyping(true);

        // Clear typing after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingUser('');
        }, 3000);
      },
      (readMsg) => {
        // Handle read notifications
      }
    );

    // Subscribe to typing notifications
    client.subscribe(`/topic/chat/conversation/${conversationId}/typing`, (message) => {
      const typingMsg = message.body;
      setTypingUser(typingMsg);
      setIsTyping(true);

      // Clear typing after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingUser('');
      }, 3000);
    });

    // Subscribe to read notifications
    client.subscribe(`/topic/chat/conversation/${conversationId}/read`, (message) => {
      console.log('Read notification:', message.body);
      // Update message status to read
      setMessages(prev => prev.map(msg => ({ ...msg, status: 'READ' })));
    });
  };

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Lỗi khi tải danh sách cuộc trò chuyện');
    }
  };

  const loadAvailableConsultants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/chat/customer/available-consultants', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAvailableConsultants(response.data.data);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
      toast.error('Lỗi khi tải danh sách tư vấn viên');
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Lỗi khi tải tin nhắn');
    }
  };

  const createConversation = async (consultantId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8080/api/chat/conversations?consultantId=${consultantId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const newConversation = response.data.data;
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setShowConsultantModal(false);
        toast.success('Tạo cuộc trò chuyện thành công');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Lỗi khi tạo cuộc trò chuyện');
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !connected) return;

    const messageData = {
      conversationId: selectedConversation.id,
      content: newMessage.trim(),
      messageType: 'TEXT'
    };

    // Send via global WebSocket
    wsSendMessage('/app/chat.send', messageData);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (!selectedConversation || !connected) return;

    wsSendMessage('/app/chat.typing', selectedConversation.id);
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);

    // Resubscribe to new conversation topics
    if (stompClientRef.current) {
      subscribeToTopics();
    }

    // Mark as read
    markAsRead(conversation.id);
  };

  const markAsRead = (conversationId) => {
    if (!stompClientRef.current) return;

    stompClientRef.current.publish({
      destination: '/app/chat.read',
      body: JSON.stringify(conversationId)
    });
  };

  const updateConversationLastMessage = (conversationId, message) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, lastMessage: message.content, lastMessageTime: message.createdAt }
        : conv
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!user) {
    return (
      <div className="chat-page">
        <div className="chat-login-required">
          <h2>🔐 Vui lòng đăng nhập</h2>
          <p>Bạn cần đăng nhập để sử dụng tính năng chat</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-page">
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Sidebar - Conversations List */}
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>💬 Tin nhắn</h3>
            {user.roleName === 'ROLE_CUSTOMER' && (
              <button
                className="new-chat-btn"
                onClick={() => setShowConsultantModal(true)}
              >
                ➕ Tư vấn mới
              </button>
            )}
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>Chưa có cuộc trò chuyện nào</p>
                {user.roleName === 'ROLE_CUSTOMER' && (
                  <button
                    className="start-chat-btn"
                    onClick={() => setShowConsultantModal(true)}
                  >
                    Bắt đầu chat với tư vấn viên
                  </button>
                )}
              </div>
            ) : (
              conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    <img
                      src={user.roleName === 'ROLE_CUSTOMER'
                        ? conversation.consultantAvatar || '/default-avatar.png'
                        : conversation.customerAvatar || '/default-avatar.png'
                      }
                      alt="Avatar"
                    />
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {user.roleName === 'ROLE_CUSTOMER'
                        ? conversation.consultantName
                        : conversation.customerName
                      }
                    </div>
                    <div className="conversation-last-message">
                      {conversation.lastMessage || 'Chưa có tin nhắn'}
                    </div>
                    <div className="conversation-time">
                      {conversation.lastMessageTime
                        ? new Date(conversation.lastMessageTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : ''
                      }
                    </div>
                  </div>
                  {((user.roleName === 'ROLE_CUSTOMER' && conversation.customerUnreadCount > 0) ||
                    (user.roleName === 'ROLE_CONSULTANT' && conversation.consultantUnreadCount > 0)) && (
                    <div className="unread-badge">
                      {user.roleName === 'ROLE_CUSTOMER'
                        ? conversation.customerUnreadCount
                        : conversation.consultantUnreadCount
                      }
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-main-header">
                <div className="chat-partner-info">
                  <img
                    src={user.roleName === 'ROLE_CUSTOMER'
                      ? selectedConversation.consultantAvatar || '/default-avatar.png'
                      : selectedConversation.customerAvatar || '/default-avatar.png'
                    }
                    alt="Avatar"
                    className="partner-avatar"
                  />
                  <div>
                    <div className="partner-name">
                      {user.roleName === 'ROLE_CUSTOMER'
                        ? selectedConversation.consultantName
                        : selectedConversation.customerName
                      }
                    </div>
                    {user.roleName === 'ROLE_CUSTOMER' && selectedConversation.consultantSpecialization && (
                      <div className="partner-specialization">
                        {selectedConversation.consultantSpecialization}
                      </div>
                    )}
                  </div>
                </div>
                <div className="chat-status">
                  {connected ? '🟢 Đang kết nối' : '🔴 Mất kết nối'}
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map(message => {
                    // Debug: Log để kiểm tra giá trị
                    console.log('Message senderId:', message.senderId, 'User id:', user.id, 'Types:', typeof message.senderId, typeof user.id);

                    // Xác định xem tin nhắn này có phải của user hiện tại không
                    // So sánh với cả string và number để tránh lỗi kiểu dữ liệu
                    const isOwnMessage = message.senderId === user.id || message.senderId === String(user.id) || String(message.senderId) === String(user.id);

                    // Xác định tên người gửi để hiển thị
                    const senderName = isOwnMessage
                      ? 'Bạn'
                      : (user.roleName === 'ROLE_CUSTOMER'
                          ? selectedConversation.consultantName
                          : selectedConversation.customerName);

                    return (
                      <div
                        key={message.id}
                        className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                      >
                        {/* Avatar cho tin nhắn của người khác */}
                        {!isOwnMessage && (
                          <div className="message-avatar">
                            <img
                              src={user.roleName === 'ROLE_CUSTOMER'
                                ? selectedConversation.consultantAvatar || '/default-avatar.png'
                                : selectedConversation.customerAvatar || '/default-avatar.png'
                              }
                              alt="Avatar"
                            />
                          </div>
                        )}

                        <div className="message-content">
                          {/* Hiển thị tên người gửi cho tin nhắn của người khác */}
                          {!isOwnMessage && (
                            <div className="message-sender-name">
                              {senderName}
                            </div>
                          )}

                          <div className="message-text">{message.content}</div>

                          <div className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        {/* Status chỉ hiển thị cho tin nhắn của mình */}
                        {isOwnMessage && (
                          <div className="message-status">
                            {message.status === 'READ' ? '✓✓' : '✓'}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isTyping && typingUser && (
                  <div className="typing-indicator">
                    <span>{typingUser}</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="message-input"
                    rows="1"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="send-button"
                  >
                    📤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <h3>💬 Chọn cuộc trò chuyện</h3>
              <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu chat</p>
            </div>
          )}
        </div>
      </div>

      {/* Consultant Selection Modal */}
      {showConsultantModal && (
        <div className="modal-overlay" onClick={() => setShowConsultantModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chọn tư vấn viên</h3>
              <button
                className="modal-close"
                onClick={() => setShowConsultantModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {availableConsultants.length === 0 ? (
                <p>Không có tư vấn viên nào có sẵn</p>
              ) : (
                <div className="consultants-list">
                  {availableConsultants.map(consultant => (
                    <div
                      key={consultant.consultantId}
                      className="consultant-item"
                      onClick={() => createConversation(consultant.consultantId)}
                    >
                      <img
                        src={consultant.consultantAvatar || '/default-avatar.png'}
                        alt="Avatar"
                        className="consultant-avatar"
                      />
                      <div className="consultant-info">
                        <div className="consultant-name">{consultant.consultantName}</div>
                        <div className="consultant-specialization">{consultant.consultantSpecialization}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;