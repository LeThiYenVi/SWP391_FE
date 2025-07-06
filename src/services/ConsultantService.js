// Consultant Service - Mock data and API calls for consultant functionality
import { toast } from 'react-toastify';

// Mock consultant data
const mockConsultantData = {
  id: 1,
  name: 'Dr. Nguyễn Thị Hương',
  specialty: 'Chuyên khoa Sản Phụ khoa',
  avatar: 'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
  email: 'dr.huong@gynexa.com',
  phone: '0123456789',
  rating: 4.9,
  totalConsultations: 245,
  completedToday: 8,
  onlineStatus: true,
  bio: 'Bác sĩ với hơn 10 năm kinh nghiệm trong lĩnh vực sản phụ khoa. Chuyên về tư vấn sức khỏe sinh sản và hỗ trợ phụ nữ.',
  experience: '10 năm',
  education: 'Đại học Y khoa Tp.HCM',
  languages: ['Tiếng Việt', 'Tiếng Anh'],
  workingHours: {
    'Thứ 2': ['8:00-12:00', '14:00-18:00'],
    'Thứ 3': ['8:00-12:00', '14:00-18:00'],
    'Thứ 4': ['8:00-12:00', '14:00-18:00'],
    'Thứ 5': ['8:00-12:00', '14:00-18:00'],
    'Thứ 6': ['8:00-12:00', '14:00-18:00'],
    'Thứ 7': ['8:00-12:00'],
    'Chủ nhật': ['Nghỉ']
  },
  fees: {
    consultation: 200000,
    followUp: 150000,
    emergency: 300000
  },
  certifications: [
    'Chứng chỉ hành nghề y khoa',
    'Chứng chỉ chuyên khoa Sản Phụ khoa',
    'Chứng chỉ tư vấn sức khỏe sinh sản'
  ]
};

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    patientName: 'Nguyễn Thị Lan',
    patientId: 'P001',
    date: '2024-01-15',
    time: '09:00',
    type: 'video',
    status: 'scheduled',
    reason: 'Tư vấn sức khỏe sinh sản',
    notes: '',
    duration: 30,
    createdAt: '2024-01-10T10:00:00Z',
    patientPhone: '0987654321',
    patientEmail: 'lan.nguyen@email.com'
  },
  {
    id: 2,
    patientName: 'Trần Thị Mai',
    patientId: 'P002',
    date: '2024-01-15',
    time: '10:30',
    type: 'chat',
    status: 'in-progress',
    reason: 'Theo dõi chu kỳ kinh nguyệt',
    notes: 'Bệnh nhân có triệu chứng không đều',
    duration: 45,
    createdAt: '2024-01-12T14:00:00Z',
    patientPhone: '0123456789',
    patientEmail: 'mai.tran@email.com'
  },
  {
    id: 3,
    patientName: 'Lê Thị Hoa',
    patientId: 'P003',
    date: '2024-01-15',
    time: '14:00',
    type: 'phone',
    status: 'completed',
    reason: 'Tư vấn kế hoạch hóa gia đình',
    notes: 'Đã tư vấn xong, hẹn kiểm tra lại sau 1 tháng',
    duration: 30,
    createdAt: '2024-01-13T16:00:00Z',
    patientPhone: '0909123456',
    patientEmail: 'hoa.le@email.com'
  }
];

// Mock messages/conversations data
const mockConversations = [
  {
    id: 1,
    patientId: 'P001',
    patientName: 'Nguyễn Thị Lan',
    patientAvatar: 'https://via.placeholder.com/40',
    lastMessage: 'Cảm ơn bác sĩ đã tư vấn ạ',
    timestamp: '2024-01-15T15:30:00Z',
    unreadCount: 2,
    status: 'active',
    messages: [
      {
        id: 1,
        senderId: 'P001',
        senderName: 'Nguyễn Thị Lan',
        message: 'Chào bác sĩ ạ',
        timestamp: '2024-01-15T15:00:00Z',
        type: 'text'
      },
      {
        id: 2,
        senderId: 'consultant',
        senderName: 'Dr. Nguyễn Thị Hương',
        message: 'Chào bạn! Tôi có thể giúp gì cho bạn?',
        timestamp: '2024-01-15T15:01:00Z',
        type: 'text'
      },
      {
        id: 3,
        senderId: 'P001',
        senderName: 'Nguyễn Thị Lan',
        message: 'Em muốn hỏi về chu kỳ kinh nguyệt ạ',
        timestamp: '2024-01-15T15:02:00Z',
        type: 'text'
      },
      {
        id: 4,
        senderId: 'consultant',
        senderName: 'Dr. Nguyễn Thị Hương',
        message: 'Được, bạn hãy mô tả tình trạng cụ thể nhé',
        timestamp: '2024-01-15T15:03:00Z',
        type: 'text'
      },
      {
        id: 5,
        senderId: 'P001',
        senderName: 'Nguyễn Thị Lan',
        message: 'Cảm ơn bác sĩ đã tư vấn ạ',
        timestamp: '2024-01-15T15:30:00Z',
        type: 'text'
      }
    ]
  },
  {
    id: 2,
    patientId: 'P002',
    patientName: 'Trần Thị Mai',
    patientAvatar: 'https://via.placeholder.com/40',
    lastMessage: 'Bác sĩ ơi, em có thể đặt lịch hẹn không?',
    timestamp: '2024-01-15T14:20:00Z',
    unreadCount: 1,
    status: 'active',
    messages: [
      {
        id: 1,
        senderId: 'P002',
        senderName: 'Trần Thị Mai',
        message: 'Bác sĩ ơi, em có thể đặt lịch hẹn không?',
        timestamp: '2024-01-15T14:20:00Z',
        type: 'text'
      }
    ]
  }
];

// Mock analytics data
const mockAnalytics = {
  totalPatients: 245,
  appointmentsToday: 8,
  completedToday: 5,
  revenue: 2500000,
  monthlyStats: {
    appointments: [12, 18, 15, 22, 19, 24, 20, 25, 18, 21, 16, 23],
    revenue: [1200000, 1800000, 1500000, 2200000, 1900000, 2400000, 2000000, 2500000, 1800000, 2100000, 1600000, 2300000]
  },
  patientSatisfaction: 4.9,
  responseTime: 5 // minutes
};

// Consultant Service Class
class ConsultantService {
  // Profile management
  async getConsultantProfile() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockConsultantData });
      }, 500);
    });
  }

  async updateConsultantProfile(profileData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(mockConsultantData, profileData);
        resolve({ success: true, data: mockConsultantData });
      }, 1000);
    });
  }

  async changePassword(oldPassword, newPassword) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock password validation
        if (oldPassword === 'current123') {
          resolve({ success: true, message: 'Mật khẩu đã được thay đổi' });
        } else {
          resolve({ success: false, message: 'Mật khẩu cũ không chính xác' });
        }
      }, 1000);
    });
  }

  // Appointment management
  async getAppointments(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredAppointments = [...mockAppointments];
        
        if (filters.date) {
          filteredAppointments = filteredAppointments.filter(apt => apt.date === filters.date);
        }
        
        if (filters.status && filters.status !== 'all') {
          filteredAppointments = filteredAppointments.filter(apt => apt.status === filters.status);
        }
        
        if (filters.type && filters.type !== 'all') {
          filteredAppointments = filteredAppointments.filter(apt => apt.type === filters.type);
        }
        
        resolve({ success: true, data: filteredAppointments });
      }, 500);
    });
  }

  async updateAppointmentStatus(appointmentId, status, notes = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = mockAppointments.find(apt => apt.id === appointmentId);
        if (appointment) {
          appointment.status = status;
          if (notes) appointment.notes = notes;
          resolve({ success: true, data: appointment });
        } else {
          resolve({ success: false, message: 'Không tìm thấy cuộc hẹn' });
        }
      }, 500);
    });
  }

  async rescheduleAppointment(appointmentId, newDate, newTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = mockAppointments.find(apt => apt.id === appointmentId);
        if (appointment) {
          appointment.date = newDate;
          appointment.time = newTime;
          resolve({ success: true, data: appointment });
        } else {
          resolve({ success: false, message: 'Không tìm thấy cuộc hẹn' });
        }
      }, 500);
    });
  }

  // Message management
  async getConversations() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockConversations });
      }, 500);
    });
  }

  async getConversationMessages(conversationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversation = mockConversations.find(conv => conv.id === conversationId);
        if (conversation) {
          resolve({ success: true, data: conversation.messages });
        } else {
          resolve({ success: false, message: 'Không tìm thấy cuộc trò chuyện' });
        }
      }, 500);
    });
  }

  async sendMessage(conversationId, message) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversation = mockConversations.find(conv => conv.id === conversationId);
        if (conversation) {
          const newMessage = {
            id: conversation.messages.length + 1,
            senderId: 'consultant',
            senderName: mockConsultantData.name,
            message: message,
            timestamp: new Date().toISOString(),
            type: 'text'
          };
          
          conversation.messages.push(newMessage);
          conversation.lastMessage = message;
          conversation.timestamp = new Date().toISOString();
          
          resolve({ success: true, data: newMessage });
        } else {
          resolve({ success: false, message: 'Không tìm thấy cuộc trò chuyện' });
        }
      }, 500);
    });
  }

  // Analytics
  async getAnalytics(period = 'month') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockAnalytics });
      }, 500);
    });
  }

  async getDashboardStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalPatients: mockAnalytics.totalPatients,
          appointmentsToday: mockAnalytics.appointmentsToday,
          completedToday: mockAnalytics.completedToday,
          pendingAppointments: mockAppointments.filter(apt => apt.status === 'scheduled').length,
          totalRevenue: mockAnalytics.revenue,
          averageRating: mockAnalytics.patientSatisfaction,
          responseTime: mockAnalytics.responseTime,
          upcomingAppointments: mockAppointments.filter(apt => apt.status === 'scheduled').slice(0, 5),
          recentMessages: mockConversations.slice(0, 5)
        };
        resolve({ success: true, data: stats });
      }, 500);
    });
  }

  // Utility methods
  async updateOnlineStatus(isOnline) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockConsultantData.onlineStatus = isOnline;
        resolve({ success: true, data: { onlineStatus: isOnline } });
      }, 300);
    });
  }

  async getWorkingHours() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockConsultantData.workingHours });
      }, 300);
    });
  }

  async updateWorkingHours(workingHours) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockConsultantData.workingHours = workingHours;
        resolve({ success: true, data: workingHours });
      }, 500);
    });
  }

  // Patient management
  async getPatientInfo(patientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = mockAppointments.find(apt => apt.patientId === patientId);
        if (appointment) {
          const patientInfo = {
            id: appointment.patientId,
            name: appointment.patientName,
            phone: appointment.patientPhone,
            email: appointment.patientEmail,
            totalAppointments: mockAppointments.filter(apt => apt.patientId === patientId).length,
            lastAppointment: appointment.date,
            notes: appointment.notes
          };
          resolve({ success: true, data: patientInfo });
        } else {
          resolve({ success: false, message: 'Không tìm thấy thông tin bệnh nhân' });
        }
      }, 500);
    });
  }
}

// Export singleton instance
const consultantService = new ConsultantService();
export default consultantService;

// Export mock data for testing
export { mockConsultantData, mockAppointments, mockConversations, mockAnalytics };
