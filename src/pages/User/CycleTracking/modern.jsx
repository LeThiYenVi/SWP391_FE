import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  Calendar,
  Plus,
  Smile,
  Frown,
  Meh,
  Heart,
  Droplets,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { cycleService } from '../../../services/MenstrualCycleService';
import './modern.css';

// Extend dayjs with plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const ModernCycleTracking = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('period');
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(null);

  // Load data when component mounts or date changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.warn('No authentication token found');
          message.warning('Vui lòng đăng nhập để xem dữ liệu chu kỳ');
          setLoading(false);
          return;
        }

        console.log('Loading cycle data with token:', token ? 'Present' : 'Missing');

        // 1. Load calendar data for current month
        const year = currentDate.year();
        const month = currentDate.month() + 1;

        try {
          const calendarResponse = await cycleService.getCalendarData(year, month);
          console.log('Calendar data:', calendarResponse.data);
          setCalendarData(calendarResponse.data || { logs: [], fertilityWindow: null, periodPrediction: null });
        } catch (calendarError) {
          console.error('Error loading calendar:', calendarError);
          setCalendarData({ logs: [], fertilityWindow: null, periodPrediction: null });
          if (calendarError.response?.status === 401) {
            message.error('Phiên đăng nhập đã hết hạn');
          }
        }

        // 2. Load dashboard data
        try {
          const dashboardResponse = await cycleService.getDashboard();
          console.log('Dashboard data:', dashboardResponse.data);
          setCurrentCycle(dashboardResponse.data || {
            cycleAnalytics: { averageCycleLength: 28, averagePeriodDuration: 5, regularityStatus: 'REGULAR' },
            recentLogs: []
          });
        } catch (dashboardError) {
          console.error('Error loading dashboard:', dashboardError);
          setCurrentCycle({
            cycleAnalytics: { averageCycleLength: 28, averagePeriodDuration: 5, regularityStatus: 'REGULAR' },
            recentLogs: []
          });
          if (dashboardError.response?.status === 401) {
            message.error('Phiên đăng nhập đã hết hạn');
          }
        }

      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải dữ liệu chu kỳ');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentDate]);



  // Mock data for cycle tracking (fallback)
  const cycleData = {
    nextPeriod: calendarData?.periodPrediction?.nextPeriodDate ?
      dayjs(calendarData.periodPrediction.nextPeriodDate).diff(dayjs(), 'day') : 27,
    ovulation: calendarData?.fertilityWindow?.ovulationDate ?
      dayjs(calendarData.fertilityWindow.ovulationDate).diff(dayjs(), 'day') : 13,
    cycleLength: currentCycle?.cycleAnalytics?.averageCycleLength || 28,
    periodLength: currentCycle?.cycleAnalytics?.averagePeriodDuration || 5
  };

  // Calculate cycle phases for calendar
  const calculateCyclePhases = () => {
    const phases = {
      period: [],
      fertile: [],
      ovulation: null,
      predictedPeriod: []
    };

    if (!calendarData) {
      // Fallback mock data
      const periodStart = dayjs().subtract(15, 'day');
      for (let i = 0; i < 5; i++) {
        phases.period.push(periodStart.add(i, 'day').format('YYYY-MM-DD'));
      }
      const ovulationDay = dayjs().add(13, 'day');
      phases.ovulation = ovulationDay.format('YYYY-MM-DD');
      for (let i = -5; i <= 0; i++) {
        phases.fertile.push(ovulationDay.add(i, 'day').format('YYYY-MM-DD'));
      }
      const nextPeriodStart = dayjs().add(27, 'day');
      for (let i = 0; i < 5; i++) {
        phases.predictedPeriod.push(nextPeriodStart.add(i, 'day').format('YYYY-MM-DD'));
      }
      return phases;
    }

    // Get actual period days from logs
    if (calendarData.logs) {
      calendarData.logs.forEach(log => {
        if (log.isActualPeriod) {
          phases.period.push(dayjs(log.logDate).format('YYYY-MM-DD'));
        }
      });
    }

    // Get fertility window from API
    if (calendarData.fertilityWindow) {
      const { fertileWindowStart, fertileWindowEnd, ovulationDate } = calendarData.fertilityWindow;

      if (ovulationDate) {
        phases.ovulation = dayjs(ovulationDate).format('YYYY-MM-DD');
      }

      if (fertileWindowStart && fertileWindowEnd) {
        let current = dayjs(fertileWindowStart);
        const end = dayjs(fertileWindowEnd);

        while (current.isSameOrBefore(end)) {
          phases.fertile.push(current.format('YYYY-MM-DD'));
          current = current.add(1, 'day');
        }
      }
    }

    // Get predicted period from API
    if (calendarData.periodPrediction) {
      const { nextPeriodDate, predictedPeriodDuration } = calendarData.periodPrediction;

      if (nextPeriodDate) {
        const duration = predictedPeriodDuration || 5;
        for (let i = 0; i < duration; i++) {
          phases.predictedPeriod.push(dayjs(nextPeriodDate).add(i, 'day').format('YYYY-MM-DD'));
        }
      }
    }

    return phases;
  };



  // Generate calendar days
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

  const handleModalOk = () => {
    console.log('Saving data...');
    message.success('Đã lưu thông tin thành công!');
    setShowModal(false);
  };

  // Calculate phases and calendar data
  const phases = calculateCyclePhases();
  const calendarDays = generateCalendarDays();

  const getDayClass = (day) => {
    const dayStr = day.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    let classes = ['calendar-day'];

    if (dayStr === today) classes.push('today');
    if (phases.period.includes(dayStr)) classes.push('period');
    if (phases.ovulation === dayStr) classes.push('ovulation');
    if (phases.fertile.includes(dayStr)) classes.push('fertile');
    if (phases.predictedPeriod.includes(dayStr)) classes.push('predicted-period');

    return classes.join(' ');
  };

  const handleStartPeriod = async () => {
    try {
      const today = dayjs().format('YYYY-MM-DD');

      // Log menstrual period
      await cycleService.logMenstrualPeriod({
        logDate: today,
        isActualPeriod: true,
        flowIntensity: 'MEDIUM'
      });

      message.success('Đã bắt đầu ghi nhận kỳ kinh!');

      // Reload data
      const year = currentDate.year();
      const month = currentDate.month() + 1;
      const calendarResponse = await cycleService.getCalendarData(year, month);
      if (calendarResponse.data) {
        setCalendarData(calendarResponse.data);
      }

    } catch (error) {
      console.error('Error starting period:', error);
      message.error('Không thể ghi nhận kỳ kinh');
    }
  };

  const handleAddSymptom = (symptom) => {
    console.log('Adding symptom:', symptom);
    message.success(`Đã thêm triệu chứng: ${symptom}`);
  };

  const handleAddMood = (mood) => {
    console.log('Adding mood:', mood);
    message.success(`Đã ghi nhận tâm trạng: ${mood}`);
  };

  const handleAddNote = (note) => {
    console.log('Adding note:', note);
    message.success('Đã thêm ghi chú!');
  };

  const symptomList = [
    'Đau bụng', 'Đau đầu', 'Buồn nôn', 'Mệt mỏi', 'Căng thẳng',
    'Thay đổi tâm trạng', 'Đau lưng', 'Chóng mặt', 'Khó ngủ'
  ];

  const moodList = [
    { icon: Smile, label: 'Vui vẻ', value: 'happy' },
    { icon: Meh, label: 'Bình thường', value: 'neutral' },
    { icon: Frown, label: 'Buồn', value: 'sad' }
  ];

  if (loading) {
    return (
      <div className="cycle-tracking-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>Đang tải dữ liệu chu kỳ...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cycle-tracking-container">
      {/* Header */}
      <div className="cycle-header">
        <div className="cycle-header-content">
          <div className="cycle-header-info">
            <h1>Theo dõi chu kỳ</h1>
            <p>Ghi nhận và theo dõi chu kỳ sinh sản của bạn</p>
          </div>
          <button onClick={handleStartPeriod} className="start-period-btn">
            Bắt đầu kỳ kinh
          </button>
        </div>
      </div>

      <div className="cycle-main">
        {/* Overview Cards */}
        <div className="cycle-overview">
          <div className="cycle-card">
            <Calendar className="cycle-icon pink" />
            <div className="cycle-card-info">
              <p>Kỳ kinh tiếp theo</p>
              <p className="cycle-card-value">
                {cycleData.nextPeriod} ngày
              </p>
            </div>
          </div>

          <div className="cycle-card">
            <Heart className="cycle-icon orange" />
            <div className="cycle-card-info">
              <p>Rụng trứng</p>
              <p className="cycle-card-value">
                {cycleData.ovulation} ngày
              </p>
            </div>
          </div>

          <div className="cycle-card">
            <Droplets className="cycle-icon blue" />
            <div className="cycle-card-info">
              <p>Độ dài chu kỳ</p>
              <p className="cycle-card-value">{cycleData.cycleLength} ngày</p>
            </div>
          </div>

          <div className="cycle-card">
            <div className="cycle-icon pink">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'currentColor',
                }}
              ></div>
            </div>
            <div className="cycle-card-info">
              <p>Thời kỳ màu mỡ</p>
              <p className="cycle-card-value">Không</p>
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
                  onClick={() => {
                    setSelectedDate(day);
                    setShowModal(true);
                  }}
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
              </div>
              <div className="legend-item">
                <div className="legend-dot fertile"></div>
                <span>Rụng trứng</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot predicted"></div>
                <span>Thời kỳ màu mỡ</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3 className="actions-title">Ghi nhận nhanh</h3>
              <div className="action-buttons">
                <button
                  onClick={() => {
                    setModalType('symptom');
                    setShowModal(true);
                  }}
                  className="action-btn symptoms"
                >
                  <Plus size={16} />
                  Thêm triệu chứng
                </button>
                <button
                  onClick={() => {
                    setModalType('mood');
                    setShowModal(true);
                  }}
                  className="action-btn mood"
                >
                  <Plus size={16} />
                  Ghi nhận tâm trạng
                </button>
                <button
                  onClick={() => {
                    setModalType('note');
                    setShowModal(true);
                  }}
                  className="action-btn notes"
                >
                  <Plus size={16} />
                  Thêm ghi chú
                </button>
              </div>
            </div>

            {/* Cycle Settings */}
            <div className="cycle-settings-card">
              <h3 className="settings-title">Thiết lập chu kỳ</h3>
              <div className="settings-row">
                <div className="setting-item">
                  <label>Độ dài chu kỳ (ngày)</label>
                  <input type="number" value={cycleData.cycleLength} readOnly />
                </div>
                <div className="setting-item">
                  <label>Số ngày kinh (ngày)</label>
                  <input type="number" value={cycleData.periodLength} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {modalType === 'symptom' && 'Thêm triệu chứng'}
              {modalType === 'mood' && 'Ghi nhận tâm trạng'}
              {modalType === 'note' && 'Thêm ghi chú'}
              {modalType === 'period' && `Chi tiết ngày ${selectedDate?.format('DD/MM/YYYY')}`}
            </h3>

            {modalType === 'symptom' && (
              <div className="option-list">
                {symptomList.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => {
                      handleAddSymptom(symptom);
                      setShowModal(false);
                    }}
                    className="option-item"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            )}

            {modalType === 'mood' && (
              <div className="option-list">
                {moodList.map(({ icon: Icon, label, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      handleAddMood(label);
                      setShowModal(false);
                    }}
                    className="option-item mood-item"
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {modalType === 'note' && (
              <div className="note-form">
                <textarea
                  placeholder="Nhập ghi chú của bạn..."
                  rows={4}
                  className="note-textarea"
                />
                <div className="modal-buttons">
                  <button
                    onClick={() => setShowModal(false)}
                    className="modal-btn cancel"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      handleAddNote('Ghi chú mới');
                      setShowModal(false);
                    }}
                    className="modal-btn confirm"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}

            {modalType === 'period' && (
              <div className="period-form">
                <div className="form-group">
                  <label>Có phải ngày kinh?</label>
                  <input type="checkbox" />
                </div>
                <div className="form-group">
                  <label>Cường độ</label>
                  <select>
                    <option value="">Chọn cường độ</option>
                    <option value="light">Nhẹ</option>
                    <option value="medium">Vừa</option>
                    <option value="heavy">Nặng</option>
                  </select>
                </div>
                <div className="modal-buttons">
                  <button
                    onClick={() => setShowModal(false)}
                    className="modal-btn cancel"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      handleModalOk();
                      setShowModal(false);
                    }}
                    className="modal-btn confirm"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}

            {modalType !== 'note' && modalType !== 'period' && (
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernCycleTracking;
