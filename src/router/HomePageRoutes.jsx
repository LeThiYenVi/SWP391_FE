import React from 'react';
import HomePage from '../pages/HomePage.jsx';
import SearchPage from '../pages/Search/Search.jsx';
import Consultation from '../pages/User/Consultation/index.jsx';
import CycleTracking from '../pages/User/CycleTracking/index.jsx';
import STITesting from '../pages/User/STITesting/index.jsx';
import QA from '../pages/User/QA/index.jsx';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

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

const DoctorsPage = () => (
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
        Đội ngũ y tế
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
        }}
      >
        Đội ngũ bác sĩ chuyên nghiệp và giàu kinh nghiệm của Gynexa luôn sẵn
        sàng hỗ trợ bạn.
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

const BlogPage = () => (
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
        Blog & Tin tức
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
        }}
      >
        Cập nhật những thông tin mới nhất về sức khỏe giới tính và các kiến thức
        y khoa.
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
  // Main pages
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
          <Consultation />
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

  // English URLs for backward compatibility
  {
    path: '/consultation',
    element: <Consultation />,
  },
  {
    path: '/cycle-tracking',
    element: <CycleTracking />,
  },
  {
    path: '/sti-testing',
    element: <STITesting />,
  },
  {
    path: '/qa',
    element: <QA />,
  },

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
    element: <BlogPage />,
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
];

export default HomePageRoutes;
