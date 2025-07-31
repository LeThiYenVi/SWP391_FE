import React, { useState, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Calendar,
  MessageCircle,
  TestTube,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Heart,
  Send,
  User,
  LogOut,
  Shield,
  Users,
  Award,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { HomePageHeader } from '../components/layout/HomePageHeader';
import ConsultantRating from '../components/ConsultantRating';
import styles from './HomePage.module.css';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BlogService from '../services/BlogService';
import axios from 'axios'; // Added axios import

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    doctor: '',
    message: '',
  });
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogApiMessage, setBlogApiMessage] = useState('');
  const [consultants, setConsultants] = useState([]);
  const [consultantsLoading, setConsultantsLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [consultantFeedback, setConsultantFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Kiểm tra session expired
  useEffect(() => {
    const sessionExpired = localStorage.getItem('sessionExpired');
    if (sessionExpired === 'true') {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      localStorage.removeItem('sessionExpired');
    }
  }, []);

  // Tự động redirect user dựa trên role khi truy cập trang chủ
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role;
      console.log('User authenticated on homepage, role:', userRole);
      
      if (userRole) {
        if (userRole === 'ROLE_CONSULTANT' || userRole === 'CONSULTANT' || userRole === 'consultant' ||
            userRole === 'ROLE_COUNSELOR' || userRole === 'COUNSELOR' || userRole === 'counselor') {
          console.log('Redirecting consultant to /consultant');
          navigate('/consultant', { replace: true });
        } else if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN' || userRole === 'admin') {
          console.log('Redirecting admin to /admin/dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else if (userRole === 'ROLE_STAFF' || userRole === 'STAFF' || userRole === 'staff') {
          console.log('Redirecting staff to /staff');
          navigate('/staff', { replace: true });
        }
        // Các role khác (CUSTOMER, etc.) thì ở lại trang chủ
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        loadBlogPosts(); // Bật lại blog loading
        loadConsultants();
      } catch (error) {
        console.error('Error initializing HomePage data:', error);
        // Không làm crash ứng dụng, chỉ log lỗi
      }
    };
    
    initializeData();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setBlogLoading(true);
      const response = await axios.get('/api/homepage/latest-blog-posts', {
        params: { limit: 3 }
      });

      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        setBlogPosts(response.data.data);
        setBlogApiMessage('');
      } else {
        setBlogPosts([]);
        setBlogApiMessage(response.data?.message || 'Chưa có bài viết nào.');
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      console.error('Error response:', error.response?.data);
      setBlogPosts([]);
      setBlogApiMessage('Tạm thời không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setBlogLoading(false);
    }
  };

  const loadConsultants = async () => {
    try {
      setConsultantsLoading(true);
      const response = await axios.get('/api/homepage/featured-doctors');
      
      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        setConsultants(response.data.data);
      } else {
        // Fallback to hardcoded data if API fails
        setConsultants(doctors);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
      // Fallback to hardcoded data
      setConsultants(doctors);
    } finally {
      setConsultantsLoading(false);
    }
  };

  const handleViewConsultantDetails = async (consultant) => {
    try {
      setSelectedConsultant(consultant);
      setShowConsultantModal(true);
      setFeedbackLoading(true);
      
      // Lấy consultant ID từ nhiều field có thể có
      const consultantId = consultant.consultantID || consultant.id || consultant.user?.id;
      console.log('Consultant object:', consultant);
      console.log('Consultant ID:', consultantId);
      
      const response = await axios.get(`/api/feedback/consultant/${consultantId}`);
      console.log('Feedback API response:', response.data);
      
      if (response.data && response.data.success) {
        setConsultantFeedback(response.data.data || []);
      } else {
        setConsultantFeedback([]);
      }
    } catch (error) {
      console.error('Error loading consultant feedback:', error);
      console.error('Error details:', error.response?.data);
      setConsultantFeedback([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closeConsultantModal = () => {
    setShowConsultantModal(false);
    setSelectedConsultant(null);
    setConsultantFeedback([]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  // Hàm kiểm tra authentication và redirect nếu cần
  const handleAuthAction = targetPath => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login', { state: { from: targetPath } });
      return false;
    }
    navigate(targetPath);
    return true;
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect đến trang search với query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Hàm xử lý thay đổi input search
  const handleSearchInputChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để đặt lịch tư vấn!');
      navigate('/login');
      return;
    }
    // Handle form submission - integrate with backend API
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    setFormData({
      name: '',
      gender: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      doctor: '',
      message: '',
    });
  };

  const services = [
    {
      icon: MessageCircle,
      title: 'Tư vấn trực tuyến',
      description: 'Tư vấn trực tuyến với chuyên gia an toàn và bảo mật',
      link: '/tu-van',
      requireAuth: true,
    },
    {
      icon: Calendar,
      title: 'Theo dõi chu kỳ',
      description: 'Theo dõi và dự đoán chu kỳ sinh lý một cách thông minh',
      link: '/theo-doi-chu-ky',
      requireAuth: true,
    },
    {
      icon: TestTube,
      title: 'Xét nghiệm STIs',
      description: 'Đặt lịch và xem kết quả xét nghiệm an toàn, bảo mật',
      link: '/xet-nghiem-sti',
      requireAuth: true,
    },
    {
      icon: HelpCircle,
      title: 'Hỏi đáp',
      description: 'Đặt câu hỏi và nhận tư vấn từ các chuyên gia',
      link: '/hoi-dap',
      requireAuth: true,
    },
  ];

  // More services cho section More Services
  const moreServices = [
    {
      icon: Heart,
      title: 'Chăm sóc sức khỏe',
      description: 'Chương trình chăm sóc sức khỏe toàn diện và cá nhân hóa',
      link: '/suc-khoe',
      requireAuth: true,
    },
    {
      icon: Shield,
      title: 'Bảo mật thông tin',
      description: 'Cam kết bảo mật tuyệt đối thông tin cá nhân của bạn',
      link: '/bao-mat',
      requireAuth: false,
    },
    {
      icon: Users,
      title: 'Cộng đồng',
      description: 'Kết nối với cộng đồng phụ nữ quan tâm sức khỏe',
      link: '/cong-dong',
      requireAuth: true,
    },
    {
      icon: Award,
      title: 'Chứng nhận',
      description: 'Đạt chuẩn quốc tế về chăm sóc sức khỏe sinh sản',
      link: '/chung-nhan',
      requireAuth: false,
    },
  ];

  const features = [
    'Theo dõi chu kỳ',
    'Xét nghiệm STIs',
    'Theo dõi thời gian rụng trứng',
    'Nhắc nhở uống thuốc',
    'Tư vấn giới tính 1:1',
    'Tư vấn trực tuyến',
  ];

  const doctors = [
    {
      name: 'Dr. Vũ Thị Thu Hiền',
      specialty: 'Sản phụ khoa',
      rating: 4.9,
      image:
        'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
    },
    {
      name: 'Dr. Lê Văn Minh',
      specialty: 'Tâm lý học',
      rating: 4.8,
      image:
        'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/06/anh-bac-si-27.jpg.webp',
    },
    {
      name: 'Dr. Đỗ Phạm Nguyệt Thanh',
      specialty: 'Nội tiết',
      rating: 4.9,
      image:
        'https://www.hoilhpn.org.vn/documents/20182/3653964/5_May_2022_100351_GMTbs_dophamnguyetthanh.jpg/a744c0f6-07dd-457c-9075-3ec3ff26b384',
    },
  ];

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  



  return (
    <div className={styles.homepage}>
      {/* Header */}
      <HomePageHeader />

      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextContent}>
              <div className={styles.heroTag}>
                <span>Chào mừng bạn đến với GYNEXA</span>
              </div>
              <h1 className={styles.heroTitle}>
                Bắt nhịp cơ thể, hiểu thấu chính mình
              </h1>
              <p className={styles.heroSubtitle}>
                Dịch vụ chăm sóc sức khỏe giới tính Gynexa - Tư vấn miễn phí
              </p>
              <div className={styles.heroStatus}>
                <div className={styles.statusDot}></div>
                <span>+18 tư vấn viên đang trực tuyến</span>
              </div>

              <div className={styles.heroActions}>
                <button
                  onClick={() => handleAuthAction('/tu-van')}
                  className={styles.btnPrimary}
                >
                  Tư vấn ngay <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => handleAuthAction('/theo-doi-chu-ky')}
                  className={styles.btnOutline}
                >
                  Theo dõi chu kỳ
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/profile')}
                    className={styles.btnOutline}
                    style={{
                      backgroundColor: '#B3CCD4',
                      color: 'white',
                      borderColor: '#B3CCD4'
                    }}
                  >
                    <User size={16} style={{ marginRight: 4 }} />
                    Hồ sơ cá nhân
                  </button>
                )}
              </div>

              <div className={styles.searchSection}>
                <form
                  onSubmit={handleSearch}
                  className={styles.searchContainer}
                >
                  <Search className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thông tin, dịch vụ..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <button type="submit" className={styles.searchBtn}>
                    Tìm kiếm
                  </button>
                </form>
              </div>
            </div>

            {/* Thêm ảnh vào hero section */}
            <div className={styles.heroImageContainer}>
              <img
                src="https://vietmyclinic.com.vn/wp-content/uploads/2019/12/khoa-hinh-anh.jpg"
                alt="Dịch vụ y tế chuyên nghiệp"
                className={styles.heroLogo}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2>
                Chăm sóc sức khỏe giới tính một cách cá nhân hóa & an toàn
              </h2>
              <p>
                GYNEXA là trung tâm y tế chuyên khoa hàng đầu Việt Nam trong
                lĩnh vực chăm sóc sức khỏe sinh sản và giới tính. Được thành lập
                năm 2008 với tầm nhìn trở thành trung tâm y tế đạt chuẩn quốc
                tế.
              </p>
              <p>
                Gynexa là nền tảng chăm sóc sức khỏe giới tính hiện đại, hướng
                đến sự an toàn, chủ động và thấu hiểu cho từng cá nhân. Gynexa
                cung cấp giải pháp toàn diện - từ tư vấn trực tuyến, theo dõi
                chu kỳ sinh sản đến xét nghiệm STIs an toàn và bảo mật.
              </p>
              <Link to="/gioi-thieu" className={styles.btnPrimary}>
                Xem thêm <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <CheckCircle className={styles.featureIcon} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Dịch vụ của GYNEXA</h2>
            <p>
              Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện và chuyên
              nghiệp
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={index}
                className={styles.serviceCard}
                onClick={() => {
                  if (service.requireAuth) {
                    handleAuthAction(service.link);
                  } else {
                    navigate(service.link);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.serviceIcon}>
                  <service.icon size={32} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>

          {/* More Services Section - dàn đều thành 1 hàng ngang */}
          <div className={styles.moreServices}>
            <div className={styles.moreServicesGrid}>
              {moreServices.map((service, index) => (
                <div
                  key={index}
                  className={styles.serviceCard}
                  onClick={() => {
                    if (service.requireAuth) {
                      handleAuthAction(service.link);
                    } else {
                      navigate(service.link);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.serviceIcon}>
                    <service.icon size={32} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className={styles.booking}>
        <div className={styles.container}>
          <div className={styles.bookingContent}>
            <div className={styles.bookingLeft}>
              <h2>Đặt lịch để được tư vấn miễn phí ngay</h2>
              <p>
                Chăm sóc sức khỏe giới tính bắt đầu từ sự thấu hiểu. Từ theo dỗi
                chu kỳ kinh nguyệt đến đặt lịch tư vấn riêng tư, Gynexa đồng
                hành cùng bạn trên từng nhịp sống. Trải nghiệm nền tảng y tế
                thông minh, nơi xét nghiệm STIs được quản lý an toàn, kết quả
                bảo mật và hỗ trợ chuyên sâu từ đội ngũ tư vấn viên giàu kinh
                nghiệm.
              </p>
            </div>

            <div className={styles.bookingImageContainer}>
              <img
                src="https://congtyso.com/assets/images/doctors/doctor-image-remove-background.png"
                alt="Bác sĩ chuyên nghiệp"
                className={styles.bookingDoctorImage}
              />
            </div>

            <div className={styles.bookingForm}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className={styles.formInput}
                    required
                  />
                  <select
                    value={formData.gender}
                    onChange={e => handleInputChange('gender', e.target.value)}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Giới tính</option>
                    <option value="female">Nữ</option>
                    <option value="male">Nam</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className={styles.formRow}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={styles.formInput}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => handleInputChange('date', e.target.value)}
                    className={styles.formInput}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => handleInputChange('time', e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <select
                  value={formData.doctor}
                  onChange={e => handleInputChange('doctor', e.target.value)}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Ghi chú thêm (tùy chọn)"
                  value={formData.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  className={styles.formTextarea}
                  rows="4"
                />

                <button type="submit" className={styles.submitBtn}>
                  <Send size={16} />
                  Xác nhận đặt lịch
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className={styles.doctors}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Về đội ngũ y tế của Gynexa</h2>
            <p>Đội ngũ bác sĩ chuyên nghiệp và giàu kinh nghiệm</p>
          </div>

          {consultantsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #e1e5e9',
                borderTop: '4px solid #3a99b7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p style={{ color: '#666' }}>Đang tải đội ngũ y tế...</p>
            </div>
          ) : (
            <div className={styles.doctorsGrid}>
              {consultants.map((consultant, index) => (
                <div key={consultant.consultantID || index} className={styles.doctorCard}>
                  <div className={styles.doctorImage}>
                    <img 
                      src={consultant.profileImageUrl || 'https://via.placeholder.com/200x200?text=Doctor'} 
                      alt={consultant.user?.fullName || consultant.fullName || 'Doctor'} 
                    />
                  </div>
                  <div className={styles.doctorInfo}>
                    <h3>{consultant.user?.fullName || consultant.fullName || 'Dr. Consultant'}</h3>
                    <p>{consultant.specialization || consultant.qualifications || 'Tư vấn viên'}</p>
                    <div className={styles.doctorRating}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                      ))}
                      <span>{consultant.experienceYears ? `${consultant.experienceYears} năm kinh nghiệm` : '4.8'}</span>
                    </div>
                    <div className={styles.doctorActions}>
                      <Link to="/doi-ngu" className={styles.btnOutline}>
                        Xem hồ sơ
                      </Link>
                      <button 
                        className={styles.btnPrimary}
                        onClick={() => handleViewConsultantDetails(consultant)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                    <ConsultantRating 
                      consultantId={consultant.consultantID || consultant.id}
                      consultantName={consultant.user?.fullName || consultant.fullName || 'Tư vấn viên'}
                      onRatingChange={(feedback) => {
                        // Có thể cập nhật UI nếu cần
                        console.log('Rating changed:', feedback);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className={styles.blog}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTag}>
              Cập nhật tri thức – Dẫn lối sức khỏe
            </p>
            <h2>Blog</h2>
          </div>

          {blogLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #e1e5e9',
                borderTop: '4px solid #3a99b7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p style={{ color: '#666' }}>Đang tải bài viết...</p>
            </div>
          ) : (!blogPosts || blogPosts.length === 0) ? (
            <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>
              {blogApiMessage}
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {blogPosts.map((post, index) => (
                <Link
                  key={post.postID || post.id || index}
                  to={`/blog/${post.postID || post.id || index + 1}`}
                  className={styles.blogCard}
                >
                  <div className={styles.blogImage}>
                    {post.coverImageUrl ? (
                      <img 
                        src={post.coverImageUrl} 
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('❌ Image load error for:', post.coverImageUrl);
                          console.error('❌ Error details:', e.target.error);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={() => {
                          // Image loaded successfully
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '200px',
                        background: 'linear-gradient(135deg, #3a99b7 0%, #2d7a91 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '48px'
                      }}>
                        📝
                      </div>
                    )}
                  </div>
                  <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                      <span>
                        {formatDate(post.createdAt)} | By {post.author?.name || 'Gynexa'}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className={styles.blogSummary}>
                      {post.summary || post.content?.substring(0, 120) + '...' || 'Khám phá những thông tin hữu ích về sức khỏe phụ nữ và các vấn đề sinh sản.'}
                    </p>
                    <div className={styles.blogStats}>
                      <span>📝 {post.categories?.[0]?.name || 'Blog'}</span>
                      <span>👁 {Math.floor(Math.random() * 100) + 50}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/blog" className={styles.btnPrimary}>
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTag}>
              Đừng giữ thắc mắc một mình – hỏi ngay nhé!
            </p>
            <h2>Liên hệ</h2>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <Phone className={styles.contactIcon} />
              <h3>Đường dây nóng</h3>
              <p>(84) 123-456-789</p>
              <p>(84) 987-654-321</p>
            </div>

            <div
              className={`${styles.contactCard} ${styles.contactCardPrimary}`}
            >
              <MapPin className={styles.contactIcon} />
              <h3>Địa chỉ</h3>
              <p>123 Nguyễn Huệ</p>
              <p>Quận 1, TP.HCM</p>
            </div>

            <div className={styles.contactCard}>
              <Mail className={styles.contactIcon} />
              <h3>Email</h3>
              <p>support@gynexa.com</p>
              <p>info@gynexa.com</p>
            </div>

            <div className={styles.contactCard}>
              <Clock className={styles.contactIcon} />
              <h3>Giờ làm việc</h3>
              <p>T2-T7: 09:00-20:00</p>
              <p>Chủ Nhật: 24h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultant Details Modal */}
      {showConsultantModal && selectedConsultant && (
        <div className={styles.modalOverlay} onClick={closeConsultantModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết tư vấn viên</h2>
              <button className={styles.modalClose} onClick={closeConsultantModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.consultantInfo}>
                <div className={styles.consultantImage}>
                  <img 
                    src={selectedConsultant.profileImageUrl || 'https://via.placeholder.com/200x200?text=Doctor'} 
                    alt={selectedConsultant.user?.fullName || selectedConsultant.fullName || 'Doctor'} 
                  />
                </div>
                <div className={styles.consultantDetails}>
                  <h3>{selectedConsultant.user?.fullName || selectedConsultant.fullName || 'Dr. Consultant'}</h3>
                  <p className={styles.specialization}>{selectedConsultant.specialization || selectedConsultant.qualifications || 'Tư vấn viên'}</p>
                  <p className={styles.experience}>{selectedConsultant.experienceYears ? `${selectedConsultant.experienceYears} năm kinh nghiệm` : '4.8'}</p>
                  {selectedConsultant.biography && (
                    <p className={styles.biography}>{selectedConsultant.biography}</p>
                  )}
                </div>
              </div>

              <div className={styles.feedbackSection}>
                <h3>Đánh giá từ khách hàng</h3>
                {feedbackLoading ? (
                  <div className={styles.loadingFeedback}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải đánh giá...</p>
                  </div>
                ) : consultantFeedback.length > 0 ? (
                  <div className={styles.feedbackList}>
                    {consultantFeedback.map((feedback, index) => (
                      <div key={index} className={styles.feedbackItem}>
                        <div className={styles.feedbackHeader}>
                          <div className={styles.feedbackRating}>
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                fill={i < (feedback.rating || 0) ? "#ffd700" : "#e1e5e9"} 
                                color="#ffd700" 
                              />
                            ))}
                          </div>
                          <span className={styles.feedbackDate}>
                            {feedback.createdAt ? formatDate(feedback.createdAt) : 'Gần đây'}
                          </span>
                        </div>
                        {feedback.comment && (
                          <p className={styles.feedbackComment}>{feedback.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noFeedback}>
                    <p>Chưa có đánh giá nào cho tư vấn viên này.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
      
      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
