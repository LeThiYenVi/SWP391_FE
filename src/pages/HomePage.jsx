import React, { useState } from 'react';
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
import styles from './HomePage.module.css';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
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

  const blogPosts = [
    {
      title: 'Những điều cần biết về chu kỳ kinh nguyệt của phụ nữ',
      date: 'Thứ Hai, 05/09/2021',
      author: 'Dr. Vũ Thị Thu Hiền',
      views: '68',
      comments: '86',
      image:
        'https://cdn.tiemchunglongchau.com.vn/chu_ky_kinh_nguyet_nhung_dieu_phu_nu_can_luu_y_1_7a2abf2443.png',
    },
    {
      title: 'Hướng dẫn cách chăm sóc sức khỏe phụ nữ hiệu quả',
      date: 'Thứ Ba, 06/09/2021',
      author: 'Dr. Lê Văn Minh',
      views: '52',
      comments: '73',
      image:
        'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/cham_soc_suc_khoe_phu_nu_tuoi_30_4_8b7757f4c0.jpg',
    },
    {
      title: 'Tầm quan trọng của việc xét nghiệm STI định kỳ',
      date: 'Thứ Tư, 07/09/2021',
      author: 'Dr. Đỗ Phạm Nguyệt Thanh',
      views: '94',
      comments: '121',
      image:
        'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/xet_nghiem_sti_la_gi_nhung_loai_xet_nghiem_sti_pho_bien_hien_nay_1_0f7ae7b22c.jpg',
    },
    {
      title: 'Lời khuyên từ chuyên gia về sức khỏe sinh sản',
      date: 'Thứ Năm, 08/09/2021',
      author: 'Dr. Vũ Thị Thu Hiền',
      views: '76',
      comments: '95',
      image:
        'https://login.medlatec.vn//ImagePath/images/20220816/20220816_kham-chua-benh-tai-medlatec-2.jpg',
    },
  ];

  return (
    <div className={styles.homepage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.logo}>
              <Heart className={styles.logoIcon} />
              <span className={styles.logoText}>Gynexa</span>
            </Link>

            <nav
              className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
            >
              <a href="#home" className={styles.navLink}>
                Trang chủ
              </a>
              <a href="#services" className={styles.navLink}>
                Dịch vụ
              </a>
              <a href="#doctors" className={styles.navLink}>
                Đội ngũ
              </a>
              <Link to="/blog" className={styles.navLink}>
                Blog
              </Link>
              <a href="#contact" className={styles.navLink}>
                Liên hệ
              </a>
            </nav>

            <div className={styles.headerActions}>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className={styles.btnOutline}>
                    Đăng nhập
                  </Link>
                  <Link to="/register" className={styles.btnPrimary}>
                    Đăng ký
                  </Link>
                </>
              ) : (
                <div style={{ position: 'relative' }}>
                  <button
                    className={styles.btnOutline}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <User size={18} style={{ marginRight: 4 }} />
                    {user?.name || 'Tài khoản'}
                  </button>
                  {showUserMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        minWidth: 180,
                        zIndex: 100,
                      }}
                    >
                      <Link
                        to="/dashboard"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          textDecoration: 'none',
                          color: '#222',
                          fontWeight: 500,
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} /> Dashboard
                      </Link>
                      <Link
                        to="/user/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          textDecoration: 'none',
                          color: '#222',
                          fontWeight: 500,
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} /> Hồ sơ cá nhân
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          color: '#d32f2f',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                className={styles.menuToggle}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

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

          <div className={styles.doctorsGrid}>
            {doctors.map((doctor, index) => (
              <div key={index} className={styles.doctorCard}>
                <div className={styles.doctorImage}>
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className={styles.doctorInfo}>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty}</p>
                  <div className={styles.doctorRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                    ))}
                    <span>{doctor.rating}</span>
                  </div>
                  <Link to="/doi-ngu" className={styles.btnOutline}>
                    Xem hồ sơ
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

          <div className={styles.blogGrid}>
            {blogPosts.map((post, index) => (
              <Link
                key={index}
                to={`/blog/${index + 1}`}
                className={styles.blogCard}
              >
                <div className={styles.blogImage}>
                  <img src={post.image} alt={post.title} />
                </div>
                <div className={styles.blogContent}>
                  <div className={styles.blogMeta}>
                    <span>
                      {post.date} | By {post.author}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <div className={styles.blogStats}>
                    <span>👁 {post.views}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
