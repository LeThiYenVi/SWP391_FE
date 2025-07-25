import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import MessageBubble from './MessageBubble';
import './ChatWindow.css';

const ChatWindow = ({ conversation, onBack }) => {
  const { messages, sendMessage, sendTypingNotification, typingUsers } = useChat();
  const { user } = useAuth();
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;

    try {
      const otherUserId = user.role === 'ROLE_CONSULTANT' 
        ? conversation.userId 
        : conversation.consultantId;
      
      await sendMessage(otherUserId, newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      const otherUserId = user.role === 'ROLE_CONSULTANT' 
        ? conversation.userId 
        : conversation.consultantId;
      sendTypingNotification(otherUserId);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const getDisplayName = () => {
    if (user.role === 'ROLE_CONSULTANT') {
      return conversation.userName;
    } else {
      return conversation.consultantName;
    }
  };

  const getDisplayAvatar = () => {
    if (user.role === 'ROLE_CONSULTANT') {
      return conversation.userAvatar;
    } else {
      return conversation.consultantAvatar;
    }
  };

  const isTypingFromOther = () => {
    const otherUserId = user.role === 'ROLE_CONSULTANT' 
      ? conversation.userId 
      : conversation.consultantId;
    
    return Array.from(typingUsers).some(user => 
      user.includes(getDisplayName())
    );
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="chat-user-info">
            <div className="chat-user-avatar">
              {getDisplayAvatar() ? (
                <img src={getDisplayAvatar()} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="chat-user-details">
              <h4>{getDisplayName()}</h4>
              <span className="user-status">
                {isTypingFromOther() ? 'Đang nhập tin nhắn...' : 'Trực tuyến'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="chat-header-actions">
          <button className="action-button">
            <Phone size={18} />
          </button>
          <button className="action-button">
            <Video size={18} />
          </button>
          <button className="action-button">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="messages-empty">
            <div className="empty-icon">💬</div>
            <h3>Bắt đầu cuộc trò chuyện</h3>
            <p>Gửi tin nhắn đầu tiên để bắt đầu chat với {getDisplayName()}</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === user.id}
              />
            ))}
            {isTypingFromOther() && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">{getDisplayName()} đang nhập tin nhắn...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input-area">
        <div className="message-input-container">
          <textarea
            className="message-input"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 