import React, { useState } from 'react';
import {
  Calendar,
  Heart,
  Droplets,
  Info,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import dayjs from 'dayjs';
import './modern.css';

const ResponsiveDemo = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [screenSize, setScreenSize] = useState('desktop');

  // Demo data
  const currentMonth = dayjs().format('YYYY-MM');
  const demoPhases = {
    period: [
      `${currentMonth}-15`, 
      `${currentMonth}-16`, 
      `${currentMonth}-17`, 
      `${currentMonth}-18`, 
      `${currentMonth}-19`
    ],
    ovulation: `${currentMonth}-25`,
    fertile: [
      `${currentMonth}-23`, 
      `${currentMonth}-24`, 
      `${currentMonth}-25`, 
      `${currentMonth}-26`, 
      `${currentMonth}-27`
    ],
    predictedPeriod: [
      `${currentMonth}-12`, 
      `${currentMonth}-13`, 
      `${currentMonth}-14`, 
      `${currentMonth}-15`, 
      `${currentMonth}-16`
    ]
  };

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const days = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  const getDayClass = (day) => {
    const dayStr = day.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    let classes = ['calendar-day'];

    if (dayStr === today) classes.push('today');
    if (demoPhases.period.includes(dayStr)) classes.push('period');
    if (demoPhases.ovulation === dayStr) classes.push('ovulation');
    if (demoPhases.fertile.includes(dayStr)) classes.push('fertile');
    if (demoPhases.predictedPeriod.includes(dayStr)) classes.push('predicted-period');

    return classes.join(' ');
  };

  const getDayTooltip = (day) => {
    const dayStr = day.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    
    if (dayStr === today) {
      return 'Hôm nay';
    }
    
    if (demoPhases.period.includes(dayStr)) {
      return '🩸 Kỳ kinh - Giai đoạn kinh nguyệt';
    }
    
    if (demoPhases.ovulation === dayStr) {
      return '⭐ Rụng trứng - Ngày có khả năng thụ thai cao nhất';
    }
    
    if (demoPhases.fertile.includes(dayStr)) {
      return '🌸 Thời kỳ màu mỡ - Có khả năng thụ thai';
    }
    
    if (demoPhases.predictedPeriod.includes(dayStr)) {
      return '📅 Kỳ kinh dự đoán - Dựa trên chu kỳ trước';
    }
    
    return `Ngày ${day.format('DD/MM/YYYY')}`;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="cycle-tracking-container">
      {/* Header */}
      <div className="cycle-header">
        <div className="cycle-header-content">
          <div className="cycle-header-info">
            <h1>Responsive Demo - Màu sắc đẹp</h1>
            <p>Test responsive design với màu nền giống ảnh 2</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setScreenSize('mobile')}
              style={{
                background: screenSize === 'mobile' ? '#ff6b6b' : 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => setScreenSize('tablet')}
              style={{
                background: screenSize === 'tablet' ? '#ff6b6b' : 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setScreenSize('desktop')}
              style={{
                background: screenSize === 'desktop' ? '#ff6b6b' : 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Monitor size={16} />
            </button>
          </div>
        </div>
      </div>

      <div 
        className="cycle-main"
        style={{
          maxWidth: screenSize === 'mobile' ? '375px' : 
                   screenSize === 'tablet' ? '768px' : '100%',
          margin: '0 auto',
          padding: screenSize === 'mobile' ? '8px' : 
                   screenSize === 'tablet' ? '16px' : '20px'
        }}
      >
        {/* Overview Cards */}
        <div className="cycle-overview">
          <div className="cycle-card">
            <Calendar className="cycle-icon pink" />
            <div className="cycle-card-info">
              <p>Kỳ kinh tiếp theo</p>
              <p className="cycle-card-value">12 ngày</p>
            </div>
          </div>

          <div className="cycle-card">
            <Heart className="cycle-icon orange" />
            <div className="cycle-card-info">
              <p>Rụng trứng</p>
              <p className="cycle-card-value">8 ngày</p>
            </div>
          </div>

          <div className="cycle-card">
            <Droplets className="cycle-icon blue" />
            <div className="cycle-card-info">
              <p>Độ dài chu kỳ</p>
              <p className="cycle-card-value">28 ngày</p>
            </div>
          </div>

          <div className="cycle-card">
            <Info className="cycle-icon pink" />
            <div className="cycle-card-info">
              <p>Thời kỳ màu mỡ</p>
              <p className="cycle-card-value">Có</p>
            </div>
          </div>
        </div>

        <div className="cycle-content-grid">
          {/* Calendar */}
          <div className="calendar-section">
            <div className="calendar-header">
              <h2 className="calendar-title">
                {currentDate.format('MMMM YYYY')}
              </h2>
              <div className="calendar-nav">
                <button
                  onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
                  className="nav-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
                  className="nav-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-weekdays">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map(day => (
                <div
                  key={day.format('YYYY-MM-DD')}
                  className={getDayClass(day)}
                  data-tooltip={getDayTooltip(day)}
                >
                  {day.date()}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-dot period"></div>
                <span>Kỳ kinh</span>
                <div className="help-tooltip" data-help="Giai đoạn kinh nguyệt thực tế"></div>
              </div>
              <div className="legend-item">
                <div className="legend-dot ovulation"></div>
                <span>Rụng trứng</span>
                <div className="help-tooltip" data-help="Ngày có khả năng thụ thai cao nhất"></div>
              </div>
              <div className="legend-item">
                <div className="legend-dot fertile"></div>
                <span>Thời kỳ màu mỡ</span>
                <div className="help-tooltip" data-help="Khoảng thời gian có khả năng thụ thai"></div>
              </div>
              <div className="legend-item">
                <div className="legend-dot predicted"></div>
                <span>Kỳ kinh dự đoán</span>
                <div className="help-tooltip" data-help="Dự đoán dựa trên chu kỳ trước"></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Color Guide */}
            <div className="quick-actions-card">
              <h3 className="actions-title">
                Hướng dẫn màu sắc
                <div className="help-tooltip" data-help="Giải thích ý nghĩa của từng màu sắc trong calendar"></div>
              </h3>
              <div className="color-guide">
                <div className="color-item">
                  <div className="color-dot period"></div>
                  <div className="color-info">
                    <h4>🩸 Kỳ kinh</h4>
                    <p>Màu hồng nhạt - Giai đoạn kinh nguyệt thực tế</p>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-dot ovulation"></div>
                  <div className="color-info">
                    <h4>⭐ Rụng trứng</h4>
                    <p>Màu xanh lá - Ngày có khả năng thụ thai cao nhất</p>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-dot fertile"></div>
                  <div className="color-info">
                    <h4>🌸 Thời kỳ màu mỡ</h4>
                    <p>Màu cam nhạt - Khoảng thời gian có khả năng thụ thai</p>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-dot predicted"></div>
                  <div className="color-info">
                    <h4>📅 Kỳ kinh dự đoán</h4>
                    <p>Màu hồng đậm - Dự đoán dựa trên chu kỳ trước</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="cycle-settings-card">
              <h3 className="settings-title">
                Tính năng mới
                <div className="help-tooltip" data-help="Các tính năng mới được thêm vào calendar"></div>
              </h3>
              <div className="features-list">
                <div className="feature-item">
                  <h4>🎨 Màu sắc đẹp</h4>
                  <p>Sử dụng gradient và màu sắc từ ảnh 2 để tạo visual appeal</p>
                </div>
                <div className="feature-item">
                  <h4>💡 Tooltip thông minh</h4>
                  <p>Hover vào ngày để xem thông tin chi tiết</p>
                </div>
                <div className="feature-item">
                  <h4>✨ Animation mượt mà</h4>
                  <p>Hiệu ứng hover và transition đẹp mắt</p>
                </div>
                <div className="feature-item">
                  <h4>📱 Responsive</h4>
                  <p>Tương thích với mọi thiết bị</p>
                </div>
              </div>
            </div>

            {/* Cycle Information */}
            <div className="cycle-settings-card">
              <h3 className="settings-title">
                Thông tin chu kỳ
                <div className="help-tooltip" data-help="Giải thích về các giai đoạn trong chu kỳ kinh nguyệt"></div>
              </h3>
              <div className="cycle-info">
                <div className="info-item">
                  <h4>🩸 Kỳ kinh (1-7 ngày)</h4>
                  <p>Giai đoạn kinh nguyệt thực tế, cơ thể loại bỏ lớp niêm mạc tử cung.</p>
                </div>
                <div className="info-item">
                  <h4>🌸 Thời kỳ màu mỡ (5-7 ngày)</h4>
                  <p>Khoảng thời gian có khả năng thụ thai cao, bao gồm ngày rụng trứng.</p>
                </div>
                <div className="info-item">
                  <h4>⭐ Rụng trứng (1 ngày)</h4>
                  <p>Ngày trứng được giải phóng từ buồng trứng, khả năng thụ thai cao nhất.</p>
                </div>
                <div className="info-item">
                  <h4>📅 Kỳ kinh dự đoán</h4>
                  <p>Dự đoán kỳ kinh tiếp theo dựa trên chu kỳ trước đó.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Info */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            color: '#667eea',
            fontSize: '16px'
          }}>
            Responsive Demo - {screenSize.toUpperCase()}
          </h3>
          <p style={{
            margin: '0',
            color: '#666',
            fontSize: '14px'
          }}>
            {screenSize === 'mobile' && 'Mobile view (375px) - Layout dọc, font nhỏ'}
            {screenSize === 'tablet' && 'Tablet view (768px) - Grid 1 cột, tooltip rút gọn'}
            {screenSize === 'desktop' && 'Desktop view (Full width) - Grid 2 cột, full features'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDemo; 