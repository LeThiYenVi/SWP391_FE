import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Star,
  Clock,
  CheckCircle,
  Circle,
  Filter,
  User,
  Image,
  File,
  Mic,
  X,
} from 'lucide-react';
import './ConsultantMessages.css';

const ConsultantMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      patientName: 'Nguyễn Thị Mai',
      patientAge: 28,
      patientPhone: '0901234567',
      patientEmail: 'mai.nguyen@email.com',
      lastMessage: 'Cảm ơn bác sĩ đã tư vấn chi tiết cho em',
      timestamp: '2 phút trước',
      unreadCount: 0,
      status: 'online',
      avatar: '/images/patient1.jpg',
      isArchived: false,
      isStarred: true,
      consultationHistory: [
        { date: '2024-01-10', type: 'video', status: 'completed' },
        { date: '2024-01-05', type: 'chat', status: 'completed' },
      ],
      messages: [
        {
          id: 1,
          text: 'Chào bác sĩ, em muốn tư vấn về chu kỳ kinh nguyệt',
          sender: 'patient',
          timestamp: '10:30',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 2,
          text: 'Chào em! Bác sĩ có thể giúp em tư vấn. Em có thể mô tả chi tiết về vấn đề đang gặp phải không?',
          sender: 'consultant',
          timestamp: '10:32',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 3,
          text: 'Dạ, em thấy chu kỳ không đều trong 3 tháng gần đây. Có khi sớm có khi muộn 7-10 ngày',
          sender: 'patient',
          timestamp: '10:35',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 4,
          text: 'Em có thay đổi gì về lối sống, stress hay chế độ ăn uống gần đây không?',
          sender: 'consultant',
          timestamp: '10:37',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 5,
          text: 'Dạ có, em đang trong thời gian chuẩn bị thi và stress khá nhiều',
          sender: 'patient',
          timestamp: '10:40',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 6,
          text: 'Stress là một trong những nguyên nhân chính gây rối loạn chu kỳ kinh nguyệt. Em nên thực hiện một số biện pháp để giảm stress và theo dõi chu kỳ thêm 1-2 tháng nữa.',
          sender: 'consultant',
          timestamp: '10:42',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 7,
          text: 'Cảm ơn bác sĩ đã tư vấn chi tiết cho em',
          sender: 'patient',
          timestamp: '10:45',
          date: '2024-01-15',
          status: 'read',
        },
      ],
    },
    {
      id: 2,
      patientName: 'Trần Thị Lan',
      patientAge: 32,
      patientPhone: '0901234568',
      patientEmail: 'lan.tran@email.com',
      lastMessage: 'Bác sĩ ơi, em muốn hỏi thêm về...',
      timestamp: '15 phút trước',
      unreadCount: 2,
      status: 'offline',
      avatar: '/images/patient2.jpg',
      isArchived: false,
      isStarred: false,
      consultationHistory: [
        { date: '2024-01-12', type: 'phone', status: 'completed' },
      ],
      messages: [
        {
          id: 1,
          text: 'Chào bác sĩ, em cần tư vấn về kế hoạch hóa gia đình',
          sender: 'patient',
          timestamp: '14:20',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 2,
          text: 'Em có thể chia sẻ thêm về tình hình hiện tại và mong muốn của em không?',
          sender: 'consultant',
          timestamp: '14:22',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 3,
          text: 'Bác sĩ ơi, em muốn hỏi thêm về các biện pháp tránh thai an toàn',
          sender: 'patient',
          timestamp: '14:25',
          date: '2024-01-15',
          status: 'delivered',
        },
      ],
    },
    {
      id: 3,
      patientName: 'Lê Thị Hoa',
      patientAge: 25,
      patientPhone: '0901234569',
      patientEmail: 'hoa.le@email.com',
      lastMessage: 'Em đã làm theo lời khuyên của bác sĩ',
      timestamp: '1 giờ trước',
      unreadCount: 0,
      status: 'online',
      avatar: '/images/patient3.jpg',
      isArchived: false,
      isStarred: false,
      consultationHistory: [
        { date: '2024-01-14', type: 'video', status: 'completed' },
        { date: '2024-01-08', type: 'chat', status: 'completed' },
      ],
      messages: [
        {
          id: 1,
          text: 'Chào bác sĩ, em muốn tư vấn về thai sản',
          sender: 'patient',
          timestamp: '13:00',
          date: '2024-01-15',
          status: 'read',
        },
        {
          id: 2,
          text: 'Em đã làm theo lời khuyên của bác sĩ và cảm thấy tốt hơn nhiều',
          sender: 'patient',
          timestamp: '13:15',
          date: '2024-01-15',
          status: 'read',
        },
      ],
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && conv.unreadCount > 0) ||
      (filterStatus === 'starred' && conv.isStarred) ||
      (filterStatus === 'archived' && conv.isArchived);
    return matchesSearch && matchesFilter;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'consultant',
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: new Date().toISOString().split('T')[0],
        status: 'sent',
      };

      // Update selected chat messages
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      setMessage('');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = status => {
    switch (status) {
      case 'sent':
        return <Circle size={12} />;
      case 'delivered':
        return <CheckCircle size={12} />;
      case 'read':
        return <CheckCircle size={12} className="read" />;
      default:
        return null;
    }
  };

  const renderMessage = msg => (
    <div key={msg.id} className={`message ${msg.sender}`}>
      <div className="message-content">
        <p>{msg.text}</p>
        <div className="message-meta">
          <span className="message-time">{msg.timestamp}</span>
          {msg.sender === 'consultant' && (
            <span className="message-status">
              {getMessageStatusIcon(msg.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="consultant-messages">
      {/* Conversations List */}
      <div className="conversations-sidebar">
        <div className="conversations-header">
          <h2>Tin nhắn</h2>
          <div className="conversations-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="conversations-filter">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="unread">Chưa đọc</option>
              <option value="starred">Đã đánh dấu</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        <div className="conversations-list">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${
                selectedChat?.id === conv.id ? 'active' : ''
              }`}
              onClick={() => setSelectedChat(conv)}
            >
              <div className="conversation-avatar">
                <img src={conv.avatar} alt={conv.patientName} />
                <div className={`status-indicator ${conv.status}`}></div>
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h4>{conv.patientName}</h4>
                  <span className="conversation-time">{conv.timestamp}</span>
                </div>
                <div className="conversation-preview">
                  <p>{conv.lastMessage}</p>
                  <div className="conversation-badges">
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                    {conv.isStarred && <Star size={14} className="starred" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="chat-avatar">
                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.patientName}
                  />
                  <div
                    className={`status-indicator ${selectedChat.status}`}
                  ></div>
                </div>
                <div className="chat-details">
                  <h3>{selectedChat.patientName}</h3>
                  <p className="patient-status">
                    {selectedChat.status === 'online'
                      ? 'Đang trực tuyến'
                      : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="chat-action-btn">
                  <Phone size={20} />
                </button>
                <button className="chat-action-btn">
                  <Video size={20} />
                </button>
                <button
                  className="chat-action-btn"
                  onClick={() => setShowChatInfo(!showChatInfo)}
                >
                  <Info size={20} />
                </button>
                <button className="chat-action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {selectedChat.messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="chat-input">
              <button className="attachment-btn">
                <Paperclip size={20} />
              </button>
              <div className="message-input-container">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  rows="1"
                />
                <button className="emoji-btn">
                  <Smile size={20} />
                </button>
              </div>
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">
                <User size={64} />
              </div>
              <h3>Chọn một cuộc trò chuyện</h3>
              <p>
                Chọn một bệnh nhân từ danh sách bên trái để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Info Panel */}
      {showChatInfo && selectedChat && (
        <div className="chat-info-panel">
          <div className="chat-info-header">
            <h3>Thông tin bệnh nhân</h3>
            <button
              className="close-info-btn"
              onClick={() => setShowChatInfo(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="chat-info-content">
            <div className="patient-profile">
              <img src={selectedChat.avatar} alt={selectedChat.patientName} />
              <h4>{selectedChat.patientName}</h4>
              <p>{selectedChat.patientAge} tuổi</p>
              <div className="patient-contact">
                <p>
                  <Phone size={16} /> {selectedChat.patientPhone}
                </p>
                <p>
                  <Smile size={16} /> {selectedChat.patientEmail}
                </p>
              </div>
            </div>

            <div className="consultation-history">
              <h5>Lịch sử tư vấn</h5>
              {selectedChat.consultationHistory.map((consultation, index) => (
                <div key={index} className="consultation-item">
                  <div className="consultation-date">
                    <Clock size={14} />
                    {consultation.date}
                  </div>
                  <div className="consultation-type">
                    {consultation.type === 'video' && <Video size={14} />}
                    {consultation.type === 'phone' && <Phone size={14} />}
                    {consultation.type === 'chat' && <User size={14} />}
                    {consultation.type}
                  </div>
                  <div className={`consultation-status ${consultation.status}`}>
                    {consultation.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-actions-panel">
              <button
                className={`action-btn ${
                  selectedChat.isStarred ? 'active' : ''
                }`}
              >
                <Star size={16} />
                {selectedChat.isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu'}
              </button>
              <button className="action-btn">
                <Archive size={16} />
                Lưu trữ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantMessages;
