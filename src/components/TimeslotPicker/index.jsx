import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Star, Users, MapPin } from 'lucide-react';
import './TimeslotPicker.css';

const TimeslotPicker = ({ 
  timeSlots = [], 
  selectedDate, 
  selectedTimeSlot, 
  onDateSelect, 
  onTimeSlotSelect,
  loading = false,
  className = ""
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [animatingSlots, setAnimatingSlots] = useState(false);

  // Get unique dates from timeSlots
  const availableDates = Array.from(new Set(timeSlots.map(ts => ts.slotDate))).sort();
  
  // Get current month's dates
  const getMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates = [];
    const current = new Date(startDate);

    // Chỉ tạo đúng 35 ngày (5 tuần x 7 ngày)
    for (let i = 0; i < 35; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const monthDates = getMonthDates();
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (availableDates.includes(dateStr)) {
      setAnimatingSlots(true);
      onDateSelect(dateStr);
      setTimeout(() => setAnimatingSlots(false), 300);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isDateAvailable = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableDates.includes(dateStr);
  };

  const isDateSelected = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return selectedDate === dateStr;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const getTimeSlotsForDate = () => {
    if (!selectedDate) return [];
    return timeSlots.filter(ts => ts.slotDate === selectedDate);
  };

  const formatTime = (time) => {
    return time?.substring(0, 5) || time;
  };

  return (
    <div className={`timeslot-picker ${className}`}>
      {/* Calendar Section */}
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-title">
            <Calendar className="calendar-icon" />
            <h3>Chọn ngày xét nghiệm</h3>
          </div>
          <div className="month-navigation">
            <button 
              className="nav-button"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="month-year">
              {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              className="nav-button"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {/* Week days header */}
          <div className="weekdays">
            {weekDays.map(day => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar dates */}
          <div className="dates-grid">
            {monthDates.map((date, index) => {
              const available = isDateAvailable(date);
              const selected = isDateSelected(date);
              const today = isToday(date);
              const currentMonthDate = isCurrentMonth(date);

              return (
                <div
                  key={index}
                  className={`date-cell ${available ? 'available' : ''} ${selected ? 'selected' : ''} ${today ? 'today' : ''} ${!currentMonthDate ? 'other-month' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <span className="date-number">{date.getDate()}</span>
                  {available && (
                    <div className="availability-indicator">
                      <div className="dot"></div>
                    </div>
                  )}
                  {today && <div className="today-indicator">Hôm nay</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      {selectedDate && (
        <div className="timeslots-container">
          <div className="timeslots-header">
            <div className="timeslots-title">
              <Clock className="clock-icon" />
              <h3>Chọn khung giờ</h3>
            </div>
            <div className="selected-date-info">
              {new Date(selectedDate).toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải khung giờ...</p>
            </div>
          ) : (
            <div className={`timeslots-grid ${animatingSlots ? 'animating' : ''}`}>
              {getTimeSlotsForDate().length === 0 ? (
                <div className="no-slots">
                  <Clock className="no-slots-icon" />
                  <h4>Không có khung giờ trống</h4>
                  <p>Vui lòng chọn ngày khác</p>
                </div>
              ) : (
                getTimeSlotsForDate().map((slot, index) => {
                  const isSelected = selectedTimeSlot?.timeSlotId === slot.timeSlotId;
                  const isPopular = slot.availableSlots <= 2;
                  
                  return (
                    <div
                      key={slot.timeSlotId}
                      className={`timeslot-card ${isSelected ? 'selected' : ''} ${isPopular ? 'popular' : ''}`}
                      onClick={() => onTimeSlotSelect(slot)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isPopular && (
                        <div className="popular-badge">
                          <Star size={12} />
                          <span>Sắp hết</span>
                        </div>
                      )}
                      
                      <div className="time-display">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                      
                      <div className="slot-info">
                        <div className="availability">
                          <Users size={14} />
                          <span>Còn {slot.availableSlots} chỗ</span>
                        </div>
                        
                        {slot.location && (
                          <div className="location">
                            <MapPin size={14} />
                            <span>{slot.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="selected-indicator">
                          <div className="checkmark">✓</div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeslotPicker;
