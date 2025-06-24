import React, { useState } from 'react';
import { useAppointment } from '../../../context/AppointmentContext';
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
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './index.css';

const QA = () => {
  const { counselors, createConsultation, consultations, addMessage } =
    useAppointment();
  const [activeTab, setActiveTab] = useState('browse'); // browse, myQuestions, ask
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionDetail, setShowQuestionDetail] = useState(false);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
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

  const sampleQuestions = [
    {
      id: 1,
      title: 'Chu kỳ kinh nguyệt không đều có nguy hiểm không?',
      content:
        'Em 22 tuổi, chu kỳ kinh nguyệt của em thường không đều, có khi 25 ngày có khi 35 ngày. Em có cần lo lắng không ạ?',
      category: 'menstruation',
      author: 'Ẩn danh',
      date: '2024-01-15',
      answers: 3,
      views: 124,
      status: 'answered',
      isAnswered: true,
      expertAnswer: {
        counselor: 'Dr. Nguyễn Thị Hương',
        content:
          'Chu kỳ kinh nguyệt từ 21-35 ngày đều được coi là bình thường. Tuy nhiên, nếu có sự thay đổi đột ngột hoặc kèm theo triệu chứng bất thường, bạn nên thăm khám để được tư vấn cụ thể.',
        date: '2024-01-16',
      },
    },
    {
      id: 2,
      title: 'Thuốc tránh thai khẩn cấp có tác dụng phụ gì?',
      content:
        'Chào bác sĩ, em muốn hỏi về thuốc tránh thai khẩn cấp. Em có cần lưu ý gì không ạ?',
      category: 'contraception',
      author: 'Mai A.',
      date: '2024-01-14',
      answers: 2,
      views: 89,
      status: 'answered',
      isAnswered: true,
      expertAnswer: {
        counselor: 'Dr. Lê Văn Minh',
        content:
          'Thuốc tránh thai khẩn cấp có thể gây một số tác dụng phụ như buồn nôn, đau đầu, rối loạn kinh nguyệt. Không nên sử dụng quá 2 lần/tháng.',
        date: '2024-01-15',
      },
    },
    {
      id: 3,
      title: 'Làm thế nào để phòng ngừa nhiễm trùng đường tiết niệu?',
      content:
        'Em hay bị nhiễm trùng đường tiết niệu, có cách phòng ngừa nào không ạ?',
      category: 'general',
      author: 'Linh N.',
      date: '2024-01-13',
      answers: 1,
      views: 67,
      status: 'pending',
      isAnswered: false,
    },
  ];

  const handleSubmitQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Mock submission
    toast.success(
      'Câu hỏi đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24h.'
    );

    setNewQuestion({
      title: '',
      content: '',
      category: 'general',
      isAnonymous: false,
    });

    setActiveTab('myQuestions');
  };

  const filteredQuestions = sampleQuestions.filter(question => {
    const matchesCategory =
      selectedCategory === 'all' || question.category === selectedCategory;
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuestionClick = question => {
    setSelectedQuestion(question);
    setShowQuestionDetail(true);
  };

  const handleAskQuestion = () => {
    setShowAskQuestion(true);
  };

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
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={handleAskQuestion} className="ask-question-btn">
            <Plus className="w-5 h-5 mr-2" />
            Đặt câu hỏi mới
          </button>
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
                selectedCategory === '' ? 'selected' : ''
              }`}
              onClick={() => setSelectedCategory('')}
            >
              <HelpCircle className="category-icon" />
              <h3 className="category-name">Tất cả</h3>
              <p className="category-count">{sampleQuestions.length} câu hỏi</p>
            </div>
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-card ${
                  selectedCategory === category.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <HelpCircle className="category-icon" />
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">
                  {
                    filteredQuestions.filter(q => q.category === category.id)
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
            {selectedCategory === 'all'
              ? 'Tất cả câu hỏi'
              : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          {filteredQuestions.length > 0 ? (
            <div className="questions-list">
              {filteredQuestions.map(question => (
                <div
                  key={question.id}
                  className="question-item"
                  onClick={() => handleQuestionClick(question)}
                >
                  <div className="question-header">
                    <h3 className="question-title">{question.title}</h3>
                    <div className="question-status">
                      <span className={`status-badge ${question.status}`}>
                        {question.status === 'answered'
                          ? 'Đã trả lời'
                          : 'Chờ trả lời'}
                      </span>
                    </div>
                  </div>
                  <p className="question-preview">{question.content}</p>
                  <div className="question-meta">
                    <div className="meta-item">
                      <User className="meta-icon" />
                      <span>{question.author}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar className="meta-icon" />
                      <span>
                        {format(new Date(question.date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="meta-item">
                      <Tag className="meta-icon" />
                      <span>
                        {categories.find(c => c.id === question.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <HelpCircle className="empty-state-icon" />
              <h3>Không tìm thấy câu hỏi nào</h3>
              <p>Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
            </div>
          )}
        </div>

        {/* Question Detail Modal */}
        {showQuestionDetail && selectedQuestion && (
          <div className="question-detail-overlay">
            <div className="question-detail-container">
              <div className="question-detail-header">
                <h2 className="question-detail-title">
                  {selectedQuestion.title}
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
                  <span>{selectedQuestion.author}</span>
                </div>
                <div className="meta-item">
                  <Calendar className="meta-icon" />
                  <span>
                    {format(new Date(selectedQuestion.date), 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="meta-item">
                  <Tag className="meta-icon" />
                  <span>
                    {
                      categories.find(c => c.id === selectedQuestion.category)
                        ?.name
                    }
                  </span>
                </div>
              </div>

              {selectedQuestion.expertAnswer ? (
                <div className="answer-section">
                  <h3 className="answer-title">Câu trả lời từ chuyên gia</h3>
                  <div className="answer-content">
                    <p className="answer-text">
                      {selectedQuestion.expertAnswer.content}
                    </p>
                    <div className="answer-author">
                      <div className="author-avatar">
                        {selectedQuestion.expertAnswer.counselor.charAt(0)}
                      </div>
                      <span>{selectedQuestion.expertAnswer.counselor}</span>
                      <span>•</span>
                      <span>
                        {format(
                          new Date(selectedQuestion.expertAnswer.date),
                          'dd/MM/yyyy'
                        )}
                      </span>
                    </div>
                  </div>
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
        )}

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
                <h3 className="form-section-title">Tiêu đề câu hỏi</h3>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={e =>
                    setNewQuestion(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Nhập tiêu đề ngắn gọn cho câu hỏi..."
                  className="form-input"
                />
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
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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

              <div className="form-actions">
                <button
                  onClick={() => setShowAskQuestion(false)}
                  className="form-btn cancel"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitQuestion}
                  className="form-btn submit"
                  disabled={
                    !newQuestion.title ||
                    !newQuestion.content ||
                    !newQuestion.category
                  }
                >
                  Gửi câu hỏi
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
