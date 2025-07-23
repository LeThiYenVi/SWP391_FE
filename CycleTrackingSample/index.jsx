import React, { useState } from 'react';
import { useCycle } from '../../../context/CycleContext';
import {
  Calendar,
  Plus,
  Smile,
  Frown,
  Meh,
  Heart,
  Droplets,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import './index.css';

const CycleTracking = () => {
  const {
    cycleData,
    predictions,
    updateCycleData,
    addSymptom,
    addMood,
    addNote,
    getDaysUntilNextPeriod,
    getDaysUntilOvulation,
    isInFertilityWindow,
  } = useCycle();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('period'); // period, symptom, mood, note

  const today = new Date();
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleStartPeriod = () => {
    updateCycleData({
      lastPeriod: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const moodIcons = {
    happy: { icon: Smile, color: 'text-green-500', label: 'Vui vẻ' },
    sad: { icon: Frown, color: 'text-blue-500', label: 'Buồn' },
    neutral: { icon: Meh, color: 'text-gray-500', label: 'Bình thường' },
  };

  const symptomList = [
    'Đau bụng',
    'Đau lưng',
    'Đau đầu',
    'Buồn nôn',
    'Mệt mỏi',
    'Thay đổi cảm xúc',
    'Tăng cân',
  ];

  const getPeriodPhase = date => {
    if (!cycleData.lastPeriod) return null;

    const lastPeriod = new Date(cycleData.lastPeriod);
    const daysDiff = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay =
      ((daysDiff % cycleData.cycleLength) + cycleData.cycleLength) %
      cycleData.cycleLength;

    if (cycleDay < cycleData.periodLength) return 'period';
    if (
      cycleDay >= cycleData.cycleLength - 16 &&
      cycleDay <= cycleData.cycleLength - 12
    )
      return 'ovulation';
    if (
      cycleDay >= cycleData.cycleLength - 19 &&
      cycleDay <= cycleData.cycleLength - 11
    )
      return 'fertility';
    return 'normal';
  };

  const getPhaseColor = phase => {
    switch (phase) {
      case 'period':
        return 'bg-red-200 text-red-800';
      case 'ovulation':
        return 'bg-orange-200 text-orange-800';
      case 'fertility':
        return 'bg-pink-200 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

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
                {getDaysUntilNextPeriod() !== null
                  ? `${getDaysUntilNextPeriod()} ngày`
                  : 'Chưa thiết lập'}
              </p>
            </div>
          </div>

          <div className="cycle-card">
            <Heart className="cycle-icon orange" />
            <div className="cycle-card-info">
              <p>Rụng trứng</p>
              <p className="cycle-card-value">
                {getDaysUntilOvulation() !== null
                  ? `${getDaysUntilOvulation()} ngày`
                  : 'Chưa thiết lập'}
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
            <div
              className={`cycle-icon ${
                isInFertilityWindow() ? 'pink' : 'text-gray-300'
              }`}
            >
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
              <p className="cycle-card-value">
                {isInFertilityWindow() ? 'Đang diễn ra' : 'Không'}
              </p>
            </div>
          </div>
        </div>

        <div className="cycle-content-grid">
          {/* Calendar */}
          <div className="calendar-section">
            <div className="calendar-header">
              <h2 className="calendar-title">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <div className="calendar-nav">
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() - 1
                      )
                    )
                  }
                  className="nav-btn"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() + 1
                      )
                    )
                  }
                  className="nav-btn"
                >
                  →
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

            <div className="calendar-days">
              {monthDays.map(day => {
                const phase = getPeriodPhase(day);
                const isToday = isSameDay(day, today);
                const isOtherMonth = !isSameMonth(day, selectedDate);

                let dayClass = 'calendar-day';
                if (isToday) dayClass += ' today';
                if (isOtherMonth) dayClass += ' other-month';
                if (phase) dayClass += ` ${phase}`;

                return (
                  <div
                    key={day.toString()}
                    className={dayClass}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span>{format(day, 'd')}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-color period"></div>
                <span>Kỳ kinh</span>
              </div>
              <div className="legend-item">
                <div className="legend-color ovulation"></div>
                <span>Rụng trứng</span>
              </div>
              <div className="legend-item">
                <div className="legend-color fertility"></div>
                <span>Thời kỳ màu mỡ</span>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="side-panel">
            {/* Quick Actions */}
            <div className="panel-card">
              <h3 className="panel-title">Ghi nhận nhanh</h3>
              <div className="quick-actions">
                <button
                  onClick={() => {
                    setModalType('symptom');
                    setShowAddModal(true);
                  }}
                  className="quick-action-btn blue"
                >
                  <Plus className="quick-action-icon" />
                  <span>Thêm triệu chứng</span>
                </button>

                <button
                  onClick={() => {
                    setModalType('mood');
                    setShowAddModal(true);
                  }}
                  className="quick-action-btn green"
                >
                  <Plus className="quick-action-icon" />
                  <span>Ghi nhận tâm trạng</span>
                </button>

                <button
                  onClick={() => {
                    setModalType('note');
                    setShowAddModal(true);
                  }}
                  className="quick-action-btn purple"
                >
                  <Plus className="quick-action-icon" />
                  <span>Thêm ghi chú</span>
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="panel-card">
              <h3 className="panel-title">Thiết lập chu kỳ</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label className="form-label">Độ dài chu kỳ (ngày)</label>
                  <input
                    type="number"
                    value={cycleData.cycleLength}
                    onChange={e =>
                      updateCycleData({ cycleLength: parseInt(e.target.value) })
                    }
                    className="form-input"
                    min="21"
                    max="35"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số ngày kinh (ngày)</label>
                  <input
                    type="number"
                    value={cycleData.periodLength}
                    onChange={e =>
                      updateCycleData({
                        periodLength: parseInt(e.target.value),
                      })
                    }
                    className="form-input"
                    min="3"
                    max="7"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {modalType === 'symptom' && 'Thêm triệu chứng'}
              {modalType === 'mood' && 'Ghi nhận tâm trạng'}
              {modalType === 'note' && 'Thêm ghi chú'}
            </h3>

            {modalType === 'symptom' && (
              <div className="option-list">
                {symptomList.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => {
                      addSymptom(format(selectedDate, 'yyyy-MM-dd'), symptom);
                      setShowAddModal(false);
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
                {Object.entries(moodIcons).map(([key, mood]) => (
                  <button
                    key={key}
                    onClick={() => {
                      addMood(format(selectedDate, 'yyyy-MM-dd'), key);
                      setShowAddModal(false);
                    }}
                    className="mood-item"
                  >
                    <mood.icon className={`mood-icon ${mood.color}`} />
                    {mood.label}
                  </button>
                ))}
              </div>
            )}

            {modalType === 'note' && (
              <div>
                <textarea
                  placeholder="Nhập ghi chú của bạn..."
                  className="note-input"
                  rows="3"
                />
                <button
                  onClick={() => setShowAddModal(false)}
                  className="modal-btn confirm"
                >
                  Lưu ghi chú
                </button>
              </div>
            )}

            <div className="modal-actions">
              <button
                onClick={() => setShowAddModal(false)}
                className="modal-btn cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleTracking;
