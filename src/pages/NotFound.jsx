import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafdfe',
        padding: '20px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* 404 Number */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: '800',
            color: '#B3CCD4',
            lineHeight: '1',
            marginBottom: '20px',
          }}
        >
          404
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#354766',
            marginBottom: '16px',
          }}
        >
          Trang không tồn tại
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.6',
            marginBottom: '40px',
          }}
        >
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          <br />
          Hãy kiểm tra lại URL hoặc quay về trang chủ.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#B3CCD4',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#9bb8c1';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#B3CCD4';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Home size={20} />
            Về trang chủ
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#354766',
              border: '2px solid #B3CCD4',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#B3CCD4';
              e.target.style.color = '#fff';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#354766';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>

        {/* Additional Help */}
        <div
          style={{
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#354766',
              marginBottom: '12px',
            }}
          >
            Có thể bạn đang tìm:
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <Link
              to="/tu-van"
              style={{
                color: '#B3CCD4',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Tư vấn trực tuyến
            </Link>
            <span style={{ color: '#ccc' }}>•</span>
            <Link
              to="/theo-doi-chu-ky"
              style={{
                color: '#B3CCD4',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Theo dõi chu kỳ
            </Link>
            <span style={{ color: '#ccc' }}>•</span>
            <Link
              to="/xet-nghiem-sti"
              style={{
                color: '#B3CCD4',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Xét nghiệm STIs
            </Link>
            <span style={{ color: '#ccc' }}>•</span>
            <Link
              to="/hoi-dap"
              style={{
                color: '#B3CCD4',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Hỏi đáp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
