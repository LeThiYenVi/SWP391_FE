import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  Edit,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Shield,
  AlertTriangle,
  Brain,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  getConsultantQuestionsAPI, 
  getQuestionDetailsAPI,
  answerQuestionAPI,
  updateAnswerAPI
} from '../../services/QAService';
import './ConsultantQA.css';

const ConsultantQA = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionDetail, setShowQuestionDetail] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    pendingQuestions: 0,
  });

  const categories = [
    { id: 'all', name: 'Tất cả', icon: Sparkles, color: '#667eea' },
    { id: 'general', name: 'Tổng quát', icon: HelpCircle, color: '#10b981' },
    { id: 'contraception', name: 'Tránh thai', icon: Shield, color: '#f59e0b' },
    { id: 'menstruation', name: 'Kinh nguyệt', icon: Calendar, color: '#ef4444' },
    { id: 'pregnancy', name: 'Mang thai', icon: Heart, color: '#ec4899' },
    { id: 'sti', name: 'STIs', icon: AlertTriangle, color: '#8b5cf6' },
    { id: 'mental-health', name: 'Sức khỏe tâm lý', icon: Brain, color: '#06b6d4' },
  ];

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getConsultantQuestionsAPI(
        selectedCategory === 'all' ? null : selectedCategory, 
        currentPage, 
        10
      );

      console.log('Consultant QA Response:', response);
      console.log('Response structure:', {
        hasData: !!response?.data,
        hasContent: !!response?.content,
        dataKeys: response?.data ? Object.keys(response.data) : [],
        contentKeys: response?.content ? Object.keys(response.content) : []
      });

      if (response) {
        const questionsData = response.content || [];
        console.log('Questions data:', questionsData);
        console.log('First question sample:', questionsData[0]);
        console.log('All questions status:', questionsData.map(q => ({id: q.id, status: q.status, isAnswered: q.isAnswered})));
        
        setQuestions(questionsData);
        setTotalPages(response.totalPages || 1);
        
        // Calculate stats
        const total = response.totalElements || 0;
        const answered = questionsData.filter(q => q.isAnswered || q.status === 'ANSWERED').length;
        const pending = total - answered;
        
        console.log('Stats calculation:', {
          total,
          answered,
          pending,
          questionsWithIsAnswered: questionsData.filter(q => q.isAnswered || q.status === 'ANSWERED').map(q => ({id: q.id, isAnswered: q.isAnswered, status: q.status}))
        });
        
        setStats({
          totalQuestions: total,
          answeredQuestions: answered,
          pendingQuestions: pending,
        });
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage]);

  // Load questions
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions, searchQuery]);

  const handleQuestionClick = async (question) => {
    try {
      const response = await getQuestionDetailsAPI(question.id);
      if (response) {
        setSelectedQuestion(response);
        setShowQuestionDetail(true);
      }
    } catch (error) {
      console.error('Error loading question details:', error);
      toast.error('Không thể tải chi tiết câu hỏi');
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answerContent.trim()) {
      toast.error('Vui lòng nhập nội dung câu trả lời');
      return;
    }

    try {
      setSubmitting(true);
      const answerData = { content: answerContent };

      if (editingAnswer) {
        // Update existing answer
        await updateAnswerAPI(editingAnswer.id, answerData);
        toast.success('Cập nhật câu trả lời thành công');
      } else {
        // Submit new answer
        await answerQuestionAPI(selectedQuestion.id, answerData);
        toast.success('Trả lời câu hỏi thành công');
      }

      setAnswerContent('');
      setEditingAnswer(null);
      setShowAnswerForm(false);
      
      // Reload question details
      const response = await getQuestionDetailsAPI(selectedQuestion.id);
      if (response) {
        setSelectedQuestion(response);
      }
      
      // Reload questions list
      loadQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Không thể gửi câu trả lời. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAnswer = (answer) => {
    setEditingAnswer(answer);
    setAnswerContent(answer.content);
    setShowAnswerForm(true);
  };

  const handleCancelAnswer = () => {
    setAnswerContent('');
    setEditingAnswer(null);
    setShowAnswerForm(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredQuestions = questions.filter(question => {
    // Filter by search query
    if (searchQuery.trim()) {
      const matchesSearch = question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (question.user?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) {
        return false;
      }
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && question.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });
  


  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : HelpCircle;
  };

  return (
    <div className="consultant-qa-container">
      {/* Header */}
      <div className="qa-header">
        <div className="qa-header-content">
          <h1 className="qa-title">Quản lý câu hỏi</h1>
          <p className="qa-subtitle">
            Xem và trả lời câu hỏi từ khách hàng
          </p>
          
          {/* Stats Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">
                <Users className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalQuestions}</div>
                <div className="stat-label">Tổng câu hỏi</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon answered">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.answeredQuestions}</div>
                <div className="stat-label">Đã trả lời</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.pendingQuestions}</div>
                <div className="stat-label">Chờ trả lời</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qa-main">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc tên khách hàng..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <h2 className="section-title">Lọc theo danh mục</h2>
          <div className="categories-grid">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className={`category-card ${
                    selectedCategory === category.id ? 'selected' : ''
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <IconComponent className="category-icon" style={{ color: category.color }} />
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">
                    {questions.filter(q => q.category === category.id).length} câu hỏi
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Questions List */}
        <div className="questions-section">
          <h2 className="section-title">
            {selectedCategory === 'all' ? 'Tất cả câu hỏi' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
                     {loading ? (
             <div className="loading-state">
               <Loader className="loading-icon animate-spin" />
               <p>Đang tải câu hỏi...</p>
             </div>
           ) : filteredQuestions.length > 0 ? (
            <>
              <div className="questions-list">
                {filteredQuestions.map((question, index) => {
                  const CategoryIcon = getCategoryIcon(question.category);
                  return (
                    <div
                      key={question.id}
                      className="question-item"
                      onClick={() => handleQuestionClick(question)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="question-header">
                        <h3 className="question-title">
                          {question.content?.substring(0, 100) + (question.content?.length > 100 ? '...' : '')}
                        </h3>
                        <div className="question-status">
                          <span className={`status-badge ${(question.isAnswered || question.status === 'ANSWERED') ? 'answered' : 'pending'}`}>
                            {(question.isAnswered || question.status === 'ANSWERED') ? 'Đã trả lời' : 'Chờ trả lời'}
                          </span>
                          {/* Debug info */}
                          <small style={{fontSize: '10px', color: '#999', marginLeft: '8px'}}>
                            Status: {question.status} | Answered: {question.isAnswered ? 'Yes' : 'No'}
                          </small>
                        </div>
                      </div>
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
                            <CategoryIcon className="meta-icon" />
                            <span>
                              {categories.find(c => c.id === question.category)?.name || question.category}
                            </span>
                          </div>
                        )}
                        {question.answers && question.answers.length > 0 && (
                          <div className="meta-item">
                            <MessageCircle className="meta-icon" />
                            <span>{question.answers.length} câu trả lời</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
              <h3>Không có câu hỏi nào</h3>
              <p>Hiện tại không có câu hỏi nào cần trả lời</p>
            </div>
          )}
        </div>

        {/* Question Detail Modal */}
        {showQuestionDetail && selectedQuestion && (
          <div className="question-detail-overlay">
            <div className="question-detail-container">
              <div className="question-detail-header">
                <h2 className="question-detail-title">Chi tiết câu hỏi</h2>
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

              {/* Existing Answers */}
              {selectedQuestion.answers && selectedQuestion.answers.length > 0 && (
                <div className="answers-section">
                  <h3 className="answers-title">Câu trả lời</h3>
                  {selectedQuestion.answers.map((answer, index) => (
                    <div key={index} className="answer-content">
                      <div className="answer-header">
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
                        <button
                          onClick={() => handleEditAnswer(answer)}
                          className="edit-answer-btn"
                        >
                          <Edit className="w-4 h-4" />
                          Sửa
                        </button>
                      </div>
                      <p className="answer-text">{answer.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Form */}
              {showAnswerForm ? (
                <div className="answer-form-section">
                  <h3 className="answer-form-title">
                    {editingAnswer ? 'Sửa câu trả lời' : 'Trả lời câu hỏi'}
                  </h3>
                  <textarea
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    className="answer-textarea"
                    rows={6}
                  />
                  <div className="answer-form-actions">
                    <button
                      onClick={handleCancelAnswer}
                      className="form-btn cancel"
                      disabled={submitting}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAnswerSubmit}
                      className="form-btn submit"
                      disabled={!answerContent.trim() || submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        editingAnswer ? 'Cập nhật' : 'Gửi câu trả lời'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="answer-actions">
                  <button
                    onClick={() => setShowAnswerForm(true)}
                    className="answer-btn"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {selectedQuestion.answers && selectedQuestion.answers.length > 0 
                      ? 'Thêm câu trả lời' 
                      : 'Trả lời câu hỏi'
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantQA; 