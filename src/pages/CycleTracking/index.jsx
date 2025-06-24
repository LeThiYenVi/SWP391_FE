import React from 'react';
import { ArrowLeft, Calendar, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CycleTracking = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#fafdfe',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#3a99b7',
              textDecoration: 'none',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <ArrowLeft size={20} />
            Quay lại trang chủ
          </Link>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#202124',
              marginBottom: '16px',
            }}
          >
            Theo dõi chu kỳ
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#666',
              lineHeight: '1.6',
            }}
          >
            Hiểu rõ hơn về cơ thể bạn với công cụ theo dõi chu kỳ thông minh
          </p>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '60px',
          }}
        >
          {/* Feature Cards */}
          <div
            style={{
              background: '#ffffff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
            }}
          >
            <Calendar
              size={48}
              style={{ color: '#3a99b7', marginBottom: '20px' }}
            />
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#202124',
              }}
            >
              Theo dõi chu kỳ
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Ghi lại ngày bắt đầu và kết thúc chu kỳ kinh nguyệt để dự đoán chu
              kỳ tiếp theo
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
            }}
          >
            <Heart
              size={48}
              style={{ color: '#e91e63', marginBottom: '20px' }}
            />
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#202124',
              }}
            >
              Dự đoán rụng trứng
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Xác định thời điểm rụng trứng để tối ưu hóa khả năng thụ thai hoặc
              tránh thai
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              textAlign: 'center',
            }}
          >
            <TrendingUp
              size={48}
              style={{ color: '#4caf50', marginBottom: '20px' }}
            />
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#202124',
              }}
            >
              Phân tích xu hướng
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Theo dõi các thay đổi trong chu kỳ và nhận thông báo về bất thường
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3a99b7 0%, #2d7a91 100%)',
            padding: '60px 40px',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
            }}
          >
            Bắt đầu theo dõi chu kỳ ngay hôm nay
          </h2>
          <p
            style={{
              fontSize: '18px',
              marginBottom: '32px',
              opacity: '0.9',
              lineHeight: '1.6',
            }}
          >
            Đăng ký tài khoản để sử dụng đầy đủ tính năng theo dõi chu kỳ và
            nhận tư vấn từ chuyên gia
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                background: '#ffffff',
                color: '#3a99b7',
                padding: '14px 28px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
            >
              Đăng ký ngay
            </button>
            <Link
              to="/consultation"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
              }}
            >
              Tư vấn với chuyên gia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTracking;
