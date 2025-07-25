import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { MessageCircle, Clock, CheckCircle } from 'lucide-react';
import './ChatList.css';

const ChatList = ({ onSelectConversation }) => {
  const { conversations, loading, unreadCount } = useChat();
  const { user } = useAuth();

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getDisplayName = (conversation) => {
    if (user.role === 'ROLE_CONSULTANT') {
      return conversation.userName;
    } else {
      return conversation.consultantName;
    }
  };

  const getDisplayAvatar = (conversation) => {
    if (user.role === 'ROLE_CONSULTANT') {
      return conversation.userAvatar;
    } else {
      return conversation.consultantAvatar;
    }
  };

  if (loading) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <h3>Tin nhắn</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="chat-list-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h3>Tin nhắn</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </div>
      
      <div className="chat-list-content">
        {conversations.length === 0 ? (
          <div className="chat-list-empty">
            <MessageCircle size={48} />
            <p>Chưa có cuộc trò chuyện nào</p>
            <span>Bắt đầu chat với tư vấn viên để nhận hỗ trợ</span>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`chat-item ${conversation.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="chat-item-avatar">
                {getDisplayAvatar(conversation) ? (
                  <img src={getDisplayAvatar(conversation)} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {getDisplayName(conversation).charAt(0).toUpperCase()}
                  </div>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="unread-indicator">{conversation.unreadCount}</span>
                )}
              </div>
              
              <div className="chat-item-content">
                <div className="chat-item-header">
                  <h4>{getDisplayName(conversation)}</h4>
                  <span className="chat-time">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                
                <div className="chat-item-message">
                  <p>{conversation.lastMessage || 'Chưa có tin nhắn'}</p>
                  <div className="message-status">
                    {conversation.unreadCount > 0 ? (
                      <Clock size={12} />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList; 