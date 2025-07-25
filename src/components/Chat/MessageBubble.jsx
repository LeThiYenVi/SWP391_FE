import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import './MessageBubble.css';

const MessageBubble = ({ message, isOwnMessage }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = () => {
    if (isOwnMessage) {
      if (message.isRead) {
        return <CheckCircle size={12} className="read" />;
      } else {
        return <Clock size={12} className="sent" />;
      }
    }
    return null;
  };

  return (
    <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        <div className="message-meta">
          <span className="message-time">
            {formatTime(message.createdAt)}
          </span>
          {getMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 