import React, { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      'useAppointment must be used within an AppointmentProvider'
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      counselorId: 1,
      counselorName: 'Dr. Nguyễn Thị Hương',
      date: '2024-12-25',
      time: '09:00',
      type: 'video',
      reason: 'Tư vấn về chu kỳ kinh nguyệt không đều',
      status: 'scheduled',
      createdAt: new Date('2024-12-20'),
    },
    {
      id: 2,
      counselorId: 3,
      counselorName: 'Dr. Phạm Thị Mai',
      date: '2024-12-22',
      time: '14:30',
      type: 'chat',
      reason: 'Hỏi về các phương pháp tránh thai',
      status: 'completed',
      createdAt: new Date('2024-12-18'),
    },
    {
      id: 3,
      counselorId: 2,
      counselorName: 'Dr. Lê Văn Minh',
      date: '2024-12-28',
      time: '10:00',
      type: 'phone',
      reason: 'Tư vấn tâm lý về stress công việc',
      status: 'scheduled',
      createdAt: new Date('2024-12-21'),
    },
  ]);

  const [counselors, setCounselors] = useState([
    {
      id: 1,
      name: 'Dr. Nguyễn Thị Hương',
      specialty: 'Chuyên khoa Sản Phụ khoa',
      experience: '12+ năm kinh nghiệm',
      rating: 4.9,
      avatar: '/images/doctor1.jpg',
      available: true,
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      bio: 'Bác sĩ chuyên khoa I, có kinh nghiệm lâu năm trong lĩnh vực sản phụ khoa. Chuyên điều trị các bệnh lý phụ khoa, tư vấn kế hoạch hóa gia đình.',
      education: 'Đại học Y Hà Nội',
      languages: ['Tiếng Việt', 'English'],
      consultationCount: 1250,
    },
    {
      id: 2,
      name: 'Dr. Lê Văn Minh',
      specialty: 'Tư vấn tâm lý & Sức khỏe tình dục',
      experience: '8+ năm kinh nghiệm',
      rating: 4.8,
      avatar: '/images/doctor2.jpg',
      available: true,
      timeSlots: ['09:30', '10:30', '11:30', '14:30', '15:30', '16:30'],
      bio: 'Chuyên gia tư vấn tâm lý, tình dục học. Có nhiều kinh nghiệm trong việc tư vấn các vấn đề về sức khỏe tình dục và mối quan hệ.',
      education: 'Đại học Y dược TP.HCM',
      languages: ['Tiếng Việt', 'English'],
      consultationCount: 890,
    },
    {
      id: 3,
      name: 'Dr. Phạm Thị Mai',
      specialty: 'Dinh dưỡng & Kế hoạch hóa gia đình',
      experience: '10+ năm kinh nghiệm',
      rating: 4.7,
      avatar: '/images/doctor3.jpg',
      available: true,
      timeSlots: ['08:30', '09:00', '10:00', '13:30', '14:00', '15:00'],
      bio: 'Chuyên gia dinh dưỡng và kế hoạch hóa gia đình. Tư vấn về chế độ ăn uống, bổ sung vitamin và các phương pháp tránh thai hiện đại.',
      education: 'Đại học Y Huế',
      languages: ['Tiếng Việt'],
      consultationCount: 650,
    },
    {
      id: 4,
      name: 'Dr. Trần Minh Tuấn',
      specialty: 'Chuyên khoa Nam học',
      experience: '15+ năm kinh nghiệm',
      rating: 4.9,
      avatar: '/images/doctor4.jpg',
      available: true,
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      bio: 'Bác sĩ chuyên khoa II Nam học, có kinh nghiệm phong phú trong điều trị các bệnh lý nam khoa và tư vấn sức khỏe sinh sản nam giới.',
      education: 'Đại học Y Hà Nội',
      languages: ['Tiếng Việt', 'English', '한국어'],
      consultationCount: 1100,
    },
    {
      id: 5,
      name: 'Dr. Hoàng Thị Lan',
      specialty: 'Chăm sóc sức khỏe thiếu niên',
      experience: '7+ năm kinh nghiệm',
      rating: 4.6,
      avatar: '/images/doctor5.jpg',
      available: true,
      timeSlots: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      bio: 'Chuyên gia tư vấn sức khỏe sinh sản cho thanh thiếu niên. Kinh nghiệm trong việc giáo dục giới tính và tư vấn cho độ tuổi dậy thì.',
      education: 'Đại học Y dược Cần Thơ',
      languages: ['Tiếng Việt', 'English'],
      consultationCount: 420,
    },
    {
      id: 6,
      name: 'Dr. Vũ Đức Hòa',
      specialty: 'Điều trị vô sinh hiếm muộn',
      experience: '20+ năm kinh nghiệm',
      rating: 4.8,
      avatar: '/images/doctor6.jpg',
      available: false, // Đang bận
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      bio: 'Chuyên gia hàng đầu về vô sinh hiếm muộn. Có nhiều nghiên cứu và kinh nghiệm điều trị thành công nhiều trường hợp khó.',
      education: 'Đại học Y Hà Nội',
      languages: ['Tiếng Việt', 'English', '日本語'],
      consultationCount: 2100,
    },
  ]);

  const [consultations, setConsultations] = useState([]);

  const bookAppointment = appointmentData => {
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'scheduled',
      createdAt: new Date(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const cancelAppointment = appointmentId => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      )
    );
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, date: newDate, time: newTime, status: 'rescheduled' }
          : apt
      )
    );
  };

  const createConsultation = consultationData => {
    const newConsultation = {
      id: Date.now(),
      ...consultationData,
      status: 'active',
      createdAt: new Date(),
      messages: [],
    };
    setConsultations(prev => [...prev, newConsultation]);
    return newConsultation;
  };

  const addMessage = (consultationId, message) => {
    setConsultations(prev =>
      prev.map(consultation =>
        consultation.id === consultationId
          ? {
              ...consultation,
              messages: [
                ...consultation.messages,
                {
                  id: Date.now(),
                  ...message,
                  timestamp: new Date(),
                },
              ],
            }
          : consultation
      )
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(apt => new Date(apt.date) >= today && apt.status === 'scheduled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getAvailableCounselors = () => {
    return counselors.filter(counselor => counselor.available);
  };

  const getCounselorById = id => {
    return counselors.find(counselor => counselor.id === id);
  };

  const value = {
    appointments,
    counselors,
    consultations,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    createConsultation,
    addMessage,
    getUpcomingAppointments,
    getAvailableCounselors,
    getCounselorById,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
