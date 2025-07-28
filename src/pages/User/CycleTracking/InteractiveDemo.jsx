import React, { useState, useEffect } from 'react';
import { message, Modal, Select, Input, Button, Card, Tag } from 'antd';
import {
  Calendar,
  Heart,
  Droplets,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import MenstrualCycleService from '../../../services/MenstrualCycleService';
import './modern.css';

const { TextArea } = Input;
const { Option } = Select;

const InteractiveDemo = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [cycleData, setCycleData] = useState(null);
  const [phases, setPhases] = useState({
    period: [],
    ovulation: '',
    fertile: [],
    predictedPeriod: []
  });
  const [loading, setLoading] = useState(true);
  
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

  // Demo data for testing
  const [demoLogs, setDemoLogs] = useState([]);

  useEffect(() => {
    fetchCycleData();
  }, []);

  const fetchCycleData = async () => {
    try {
      setLoading(true);
      const response = await MenstrualCycleService.getCurrentMenstrualCycle();
      if (response.success) {
        setCycleData(response.data);
        calculatePhases(response.data);
      } else {
        // Use demo data if no real data
        const demoData = {
          startDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
          cycleLength: 28,
          periodDuration: 5,
          ovulationDate: dayjs().add(4, 'days').format('YYYY-MM-DD'),
          fertilityWindowStart: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          fertilityWindowEnd: dayjs().add(5, 'days').format('YYYY-MM-DD'),
          nextPredictedPeriod: dayjs().add(18, 'days').format('YYYY-MM-DD')
        };
        setCycleData(demoData);
        calculatePhases(demoData);
      }
    } catch (error) {
      console.error('Error fetching cycle data:', error);
      // Use demo data on error
      const demoData = {
        startDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
        cycleLength: 28,
        periodDuration: 5,
        ovulationDate: dayjs().add(4, 'days').format('YYYY-MM-DD'),
        fertilityWindowStart: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        fertilityWindowEnd: dayjs().add(5, 'days').format('YYYY-MM-DD'),
        nextPredictedPeriod: dayjs().add(18, 'days').format('YYYY-MM-DD')
      };
      setCycleData(demoData);
      calculatePhases(demoData);
    } finally {
      setLoading(false);
    }
  };

  const calculatePhases = (data) => {
    if (!data) return;

    const startDate = dayjs(data.startDate);
    const periodDuration = data.periodDuration || 5;
    const cycleLength = data.cycleLength || 28;

    // Calculate period days
    const periodDays = [];
    for (let i = 0; i < periodDuration; i++) {
      periodDays.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
    }

    // Calculate ovulation
    const ovulationDate = dayjs(data.ovulationDate).format('YYYY-MM-DD');

    // Calculate fertile window
    const fertileDays = [];
    const fertilityStart = dayjs(data.fertilityWindowStart);
    const fertilityEnd = dayjs(data.fertilityWindowEnd);
    let current = fertilityStart;
    while (current.isBefore(fertilityEnd) || current.isSame(fertilityEnd, 'day')) {
      fertileDays.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }

    // Calculate predicted period
    const predictedPeriodDays = [];
    const nextPeriodStart = dayjs(data.nextPredictedPeriod);
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

    return classes.join(' ');
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
      } else {
        // Use demo data
        const existingLog = demoLogs.find(log => log.date === dayStr);
        setDayLog({
          isPeriodDay: existingLog?.isPeriodDay || false,
          intensity: existingLog?.intensity || '',
          symptoms: existingLog?.symptoms || '',
          mood: existingLog?.mood || '',
          notes: existingLog?.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching day log:', error);
      // Use demo data
      const existingLog = demoLogs.find(log => log.date === dayStr);
      setDayLog({
        isPeriodDay: existingLog?.isPeriodDay || false,
        intensity: existingLog?.intensity || '',
        symptoms: existingLog?.symptoms || '',
        mood: existingLog?.mood || '',
        notes: existingLog?.notes || ''
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
        // Update demo logs
        setDemoLogs(prev => {
          const filtered = prev.filter(log => log.date !== logData.date);
          return [...filtered, logData];
        });
        setIsModalVisible(false);
      } else {
        message.error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating day log:', error);
      // Update demo logs locally
      setDemoLogs(prev => {
        const filtered = prev.filter(log => log.date !== selectedDate.format('YYYY-MM-DD'));
        return [...filtered, {
          date: selectedDate.format('YYYY-MM-DD'),
          ...dayLog
        }];
      });
      message.success('Cập nhật thành công (Demo)');
      setIsModalVisible(false);
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
      } else {
        message.error(response.message || 'Ghi nhận thất bại');
      }
    } catch (error) {
      setDemoLogs(prev => [...prev, {
        date: dayjs().format('YYYY-MM-DD'),
        [quickLogType.toLowerCase()]: quickLogContent
      }]);
      message.success('Ghi nhận thành công (Demo)');
      setQuickLogModal(false);
      setQuickLogContent('');
    } finally {
      setModalLoading(false);
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

  return (
    <div className="cycle-tracking-container">
      {/* Header */}
      <div className="cycle-header">
        <div className="cycle-header-content">
          <div className="cycle-header-info">
            <h1>Interactive Demo - API Testing</h1>
            <p>Test tất cả tính năng mới với API backend</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Tag color="green">API Ready</Tag>
            <button className="start-period-btn">
              Bắt đầu kỳ kinh
            </button>
          </div>
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
                {cycleData ? dayjs(cycleData.nextPredictedPeriod).diff(dayjs(), 'day') : '--'} ngày
              </p>
            </div>
          </div>

          <div className="cycle-card">
            <Heart className="cycle-icon orange" />
            <div className="cycle-card-info">
              <p>Rụng trứng</p>
              <p className="cycle-card-value">
                {cycleData ? dayjs(cycleData.ovulationDate).diff(dayjs(), 'day') : '--'} ngày
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
                    defaultValue={cycleData?.cycleLength || 30}
                    min="20"
                    max="40"
                  />
                </div>
                <div className="setting-item">
                  <label>Số ngày kinh (ngày)</label>
                  <input
                    type="number"
                    defaultValue={cycleData?.periodDuration || 7}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
            </div>

            {/* Demo Logs */}
            <div className="cycle-settings-card">
              <h3 className="settings-title">
                Demo Logs
                <div className="help-tooltip" data-help="Các log đã được tạo trong demo"></div>
              </h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {demoLogs.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '12px' }}>Chưa có log nào</p>
                ) : (
                  demoLogs.map((log, index) => (
                    <div key={index} style={{ 
                      padding: '8px', 
                      marginBottom: '8px', 
                      background: '#f8f9ff', 
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {dayjs(log.date).format('DD/MM/YYYY')}
                      </div>
                      {log.isPeriodDay && <Tag color="red" size="small">Kỳ kinh</Tag>}
                      {log.intensity && <Tag color="orange" size="small">{log.intensity}</Tag>}
                      {log.symptoms && <div>Triệu chứng: {log.symptoms}</div>}
                      {log.mood && <div>Tâm trạng: {log.mood}</div>}
                      {log.notes && <div>Ghi chú: {log.notes}</div>}
                    </div>
                  ))
                )}
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
              <Option value="LIGHT">Nhẹ</Option>
              <Option value="MEDIUM">Trung bình</Option>
              <Option value="HEAVY">Nặng</Option>
            </Select>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Triệu chứng</label>
          <TextArea
            value={dayLog.symptoms}
            onChange={(e) => setDayLog({ ...dayLog, symptoms: e.target.value })}
            placeholder="Nhập triệu chứng..."
            rows={3}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Tâm trạng</label>
          <TextArea
            value={dayLog.mood}
            onChange={(e) => setDayLog({ ...dayLog, mood: e.target.value })}
            placeholder="Nhập tâm trạng..."
            rows={3}
          />
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
          <TextArea
            value={quickLogContent}
            onChange={(e) => setQuickLogContent(e.target.value)}
            placeholder={`Nhập ${
              quickLogType === 'SYMPTOMS' ? 'triệu chứng' :
              quickLogType === 'MOOD' ? 'tâm trạng' : 'ghi chú'
            }...`}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default InteractiveDemo; 