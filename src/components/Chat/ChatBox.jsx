import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ChatService from '../../services/ChatService';

const ChatBox = ({ conversationId, onBackToList }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      markAsRead();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await ChatService.getMessages(conversationId);
      
      if (response.success && response.data) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await ChatService.markConversationAsRead(conversationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) {
      return;
    }

    try {
      setSending(true);
      setError('');
      
      const response = await ChatService.sendMessage(conversationId, newMessage.trim());
      
      if (response.success && response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      } else {
        setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const getOtherPersonName = () => {
    if (messages.length === 0) return 'Người dùng';
    
    const otherMessage = messages.find(msg => msg.senderId !== user?.id);
    return otherMessage?.senderName || 'Người dùng';
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <button
            onClick={onBackToList}
            className="mr-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {getOtherPersonName()}
            </h2>
            <p className="text-sm text-gray-500">
              {messages.length} tin nhắn
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {Object.keys(messageGroups).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg">Chưa có tin nhắn nào</p>
            <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          Object.keys(messageGroups).map(dateKey => (
            <div key={dateKey}>
              {/* Date separator */}
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {formatDate(new Date(dateKey))}
                </span>
              </div>
              
              {/* Messages for this date */}
              {messageGroups[dateKey].map((message, index) => {
                const isOwnMessage = message.senderId === user?.id;
                const showAvatar = index === 0 || 
                  messageGroups[dateKey][index - 1].senderId !== message.senderId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
                        {showAvatar ? (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                            {message.senderAvatar ? (
                              <img 
                                src={message.senderAvatar} 
                                alt={message.senderName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-600 font-medium">
                                {message.senderName?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`px-4 py-2 rounded-lg ${
                        isOwnMessage 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
