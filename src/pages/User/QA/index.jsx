import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  Clock,
  User,
  Star,
  Plus,
  Tag,
  X,
  Heart,
  Calendar,
  HelpCircle,
  CheckCircle,
  Loader,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  submitQuestionAPI, 
  getUserQuestionsAPI, 
  getQuestionDetailsAPI,
  getFAQsAPI,
  searchQuestionsAPI,
  getPublicQuestionsAPI
} from '../../../services/QAService';
import './index.css';

const QA = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse'); // browse, myQuestions, ask
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionDetail, setShowQuestionDetail] = useState(false);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: 'general',
    isAnonymous: false,
  });

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'general', name: 'Tổng quát' },
    { id: 'contraception', name: 'Tránh thai' },
    { id: 'menstruation', name: 'Kinh nguyệt' },
    { id: 'pregnancy', name: 'Mang thai' },
    { id: 'sti', name: 'STIs' },
    { id: 'mental-health', name: 'Sức khỏe tâm lý' },
  ];

  // Load questions based on active tab
  useEffect(() => {
    loadQuestions();
  }, [activeTab, currentPage, searchQuery]);

  // Load questions when category changes (only for browse tab)
  useEffect(() => {
    if (activeTab === 'browse') {
      loadQuestions();
    }
  }, [selectedCategory]);

  // Auto refresh data every 30 seconds to check for new answers
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'browse' || activeTab === 'my-questions') {
        loadQuestions();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      let response;

      if (activeTab === 'my-questions') {
        // Load user's questions
        response = await getUserQuestionsAPI(user?.id, null, currentPage, 10);
      } else if (searchQuery.trim()) {
        // Search questions
        response = await searchQuestionsAPI(searchQuery, currentPage, 10);
      } else {
        // Load all questions for browse tab - sử dụng API public
        response = await getPublicQuestionsAPI(selectedCategory === 'all' ? null : selectedCategory, currentPage, 10);
      }

      console.log('QA Response:', response);
      console.log('Response structure:', {
        hasData: !!response?.data,
        hasContent: !!response?.content,
        dataKeys: response?.data ? Object.keys(response.data) : [],
        contentKeys: response?.content ? Object.keys(response.content) : []
      });

      // Service đã xử lý ApiResponse, chỉ cần lấy data trực tiếp
      if (response?.data) {
        const newQuestions = response.data.content || [];
        
        // Check for newly answered questions
        newQuestions.forEach(question => {
          if (question.status === 'ANSWERED' && !answeredQuestions.has(question.id)) {
            toast.success(`Câu hỏi "${question.content?.substring(0, 50)}..." đã được trả lời!`);
            setAnsweredQuestions(prev => new Set([...prev, question.id]));
          }
        });
        
        setQuestions(newQuestions);
        setTotalPages(response.data.totalPages || 1);
      } else if (response?.content) {
        // Fallback cho trường hợp response trực tiếp
        const newQuestions = response.content || [];
        
        // Check for newly answered questions
        newQuestions.forEach(question => {
          if (question.status === 'ANSWERED' && !answeredQuestions.has(question.id)) {
            toast.success(`Câu hỏi "${question.content?.substring(0, 50)}..." đã được trả lời!`);
            setAnsweredQuestions(prev => new Set([...prev, question.id]));
          }
        });
        
        setQuestions(newQuestions);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestion.content.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setSubmitting(true);
      const questionData = {
        content: newQuestion.content,
        userId: user?.id,
        category: newQuestion.category,
        isAnonymous: newQuestion.isAnonymous
      };

      await submitQuestionAPI(questionData);
      toast.success('Câu hỏi đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24h.');

      setNewQuestion({
        title: '',
        content: '',
        category: 'general',
        isAnonymous: false,
      });

      setShowAskQuestion(false);
      
      // Reload data ngay lập tức
      await loadQuestions();
      
      // Chuyển về tab "Câu hỏi của tôi" để người dùng thấy câu hỏi vừa tạo
      setActiveTab('my-questions');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Không thể gửi câu hỏi. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuestionClick = async (question) => {
    console.log('Question clicked:', question);
    console.log('Question ID:', question.id);
    
    // Force hiển thị modal ngay lập tức với data hiện tại
    setSelectedQuestion(question);
    setShowQuestionDetail(true);
    console.log('Modal forced to show immediately');
    
    try {
      const response = await getQuestionDetailsAPI(question.id);
      console.log('Question details response:', response);
      
      if (response?.data) {
        setSelectedQuestion(response.data);
        setShowQuestionDetail(true);
      } else if (response?.content) {
        setSelectedQuestion(response.content);
        setShowQuestionDetail(true);
      } else {
        setSelectedQuestion(question);
        setShowQuestionDetail(true);
      }
    } catch (error) {
      console.error('Error loading question details:', error);
      toast.error('Không thể tải chi tiết câu hỏi');
    }
  };

  const handleAskQuestion = () => {
    setShowAskQuestion(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Sử dụng trực tiếp questions từ API, không cần filter client-side
  const displayQuestions = questions;

  return (
    <div className="qa-container">
      {/* Header */}
      <div className="qa-header">
        <div className="qa-header-content">
          <h1 className="qa-title">Hỏi đáp</h1>
          <p className="qa-subtitle">
            Đặt câu hỏi và nhận tư vấn từ các chuyên gia của chúng tôi
          </p>
        </div>
      </div>

      <div className="qa-main">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px'}}>
            <button onClick={handleAskQuestion} className="ask-question-btn">
              <Plus className="w-5 h-5 mr-2" />
              Đặt câu hỏi mới
            </button>
            <button 
              onClick={loadQuestions} 
              className="ask-question-btn"
              style={{background: 'linear-gradient(135deg, #95a5a6, #7f8c8d)'}}
            >
              <Loader className="w-5 h-5 mr-2" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="qa-tabs">
          <button
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Tất cả câu hỏi
          </button>
          <button
            className={`tab-button ${
              activeTab === 'my-questions' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('my-questions')}
          >
            Câu hỏi của tôi
          </button>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <h2 className="section-title">Danh mục</h2>
          <div className="categories-grid">
            <div
              className={`category-card ${
                selectedCategory === 'all' ? 'selected' : ''
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              <HelpCircle className="category-icon" />
              <h3 className="category-name">Tất cả</h3>
              <p className="category-count">{questions.length} câu hỏi</p>
            </div>
            {categories.slice(1).map(category => (
              <div
                key={category.id}
                className={`category-card ${
                  selectedCategory === category.id ? 'selected' : ''
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <HelpCircle className="category-icon" />
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">
                  {
                    questions.filter(q => q.category === category.id)
                      .length
                  }{' '}
                  câu hỏi
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="questions-section">
          <h2 className="section-title">
            {activeTab === 'browse' 
              ? (selectedCategory === 'all' ? 'Tất cả câu hỏi' : categories.find(c => c.id === selectedCategory)?.name)
              : 'Câu hỏi của tôi'
            }
          </h2>
          
          {loading ? (
            <div className="loading-state">
              <Loader className="loading-icon animate-spin" />
              <p>Đang tải câu hỏi...</p>
            </div>
          ) : displayQuestions.length > 0 ? (
            <>
              <div className="questions-list">
                {displayQuestions.map(question => (
                  <div
                    key={question.id}
                    className="question-item"
                    onClick={() => handleQuestionClick(question)}
                    style={{
                      border: question.status === 'ANSWERED' && !answeredQuestions.has(question.id) 
                        ? '2px solid #27ae60' 
                        : '1px solid #e1e5e9'
                    }}
                  >
                    {question.status === 'ANSWERED' && !answeredQuestions.has(question.id) && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#27ae60',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 2
                      }}>
                        NEW
                      </div>
                    )}
                    <div className="question-header">
                      <h3 className="question-title">{question.content?.substring(0, 100) + (question.content?.length > 100 ? '...' : '')}</h3>
                      <div className="question-status">
                        <span className={`status-badge ${question.status?.toLowerCase() || 'pending'}`}>
                          {question.status === 'ANSWERED' ? 'Đã trả lời' : 'Chờ trả lời'}
                        </span>
                        {/* Debug info */}
                        <small style={{fontSize: '10px', color: '#999', marginLeft: '8px'}}>
                          Status: {question.status} | Answered: {question.isAnswered ? 'Yes' : 'No'}
                        </small>
                      </div>
                    </div>
                    <p className="question-preview">{question.content}</p>
                    <div className="question-meta">
                      <div className="meta-item">
                        <User className="meta-icon" />
                        <span>{question.user?.fullName || question.user?.username || 'Ẩn danh'}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar className="meta-icon" />
                        <span>
                          {question.createdAt ? format(new Date(question.createdAt), 'dd/MM/yyyy') : 'N/A'}
                        </span>
                      </div>
                      {question.category && (
                        <div className="meta-item">
                          <Tag className="meta-icon" />
                          <span>
                            {categories.find(c => c.id === question.category)?.name || question.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Trước
                  </button>
                  <span className="pagination-info">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <HelpCircle className="empty-state-icon" />
              <h3>Không tìm thấy câu hỏi nào</h3>
              <p>Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
            </div>
          )}
        </div>

        {/* Question Detail Modal */}
        {(() => {
          return showQuestionDetail && selectedQuestion ? (
            <div className="question-detail-overlay">
              <div className="question-detail-container">
                <div className="question-detail-header">
                  <h2 className="question-detail-title">
                    {selectedQuestion.content?.substring(0, 100) + (selectedQuestion.content?.length > 100 ? '...' : '')}
                  </h2>
                  <button
                    onClick={() => setShowQuestionDetail(false)}
                    className="close-btn"
                  >
                    <X />
                  </button>
                </div>

                <div className="question-content">
                  <p className="question-text">{selectedQuestion.content}</p>
                </div>

                <div className="question-meta">
                  <div className="meta-item">
                    <User className="meta-icon" />
                    <span>{selectedQuestion.user?.fullName || selectedQuestion.user?.username || 'Ẩn danh'}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar className="meta-icon" />
                    <span>
                      {selectedQuestion.createdAt ? format(new Date(selectedQuestion.createdAt), 'dd/MM/yyyy') : 'N/A'}
                    </span>
                  </div>
                  {selectedQuestion.category && (
                    <div className="meta-item">
                      <Tag className="meta-icon" />
                      <span>
                        {categories.find(c => c.id === selectedQuestion.category)?.name || selectedQuestion.category}
                      </span>
                    </div>
                  )}
                </div>

                {selectedQuestion.answers && selectedQuestion.answers.length > 0 ? (
                  <div className="answer-section">
                    <h3 className="answer-title">Câu trả lời từ chuyên gia</h3>
                    {selectedQuestion.answers.map((answer, index) => (
                      <div key={index} className="answer-content">
                        <p className="answer-text">{answer.content}</p>
                        <div className="answer-author">
                          <div className="author-avatar">
                            {answer.consultant?.user?.fullName?.charAt(0) || 'C'}
                          </div>
                          <span>{answer.consultant?.user?.fullName || 'Chuyên gia'}</span>
                          <span>•</span>
                          <span>
                            {answer.createdAt ? format(new Date(answer.createdAt), 'dd/MM/yyyy') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-answer">
                    <Clock className="no-answer-icon" />
                    <h4>Chưa có câu trả lời</h4>
                    <p>
                      Chuyên gia sẽ trả lời câu hỏi của bạn trong thời gian sớm
                      nhất
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null;
        })()}

        {/* Ask Question Modal */}
        {showAskQuestion && (
          <div className="ask-question-overlay">
            <div className="ask-question-container">
              <div className="ask-question-header">
                <h2 className="ask-question-title">Đặt câu hỏi mới</h2>
                <button
                  onClick={() => setShowAskQuestion(false)}
                  className="close-btn"
                >
                  <X />
                </button>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Nội dung câu hỏi</h3>
                <textarea
                  value={newQuestion.content}
                  onChange={e =>
                    setNewQuestion(prev => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Mô tả chi tiết câu hỏi của bạn..."
                  className="form-textarea"
                />
                <p className="form-note">
                  Hãy mô tả càng chi tiết càng tốt để chuyên gia có thể tư vấn
                  chính xác nhất
                </p>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Danh mục</h3>
                <select
                  value={newQuestion.category}
                  onChange={e =>
                    setNewQuestion(prev => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="category-select"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.slice(1).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  onClick={() => setShowAskQuestion(false)}
                  className="form-btn cancel"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitQuestion}
                  className="form-btn submit"
                  disabled={
                    !newQuestion.content ||
                    !newQuestion.category ||
                    submitting
                  }
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi câu hỏi'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QA;
