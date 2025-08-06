import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import SearchPage from '../pages/Search/Search.jsx';
import Consultation from '../pages/User/Consultation/index.jsx';
import ConsultationNew from '../pages/User/Consultation/ConsultationNew.jsx';
import CycleTracking from '../pages/User/CycleTracking/index.jsx';
import STITesting from '../pages/User/STITesting/index.jsx';
import QA from '../pages/User/QA/index.jsx';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthRedirect from '../components/AuthRedirect';
import MainLayout from '../layouts/MainLayout';
import BlogService from '../services/BlogService';
import { toast } from 'react-toastify';
import BlogDetailPage from '../pages/BlogDetailPage';
import BlogPage from '../pages/BlogPage';
import TimeslotPickerDemo from '../components/TimeslotPicker/demo';
import axios from 'axios';

// Simple placeholder components for missing pages
const AboutPage = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#fafdfe',
    }}
  >
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', color: '#3a99b7', marginBottom: '20px' }}>
        Về Gynexa
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
        }}
      >
        GYNEXA là trung tâm y tế chuyên khoa hàng đầu Việt Nam trong lĩnh vực
        chăm sóc sức khỏe sinh sản và giới tính. Được thành lập năm 2008 với tầm
        nhìn trở thành trung tâm y tế đạt chuẩn quốc tế.
      </p>
      <a
        href="/"
        style={{
          color: '#3a99b7',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        ← Quay lại trang chủ
      </a>
    </div>
  </div>
);

// DoctorsPage component với hiển thị hồ sơ consultant chi tiết
const DoctorsPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/homepage/featured-doctors');
        
        if (response.data && response.data.success && response.data.data) {
          setConsultants(response.data.data);
        } else {
          // Fallback data nếu API không trả về dữ liệu
          setConsultants([
            {
              id: 1,
              fullName: 'Bác sĩ Nguyễn Thị Hương',
              specialization: 'Sản Phụ khoa',
              experienceYears: 10,
              biography: 'Bác sĩ chuyên khoa I, có kinh nghiệm lâu năm trong lĩnh vực sản phụ khoa. Chuyên điều trị các bệnh lý phụ khoa, tư vấn kế hoạch hóa gia đình.',
              qualifications: 'Đại học Y Hà Nội - Chuyên khoa I Sản Phụ khoa',
              profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
              rating: 4.9,
              consultationCount: 1250,
              languages: ['Tiếng Việt', 'English'],
              education: 'Đại học Y Hà Nội',
              certifications: ['Chứng chỉ hành nghề Y khoa', 'Chứng chỉ chuyên khoa I'],
              awards: ['Bằng khen Bộ Y tế', 'Giải thưởng Bác sĩ xuất sắc']
            },
            {
              id: 2,
              fullName: 'Bác sĩ Trần Văn Minh',
              specialization: 'Nội tiết - Sinh sản',
              experienceYears: 8,
              biography: 'Chuyên gia tư vấn tâm lý, tình dục học. Có nhiều kinh nghiệm trong việc tư vấn các vấn đề về sức khỏe tình dục và mối quan hệ.',
              qualifications: 'Đại học Y dược TP.HCM - Chuyên khoa Nội tiết',
              profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
              rating: 4.8,
              consultationCount: 890,
              languages: ['Tiếng Việt', 'English'],
              education: 'Đại học Y dược TP.HCM',
              certifications: ['Chứng chỉ hành nghề Y khoa', 'Chứng chỉ Tâm lý học lâm sàng'],
              awards: ['Giải thưởng Nghiên cứu khoa học']
            },
            {
              id: 3,
              fullName: 'Bác sĩ Lê Thị Lan',
              specialization: 'Tâm lý sức khỏe phụ nữ',
              experienceYears: 6,
              biography: 'Chuyên gia dinh dưỡng và kế hoạch hóa gia đình. Tư vấn về chế độ ăn uống, bổ sung vitamin và các phương pháp tránh thai hiện đại.',
              qualifications: 'Đại học Y Huế - Chuyên khoa Tâm lý học',
              profileImageUrl: 'https://images.unsplash.com/photo-1594824475545-9d0c7c4951c5?w=400&h=400&fit=crop&crop=face',
              rating: 4.7,
              consultationCount: 650,
              languages: ['Tiếng Việt', 'English'],
              education: 'Đại học Y Huế',
              certifications: ['Chứng chỉ hành nghề Y khoa', 'Chứng chỉ Tư vấn tâm lý'],
              awards: ['Bằng khen Sở Y tế']
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading consultants:', error);
        setError('Không thể tải thông tin đội ngũ y tế');
        // Fallback data
        setConsultants([
          {
            id: 1,
            fullName: 'Bác sĩ Nguyễn Thị Hương',
            specialization: 'Sản Phụ khoa',
            experienceYears: 10,
            biography: 'Bác sĩ chuyên khoa I, có kinh nghiệm lâu năm trong lĩnh vực sản phụ khoa.',
            qualifications: 'Đại học Y Hà Nội - Chuyên khoa I Sản Phụ khoa',
            profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
            rating: 4.9,
            consultationCount: 1250,
            languages: ['Tiếng Việt', 'English'],
            education: 'Đại học Y Hà Nội',
            certifications: ['Chứng chỉ hành nghề Y khoa'],
            awards: ['Bằng khen Bộ Y tế']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadConsultants();
  }, []);

  const handleBookConsultation = () => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (!token) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigate('/login', { state: { from: '/tu-van' } });
    } else {
      // Nếu đã đăng nhập, chuyển đến trang tư vấn
      navigate('/tu-van');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafdfe'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3a99b7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Đang tải thông tin đội ngũ y tế...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#fafdfe'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: '#3a99b7', marginBottom: '20px' }}>
            Đội ngũ y tế
          </h1>
          <p style={{ color: '#e74c3c', fontSize: '18px', marginBottom: '30px' }}>
            {error}
          </p>
          <a href="/" style={{
            color: '#3a99b7',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafdfe',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            color: '#3a99b7', 
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            Đội ngũ y tế Gynexa
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#666',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Đội ngũ bác sĩ chuyên nghiệp và giàu kinh nghiệm luôn sẵn sàng hỗ trợ bạn 
            trong hành trình chăm sóc sức khỏe giới tính
          </p>
        </div>

        {/* Consultants Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {consultants.map((consultant) => (
            <div key={consultant.id} style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}>
              
              {/* Consultant Image */}
              <div style={{
                height: '300px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={consultant.profileImageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'} 
                  alt={consultant.fullName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ color: '#f39c12', fontSize: '16px' }}>★</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{consultant.rating}</span>
                </div>
              </div>

              {/* Consultant Info */}
              <div style={{ padding: '30px' }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {consultant.fullName}
                </h3>
                
                <p style={{
                  color: '#3a99b7',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '15px'
                }}>
                  {consultant.specialization}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <span style={{ color: '#f39c12' }}>★</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{consultant.rating}</span>
                  <span style={{ color: '#666' }}>•</span>
                  <span style={{ color: '#666' }}>{consultant.experienceYears} năm kinh nghiệm</span>
                </div>

                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {consultant.biography}
                </p>

                {/* Qualifications */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '10px'
                  }}>
                    Học vấn & Chứng chỉ
                  </h4>
                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {consultant.qualifications}
                  </p>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  borderTop: '1px solid #eee',
                  marginTop: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#3a99b7' }}>
                      {consultant.consultationCount}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Tư vấn</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#3a99b7' }}>
                      {consultant.experienceYears}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Năm KN</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#3a99b7' }}>
                      {consultant.languages?.length || 2}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Ngôn ngữ</div>
                  </div>
                </div>

                {/* Action Button */}
                <button style={{
                  width: '100%',
                  background: '#3a99b7',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2c7a94'}
                onMouseLeave={(e) => e.target.style.background = '#3a99b7'}
                onClick={handleBookConsultation}>
                  Đặt lịch tư vấn
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <a href="/" style={{
            color: '#3a99b7',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ← Quay lại trang chủ
          </a>
        </div>
      </div>

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

// BlogPage component đã được import từ file riêng

const ServicesPage = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#fafdfe',
    }}
  >
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', color: '#3a99b7', marginBottom: '20px' }}>
        Dịch vụ của Gynexa
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
        }}
      >
        Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe giới tính chuyên
        nghiệp.
      </p>
      <a
        href="/"
        style={{
          color: '#3a99b7',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        ← Quay lại trang chủ
      </a>
    </div>
  </div>
);

const HealthCarePage = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#fafdfe',
    }}
  >
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', color: '#3a99b7', marginBottom: '20px' }}>
        Chăm sóc sức khỏe
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
        }}
      >
        Dịch vụ chăm sóc sức khỏe toàn diện với các chương trình theo dõi và tư
        vấn cá nhân hóa.
      </p>
      <a
        href="/"
        style={{
          color: '#3a99b7',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        ← Quay lại trang chủ
      </a>
    </div>
  </div>
);

const ContactPage = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      backgroundColor: '#fafdfe',
    }}
  >
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '32px',
          color: '#3a99b7',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        Liên hệ với chúng tôi
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            padding: '20px',
            background: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#3a99b7', marginBottom: '10px' }}>Điện thoại</h3>
          <p style={{ color: '#666' }}>(84) 123-456-789</p>
          <p style={{ color: '#666' }}>(84) 987-654-321</p>
        </div>
        <div
          style={{
            padding: '20px',
            background: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#3a99b7', marginBottom: '10px' }}>Email</h3>
          <p style={{ color: '#666' }}>support@gynexa.com</p>
          <p style={{ color: '#666' }}>info@gynexa.com</p>
        </div>
        <div
          style={{
            padding: '20px',
            background: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#3a99b7', marginBottom: '10px' }}>Địa chỉ</h3>
          <p style={{ color: '#666' }}>123 Nguyễn Huệ</p>
          <p style={{ color: '#666' }}>Quận 1, TP.HCM</p>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <a
          href="/"
          style={{
            color: '#3a99b7',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          ← Quay lại trang chủ
        </a>
      </div>
    </div>
  </div>
);

const TermsPage = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      backgroundColor: '#fafdfe',
    }}
  >
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', color: '#3a99b7', marginBottom: '30px' }}>
        Điều khoản sử dụng
      </h1>
      <div
        style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.6',
          textAlign: 'left',
        }}
      >
        <h3>1. Chấp nhận điều khoản</h3>
        <p>
          Khi sử dụng dịch vụ của Gynexa, bạn đồng ý tuân thủ các điều khoản và
          điều kiện được quy định.
        </p>

        <h3>2. Quyền riêng tư và bảo mật</h3>
        <p>
          Gynexa cam kết bảo vệ thông tin cá nhân và dữ liệu sức khỏe của bạn
          theo các tiêu chuẩn bảo mật cao nhất.
        </p>

        <h3>3. Sử dụng dịch vụ</h3>
        <p>
          Dịch vụ của Gynexa chỉ dành cho mục đích tư vấn và hỗ trợ sức khỏe,
          không thay thế cho việc khám và điều trị trực tiếp.
        </p>
      </div>
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a
          href="/"
          style={{
            color: '#3a99b7',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          ← Quay lại trang chủ
        </a>
      </div>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      backgroundColor: '#fafdfe',
    }}
  >
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', color: '#3a99b7', marginBottom: '30px' }}>
        Chính sách bảo mật
      </h1>
      <div
        style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.6',
          textAlign: 'left',
        }}
      >
        <h3>1. Thu thập thông tin</h3>
        <p>
          Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ chăm
          sóc sức khỏe tốt nhất cho bạn.
        </p>

        <h3>2. Sử dụng thông tin</h3>
        <p>
          Thông tin của bạn được sử dụng để cung cấp dịch vụ tư vấn, theo dõi
          sức khỏe và cải thiện chất lượng dịch vụ.
        </p>

        <h3>3. Bảo vệ dữ liệu</h3>
        <p>
          Gynexa sử dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu cá
          nhân và thông tin sức khỏe của bạn.
        </p>
      </div>
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a
          href="/"
          style={{
            color: '#3a99b7',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          ← Quay lại trang chủ
        </a>
      </div>
    </div>
  </div>
);

const HomePageRoutes = [
  // Main pages - Cho phép tất cả user truy cập (cả đã đăng nhập và chưa đăng nhập)
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },

  // Service pages with Vietnamese URLs (bọc ProtectedRoute + MainLayout)
  {
    path: '/tu-van',
    element: (
      <ProtectedRoute>
        <MainLayout title="Tư vấn trực tuyến - Gynexa">
          <ConsultationNew />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/theo-doi-chu-ky',
    element: (
      <ProtectedRoute>
        <MainLayout title="Theo dõi chu kỳ - Gynexa">
          <CycleTracking />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/xet-nghiem-sti',
    element: (
      <ProtectedRoute>
        <MainLayout title="Xét nghiệm STIs - Gynexa">
          <STITesting />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/hoi-dap',
    element: (
      <ProtectedRoute>
        <MainLayout title="Hỏi đáp - Gynexa">
          <QA />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/suc-khoe',
    element: <HealthCarePage />,
  },

  // English URLs for backward compatibility - REMOVED (duplicate with DashboardRoutes)

  // Information pages
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/gioi-thieu',
    element: <AboutPage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/dich-vu',
    element: <ServicesPage />,
  },
  {
    path: '/doctors',
    element: <DoctorsPage />,
  },
  {
    path: '/doi-ngu',
    element: <DoctorsPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/blog/:id',
    element: <BlogDetailPage />,
  },
  {
    path: '/tin-tuc',
    element: <BlogPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/lien-he',
    element: <ContactPage />,
  },

  // Legal pages
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/dieu-khoan',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/chinh-sach-bao-mat',
    element: <PrivacyPage />,
  },

  // Demo routes
  {
    path: '/demo/timeslot-picker',
    element: <TimeslotPickerDemo />,
  },

  // Catch-all route for 404 errors - MUST be last
  {
    path: '*',
    element: <NotFound />,
  },
];

export default HomePageRoutes;
