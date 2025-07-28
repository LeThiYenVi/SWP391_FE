import React, { useState, useEffect } from 'react';
import ChatService from '../../services/ChatService';

const ChatInitializer = ({ onConversationCreated, onBackToList }) => {
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const userRole = localStorage.getItem('userRole') || 'ROLE_CUSTOMER';
  const isCustomer = userRole === 'ROLE_CUSTOMER';

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (isCustomer) {
        response = await ChatService.getConsultants();
      } else {
        response = await ChatService.getCustomers();
      }
      
      if (response.success && response.data) {
        setPeople(response.data);
      } else {
        setPeople([]);
      }
    } catch (error) {
      console.error('Error loading people:', error);
      setError('Không thể tải danh sách. Vui lòng thử lại.');
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!selectedPersonId) {
      setError('Vui lòng chọn người để bắt đầu trò chuyện');
      return;
    }

    try {
      setCreating(true);
      setError('');
      
      const response = await ChatService.createConversation(selectedPersonId, initialMessage);
      
      if (response.success && response.data) {
        onConversationCreated(response.data);
      } else {
        setError('Không thể tạo cuộc trò chuyện. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError(error.message || 'Không thể tạo cuộc trò chuyện. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={onBackToList}
            className="mr-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {isCustomer ? 'Chọn Consultant' : 'Chọn Customer'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {people.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="text-lg mb-2">
              {isCustomer ? 'Không có consultant nào' : 'Không có customer nào'}
            </p>
            <button
              onClick={loadPeople}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* People List */}
            <div className="grid gap-3">
              {people.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonId(person.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPersonId === person.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {person.profileImageUrl || person.avatarUrl ? (
                          <img 
                            src={person.profileImageUrl || person.avatarUrl} 
                            alt={person.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {person.fullName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {person.fullName || 'Người dùng'}
                      </h3>
                      {isCustomer && person.specialization && (
                        <p className="text-sm text-green-600">
                          {person.specialization}
                        </p>
                      )}
                      {isCustomer && person.experienceYears && (
                        <p className="text-sm text-gray-600">
                          {person.experienceYears} năm kinh nghiệm
                        </p>
                      )}
                      {!isCustomer && person.email && (
                        <p className="text-sm text-gray-600">
                          {person.email}
                        </p>
                      )}
                    </div>
                    {selectedPersonId === person.id && (
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Initial Message */}
            {selectedPersonId && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn đầu tiên (tùy chọn)
                </label>
                <textarea
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Nhập tin nhắn để bắt đầu cuộc trò chuyện..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Create Button */}
            {selectedPersonId && (
              <div className="mt-6">
                <button
                  onClick={handleCreateConversation}
                  disabled={creating}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {creating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </div>
                  ) : (
                    'Bắt đầu trò chuyện'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInitializer;
