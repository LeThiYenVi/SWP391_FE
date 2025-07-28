import React, { useState, useEffect } from 'react';
import { message, Modal, Select, Input, Button } from 'antd';
import {
  Calendar,
  Heart,
  Droplets,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
  AlertCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import MenstrualCycleService from '../../../services/MenstrualCycleService';
import './modern.css';

const { TextArea } = Input;
const { Option } = Select;

// Predefined options for symptoms and moods
const SYMPTOM_OPTIONS = [
  { value: 'CRAMPS', label: 'Đau bụng kinh' },
  { value: 'HEADACHE', label: 'Đau đầu' },
  { value: 'BACK_PAIN', label: 'Đau lưng' },
  { value: 'BREAST_TENDERNESS', label: 'Đau ngực' },
  { value: 'BLOATING', label: 'Đầy hơi' },
  { value: 'FATIGUE', label: 'Mệt mỏi' },
  { value: 'MOOD_SWINGS', label: 'Thay đổi tâm trạng' },
  { value: 'FOOD_CRAVINGS', label: 'Thèm ăn' },
  { value: 'ACNE', label: 'Mụn' },
  { value: 'OTHER', label: 'Khác' }
];

const MOOD_OPTIONS = [
  { value: 'HAPPY', label: 'Vui vẻ' },
  { value: 'SAD', label: 'Buồn' },
  { value: 'IRRITABLE', label: 'Cáu gắt' },
  { value: 'ANXIOUS', label: 'Lo lắng' },
  { value: 'CALM', label: 'Bình tĩnh' },
  { value: 'ENERGETIC', label: 'Năng lượng' },
  { value: 'TIRED', label: 'Mệt mỏi' },
  { value: 'STRESSED', label: 'Căng thẳng' },
  { value: 'EMOTIONAL', label: 'Xúc động' },
  { value: 'NORMAL', label: 'Bình thường' },
  { value: 'OTHER', label: 'Khác' }
];

const INTENSITY_OPTIONS = [
  { value: 'SPOTTING', label: 'Rất nhẹ' },
  { value: 'LIGHT', label: 'Nhẹ' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HEAVY', label: 'Nặng' },
  { value: 'VERY_HEAVY', label: 'Rất nặng' }
];

const ModernCycleTracking = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [cycleData, setCycleData] = useState(null);
  const [phases, setPhases] = useState({
    period: [],
    ovulation: '',
    fertile: [],
    predictedPeriod: []
  });
  const [loading, setLoading] = useState(true);
  const [genderError, setGenderError] = useState(false);
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayLog, setDayLog] = useState({
    isPeriodDay: false,
    intensity: '',
    symptoms: '',
    mood: '',
    notes: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Quick log states
  const [quickLogModal, setQuickLogModal] = useState(false);
  const [quickLogType, setQuickLogType] = useState('');
  const [quickLogContent, setQuickLogContent] = useState('');
  const [cycleSettings, setCycleSettings] = useState({
    cycleLength: 28,
    periodDuration: 7
  });
  const [updatingSettings, setUpdatingSettings] = useState(false);

  useEffect(() => {
    console.log('useEffect 1: Initial fetch');
    fetchCycleData();
  }, []);

  useEffect(() => {
    if (cycleData) {
      setCycleSettings({
        cycleLength: cycleData.cycleLength || 28,
        periodDuration: cycleData.periodDuration || 7
      });
    }
  }, [cycleData]);

  useEffect(() => {
    if (cycleData) {
      fetchPhasesForCurrentMonth();
    }
  }, [currentDate, cycleData]);

  const fetchPhasesForCurrentMonth = async () => {
    try {
      const year = currentDate.year();
      const month = currentDate.month() + 1;
      const response = await MenstrualCycleService.getDetailedPhasesForMonth(year, month);
      if (response && typeof response === 'object') {
        const phasesData = response;
        const periodDays = [];
        const ovulationDays = [];
        const fertileDays = [];
        const predictedDays = [];
        const phaseInfo = {};

        Object.entries(phasesData).forEach(([dateStr, phaseDetail]) => {
          const phase = phaseDetail.phase;
          switch (phase) {
            case 'PERIOD':
              periodDays.push(dateStr);
              break;
            case 'OVULATION':
              ovulationDays.push(dateStr);
              break;
            case 'FERTILE':
              fertileDays.push(dateStr);
              break;
            case 'PREDICTED':
              predictedDays.push(dateStr);
              break;
            case 'NORMAL':
              break;
            default:
              break;
          }
          phaseInfo[dateStr] = phaseDetail;
        });

        const newPhases = {
          period: periodDays,
          ovulation: ovulationDays.length > 0 ? ovulationDays[0] : '',
          fertile: fertileDays,
          predictedPeriod: predictedDays,
          phaseInfo: phaseInfo
        };
        setPhases(newPhases);
      }
    } catch (error) {
      try {
        const year = currentDate.year();
        const month = currentDate.month() + 1;
        const response = await MenstrualCycleService.getPhasesForMonth(year, month);
        if (response && typeof response === 'object') {
          const phasesData = response;
          const periodDays = [];
          const ovulationDays = [];
          const fertileDays = [];
          const predictedDays = [];

          Object.entries(phasesData).forEach(([dateStr, phase]) => {
            switch (phase) {
              case 'PERIOD':
                periodDays.push(dateStr);
                break;
              case 'OVULATION':
                ovulationDays.push(dateStr);
                break;
              case 'FERTILE':
                fertileDays.push(dateStr);
                break;
              case 'PREDICTED':
                predictedDays.push(dateStr);
                break;
              case 'NORMAL':
                break;
              default:
                break;
            }
          });

          const newPhases = {
            period: periodDays,
            ovulation: ovulationDays.length > 0 ? ovulationDays[0] : '',
            fertile: fertileDays,
            predictedPeriod: predictedDays
          };
          setPhases(newPhases);
        }
      } catch (fallbackError) {
        if (cycleData) {
          calculatePhases(cycleData);
        }
      }
    }
  };

  const fetchCycleData = async () => {
    try {
      setLoading(true);
      setGenderError(false);
      const response = await MenstrualCycleService.getCurrentMenstrualCycle();

      if (response && response.startDate) {
        setCycleData(response);
        await fetchPhasesForCurrentMonth();
      } else {
        message.warning('Chưa có dữ liệu chu kỳ');
      }
    } catch (error) {
      // Check if the error response contains the gender validation message
      if (error.response?.data?.message &&
          error.response.data.message.includes('chưa chọn giới tính')) {
        setGenderError(true);
      } else {
        message.error('Lỗi khi tải dữ liệu chu kỳ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };



  const calculatePhases = (data) => {
    if (!data) return;

    const startDate = dayjs(data.startDate);
    const periodDuration = data.periodDuration || 5;
    const cycleLength = data.cycleLength || 28;

    const periodDays = [];
    for (let i = 0; i < periodDuration; i++) {
      periodDays.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
    }

    const ovulationDate = startDate.add(cycleLength - 14, 'day').format('YYYY-MM-DD');

    const fertileDays = [];
    const ovulation = dayjs(ovulationDate);
    for (let i = -5; i <= 1; i++) {
      fertileDays.push(ovulation.add(i, 'day').format('YYYY-MM-DD'));
    }

    const predictedPeriodDays = [];
    const nextPeriodStart = startDate.add(cycleLength, 'day');
    for (let i = 0; i < periodDuration; i++) {
      predictedPeriodDays.push(nextPeriodStart.add(i, 'day').format('YYYY-MM-DD'));
    }

    setPhases({
      period: periodDays,
      ovulation: ovulationDate,
      fertile: fertileDays,
      predictedPeriod: predictedPeriodDays
    });
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
    if (phases.period.includes(dayStr)) classes.push('period');
    if (phases.ovulation === dayStr) classes.push('ovulation');
    if (phases.fertile.includes(dayStr)) classes.push('fertile');
    if (phases.predictedPeriod.includes(dayStr)) classes.push('predicted-period');

    // Debug log for specific dates
    if (dayStr === '2025-01-15' || dayStr === '2025-01-16' || dayStr === '2025-01-17') {
      console.log('Day class for', dayStr, ':', classes.join(' '), 'phases:', phases);
    }

    return classes.join(' ');
  };

  const getDayStyle = (day) => {
    const dayStr = day.format('YYYY-MM-DD');
    
    // If we have detailed phase info, use it for styling
    if (phases.phaseInfo && phases.phaseInfo[dayStr]) {
      const phaseDetail = phases.phaseInfo[dayStr];
      return {
        background: phaseDetail.color,
        color: phaseDetail.color === '#ffffff' ? '#333' : 'white',
        fontWeight: '600'
      };
    }
    
    return {};
  };

  const getDayTooltip = (day) => {
    const dayStr = day.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    if (dayStr === today) {
      return 'Hôm nay';
    }

    if (phases.period.includes(dayStr)) {
      return '🩸 Kỳ kinh - Giai đoạn kinh nguyệt';
    }

    if (phases.ovulation === dayStr) {
      return '⭐ Rụng trứng - Ngày có khả năng thụ thai cao nhất';
    }

    if (phases.fertile.includes(dayStr)) {
      return '🌸 Thời kỳ màu mỡ - Có khả năng thụ thai';
    }

    if (phases.predictedPeriod.includes(dayStr)) {
      return '📅 Kỳ kinh dự đoán - Dựa trên chu kỳ trước';
    }

    return `Ngày ${day.format('DD/MM/YYYY')}`;
  };

  const handleDayClick = async (day) => {
    const dayStr = day.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    
    // Validation: Không cho phép chọn ngày trong tương lai
    if (dayStr > today) {
      message.warning('Không thể ghi nhận thông tin cho ngày trong tương lai');
      return;
    }
    
    setSelectedDate(day);
    
    try {
      setModalLoading(true);
      const response = await MenstrualCycleService.getDayLog(dayStr);
      if (response.success) {
        setDayLog({
          isPeriodDay: response.data.isPeriodDay || false,
          intensity: response.data.intensity || '',
          symptoms: response.data.symptoms || '',
          mood: response.data.mood || '',
          notes: response.data.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching day log:', error);
      setDayLog({
        isPeriodDay: false,
        intensity: '',
        symptoms: '',
        mood: '',
        notes: ''
      });
    } finally {
      setModalLoading(false);
      setIsModalVisible(true);
    }
  };

  const handleUpdateDayLog = async () => {
    if (!selectedDate) return;

    try {
      setModalLoading(true);
      const logData = {
        date: selectedDate.format('YYYY-MM-DD'),
        ...dayLog
      };

      const response = await MenstrualCycleService.updateDayLog(logData);
      if (response.success) {
        message.success('Cập nhật thành công');
        setIsModalVisible(false);
        // Refresh cycle data if needed
        await fetchCycleData();
      } else {
        message.error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating day log:', error);
      message.error('Lỗi khi cập nhật');
    } finally {
      setModalLoading(false);
    }
  };

  const handleQuickLog = (type) => {
    setQuickLogType(type);
    setQuickLogContent('');
    setQuickLogModal(true);
  };

  const handleSubmitQuickLog = async () => {
    if (!quickLogContent.trim()) {
      message.warning('Vui lòng nhập nội dung');
      return;
    }

    try {
      setModalLoading(true);
      const logData = {
        date: dayjs().format('YYYY-MM-DD'),
        type: quickLogType,
        content: quickLogContent
      };

      const response = await MenstrualCycleService.quickLog(logData);
      if (response.success) {
        message.success('Ghi nhận thành công');
        setQuickLogModal(false);
        setQuickLogContent('');
        await fetchCycleData();
      } else {
        message.error(response.message || 'Ghi nhận thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi ghi nhận');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateCycleSettings = async (field, value) => {
    const newSettings = { ...cycleSettings, [field]: parseInt(value) };
    setCycleSettings(newSettings);

    try {
      setUpdatingSettings(true);
      const response = await MenstrualCycleService.updateCycleSettings(newSettings);
      if (response.success) {
        message.success('Cập nhật thiết lập thành công');
        // Refresh cycle data to get updated calculations
        await fetchCycleData();
      } else {
        message.error(response.message || 'Cập nhật thất bại');
        // Revert to original values
        setCycleSettings({
          cycleLength: cycleData?.cycleLength || 28,
          periodDuration: cycleData?.periodDuration || 7
        });
      }
    } catch (error) {
      console.error('Error updating cycle settings:', error);
      message.error('Lỗi khi cập nhật thiết lập');
      // Revert to original values
      setCycleSettings({
        cycleLength: cycleData?.cycleLength || 28,
        periodDuration: cycleData?.periodDuration || 7
      });
    } finally {
      setUpdatingSettings(false);
    }
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="cycle-tracking-container">
        <div className="cycle-main">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (genderError) {
    return (
      <div className="cycle-tracking-container">
        <div className="gender-error-container">
          <div>
            <AlertCircle className="alert-icon" size={50} />
            <h2>Bạn chưa chọn giới tính</h2>
            <p>Vui lòng điền giới tính trong trang cá nhân để theo dõi chu kỳ sinh sản.</p>
            <Button type="primary" onClick={handleGoToProfile}>
              Đi đến trang cá nhân
            </Button>
          </div>
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
          <button className="start-period-btn">
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
                {cycleData ? (() => {
                  console.log('Calculating days diff for:', cycleData.nextPredictedPeriod);
                  const diff = dayjs(cycleData.nextPredictedPeriod).diff(dayjs(), 'day');
                  console.log('Days diff result:', diff);
                  return diff;
                })() : '--'} ngày
              </p>
              {console.log('Current cycleData in render:', cycleData)}
            </div>
          </div>

          <div className="cycle-card">
            <Heart className="cycle-icon orange" />
            <div className="cycle-card-info">
              <p>Rụng trứng</p>
              <p className="cycle-card-value">
                {cycleData ? (() => {
                  const daysDiff = dayjs(cycleData.ovulationDate).diff(dayjs(), 'day');
                  if (daysDiff > 0) {
                    return `${daysDiff} ngày nữa`;
                  } else if (daysDiff < 0) {
                    return `${Math.abs(daysDiff)} ngày trước`;
                  } else {
                    return 'Hôm nay';
                  }
                })() : '--'}
              </p>
            </div>
          </div>

          <div className="cycle-card">
            <Droplets className="cycle-icon blue" />
            <div className="cycle-card-info">
              <p>Độ dài chu kỳ</p>
              <p className="cycle-card-value">{cycleData?.cycleLength || '--'} ngày</p>
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
                Tháng {currentDate.format('M')} năm {currentDate.format('YYYY')}
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
                  style={getDayStyle(day)}
                  data-tooltip={getDayTooltip(day)}
                  onClick={() => handleDayClick(day)}
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
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3 className="actions-title">
                Ghi nhận nhanh
                <div className="help-tooltip" data-help="Ghi nhận nhanh các thông tin quan trọng"></div>
              </h3>
              <div className="action-buttons">
                <button
                  className="action-btn symptoms"
                  onClick={() => handleQuickLog('SYMPTOMS')}
                >
                  <Plus size={16} />
                  Thêm triệu chứng
                </button>
                <button
                  className="action-btn mood"
                  onClick={() => handleQuickLog('MOOD')}
                >
                  <Plus size={16} />
                  Ghi nhận tâm trạng
                </button>
                <button
                  className="action-btn notes"
                  onClick={() => handleQuickLog('NOTES')}
                >
                  <Plus size={16} />
                  Thêm ghi chú
                </button>
              </div>
            </div>

            {/* Cycle Settings */}
            <div className="cycle-settings-card">
              <h3 className="settings-title">
                Thiết lập chu kỳ
                <div className="help-tooltip" data-help="Cài đặt thông số chu kỳ"></div>
              </h3>
              <div className="settings-row">
                <div className="setting-item">
                  <label>Độ dài chu kỳ (ngày)</label>
                  <input
                    type="number"
                    value={cycleSettings.cycleLength}
                    onChange={(e) => handleUpdateCycleSettings('cycleLength', e.target.value)}
                    min="20"
                    max="40"
                    disabled={updatingSettings}
                  />
                </div>
                <div className="setting-item">
                  <label>Số ngày kinh (ngày)</label>
                  <input
                    type="number"
                    value={cycleSettings.periodDuration}
                    onChange={(e) => handleUpdateCycleSettings('periodDuration', e.target.value)}
                    min="3"
                    max="10"
                    disabled={updatingSettings}
                  />
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
      </div>

      {/* Day Log Modal */}
      <Modal
        title={`Chi tiết ngày ${selectedDate?.format('DD/MM/YYYY')}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleUpdateDayLog} loading={modalLoading}>
            Lưu
          </Button>
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={dayLog.isPeriodDay}
              onChange={(e) => setDayLog({ ...dayLog, isPeriodDay: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Có phải ngày kinh?
          </label>
        </div>

        {dayLog.isPeriodDay && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Cường độ</label>
            <Select
              value={dayLog.intensity}
              onChange={(value) => setDayLog({ ...dayLog, intensity: value })}
              placeholder="Chọn cường độ"
              style={{ width: '100%' }}
            >
              {INTENSITY_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
              </div>
            )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Triệu chứng</label>
          <Select
            value={dayLog.symptoms}
            onChange={(value) => setDayLog({ ...dayLog, symptoms: value })}
            placeholder="Chọn triệu chứng"
            style={{ width: '100%' }}
            optionFilterProp="label"
          >
            {SYMPTOM_OPTIONS.map(option => (
              <Option key={option.value} value={option.value} label={option.label}>
                {option.label}
              </Option>
            ))}
            <Option value="OTHER" label="Khác">
              Khác
            </Option>
          </Select>
          
          {dayLog.symptoms === 'OTHER' && (
            <Input
              placeholder="Nhập triệu chứng khác..."
              style={{ marginTop: 8 }}
              onChange={(e) => setDayLog({ ...dayLog, symptoms: e.target.value })}
            />
          )}
              </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Tâm trạng</label>
          <Select
            value={dayLog.mood}
            onChange={(value) => setDayLog({ ...dayLog, mood: value })}
            placeholder="Chọn tâm trạng"
            style={{ width: '100%' }}
            optionFilterProp="label"
          >
            {MOOD_OPTIONS.map(option => (
              <Option key={option.value} value={option.value} label={option.label}>
                {option.label}
              </Option>
            ))}
            <Option value="OTHER" label="Khác">
              Khác
            </Option>
          </Select>
          
          {dayLog.mood === 'OTHER' && (
            <Input
              placeholder="Nhập tâm trạng khác..."
              style={{ marginTop: 8 }}
              onChange={(e) => setDayLog({ ...dayLog, mood: e.target.value })}
            />
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Ghi chú</label>
          <TextArea
            value={dayLog.notes}
            onChange={(e) => setDayLog({ ...dayLog, notes: e.target.value })}
            placeholder="Nhập ghi chú..."
            rows={3}
          />
        </div>
      </Modal>

      {/* Quick Log Modal */}
      <Modal
        title={`Ghi nhận nhanh - ${
          quickLogType === 'SYMPTOMS' ? 'Triệu chứng' :
          quickLogType === 'MOOD' ? 'Tâm trạng' : 'Ghi chú'
        }`}
        open={quickLogModal}
        onCancel={() => setQuickLogModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setQuickLogModal(false)}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleSubmitQuickLog} loading={modalLoading}>
            Lưu
          </Button>
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            {quickLogType === 'SYMPTOMS' ? 'Triệu chứng' :
             quickLogType === 'MOOD' ? 'Tâm trạng' : 'Ghi chú'}
          </label>
          
          {quickLogType === 'SYMPTOMS' && (
            <Select
              value={quickLogContent}
              onChange={(value) => setQuickLogContent(value)}
              placeholder="Chọn triệu chứng"
              style={{ width: '100%' }}
              optionFilterProp="label"
            >
              {SYMPTOM_OPTIONS.map(option => (
                <Option key={option.value} value={option.value} label={option.label}>
                  {option.label}
                </Option>
              ))}
              <Option value="OTHER" label="Khác">
                Khác
              </Option>
            </Select>
          )}
          
          {quickLogType === 'SYMPTOMS' && quickLogContent === 'OTHER' && (
            <Input
              placeholder="Nhập triệu chứng khác..."
              style={{ marginTop: 8 }}
              onChange={(e) => setQuickLogContent(e.target.value)}
            />
          )}
          
          {quickLogType === 'MOOD' && (
            <Select
              value={quickLogContent}
              onChange={(value) => setQuickLogContent(value)}
              placeholder="Chọn tâm trạng"
              style={{ width: '100%' }}
              optionFilterProp="label"
            >
              {MOOD_OPTIONS.map(option => (
                <Option key={option.value} value={option.value} label={option.label}>
                  {option.label}
                </Option>
              ))}
              <Option value="OTHER" label="Khác">
                Khác
              </Option>
            </Select>
          )}
          
          {quickLogType === 'MOOD' && quickLogContent === 'OTHER' && (
            <Input
              placeholder="Nhập tâm trạng khác..."
              style={{ marginTop: 8 }}
              onChange={(e) => setQuickLogContent(e.target.value)}
            />
          )}
          
          {quickLogType === 'NOTES' && (
            <TextArea
              value={quickLogContent}
              onChange={(e) => setQuickLogContent(e.target.value)}
              placeholder="Nhập ghi chú..."
              rows={4}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ModernCycleTracking;
