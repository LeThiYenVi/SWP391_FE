import React from 'react';

const ConversationsList = ({ 
  conversations, 
  onConversationSelected, 
  onCreateNewConversation, 
  onRefresh 
}) => {

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getUnreadCount = (conversation, userRole) => {
    if (userRole === 'ROLE_CUSTOMER') {
      return conversation.customerUnreadCount || 0;
    } else {
      return conversation.consultantUnreadCount || 0;
    }
  };

  const getOtherPersonInfo = (conversation, userRole) => {
    if (userRole === 'ROLE_CUSTOMER') {
      return {
        name: conversation.consultantName,
        avatar: conversation.consultantAvatar,
        specialization: conversation.consultantSpecialization
      };
    } else {
      return {
        name: conversation.customerName,
        avatar: conversation.customerAvatar,
        specialization: null
      };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Tin nhắn</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Làm mới"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onCreateNewConversation}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Tạo mới
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg mb-2">Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm text-center mb-4">Bắt đầu cuộc trò chuyện đầu tiên của bạn</p>
            <button
              onClick={onCreateNewConversation}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Bắt đầu chat
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => {
              const userRole = localStorage.getItem('userRole') || 'ROLE_CUSTOMER';
              const otherPerson = getOtherPersonInfo(conversation, userRole);
              const unreadCount = getUnreadCount(conversation, userRole);

              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelected(conversation.id)}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {otherPerson.avatar ? (
                        <img 
                          src={otherPerson.avatar} 
                          alt={otherPerson.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {otherPerson.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {otherPerson.name || 'Người dùng'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    {otherPerson.specialization && (
                      <p className="text-xs text-green-600 mb-1">
                        {otherPerson.specialization}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || 'Chưa có tin nhắn'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
