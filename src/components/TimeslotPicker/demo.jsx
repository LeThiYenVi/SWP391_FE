import React, { useState } from 'react';
import TimeslotPicker from './index';

const TimeslotPickerDemo = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  const mockTimeSlots = [
    {
      timeSlotId: 1,
      slotDate: '2024-08-05',
      startTime: '08:00:00',
      endTime: '09:00:00',
      availableSlots: 5,
      location: 'Phòng A1'
    },
    {
      timeSlotId: 2,
      slotDate: '2024-08-05',
      startTime: '09:00:00',
      endTime: '10:00:00',
      availableSlots: 3,
      location: 'Phòng A2'
    },
    {
      timeSlotId: 3,
      slotDate: '2024-08-05',
      startTime: '10:00:00',
      endTime: '11:00:00',
      availableSlots: 1,
      location: 'Phòng A1'
    },
    {
      timeSlotId: 4,
      slotDate: '2024-08-06',
      startTime: '08:00:00',
      endTime: '09:00:00',
      availableSlots: 4,
      location: 'Phòng B1'
    },
    {
      timeSlotId: 5,
      slotDate: '2024-08-06',
      startTime: '14:00:00',
      endTime: '15:00:00',
      availableSlots: 2,
      location: 'Phòng B2'
    },
    {
      timeSlotId: 6,
      slotDate: '2024-08-07',
      startTime: '09:00:00',
      endTime: '10:00:00',
      availableSlots: 6,
      location: 'Phòng C1'
    },
    {
      timeSlotId: 7,
      slotDate: '2024-08-08',
      startTime: '08:00:00',
      endTime: '09:00:00',
      availableSlots: 3,
      location: 'Phòng A1'
    },
    {
      timeSlotId: 8,
      slotDate: '2024-08-08',
      startTime: '15:00:00',
      endTime: '16:00:00',
      availableSlots: 1,
      location: 'Phòng A2'
    },
    {
      timeSlotId: 9,
      slotDate: '2024-08-09',
      startTime: '10:00:00',
      endTime: '11:00:00',
      availableSlots: 4,
      location: 'Phòng B1'
    },
    {
      timeSlotId: 10,
      slotDate: '2024-08-10',
      startTime: '08:00:00',
      endTime: '09:00:00',
      availableSlots: 2,
      location: 'Phòng C1'
    }
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
    console.log('Selected date:', date);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    console.log('Selected time slot:', timeSlot);
  };

  const handleLoadingToggle = () => {
    setLoading(!loading);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot) {
      alert(`Đặt lịch thành công!\nNgày: ${selectedDate}\nGiờ: ${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}\nPhòng: ${selectedTimeSlot.location}`);
    } else {
      alert('Vui lòng chọn ngày và giờ!');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            🎨 Enhanced Timeslot Picker Demo
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b',
            marginBottom: '24px'
          }}>
            Giao diện chọn lịch hẹn mới với thiết kế hiện đại và trải nghiệm người dùng tốt hơn
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleLoadingToggle}
              style={{
                background: loading ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? '🛑 Stop Loading' : '⏳ Test Loading'}
            </button>
            
            <button
              onClick={handleBooking}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📅 Đặt lịch
            </button>
          </div>
        </div>

        <TimeslotPicker
          timeSlots={mockTimeSlots}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onDateSelect={handleDateSelect}
          onTimeSlotSelect={handleTimeSlotSelect}
          loading={loading}
        />

        {/* Selection Summary */}
        {(selectedDate || selectedTimeSlot) && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            marginTop: '32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{ 
              margin: '0 0 16px', 
              color: '#2d3748',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              📋 Thông tin đã chọn
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {selectedDate && (
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f7fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong>📅 Ngày:</strong> {new Date(selectedDate).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
              
              {selectedTimeSlot && (
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f7fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong>⏰ Giờ:</strong> {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                  <br />
                  <strong>📍 Phòng:</strong> {selectedTimeSlot.location}
                  <br />
                  <strong>👥 Còn lại:</strong> {selectedTimeSlot.availableSlots} chỗ
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeslotPickerDemo;
