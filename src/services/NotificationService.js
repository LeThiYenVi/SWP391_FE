import { differenceInDays, addDays, format } from 'date-fns';

class NotificationService {
  constructor() {
    this.notifications = [];
    this.subscribers = [];
  }

  // Đăng ký lắng nghe thông báo
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Gửi thông báo tới các subscribers
  notify() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // Yêu cầu quyền thông báo từ browser
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Hiển thị browser notification
  showBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Tự động đóng sau 5 giây
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    }
  }

  // Tạo thông báo trong app
  createInAppNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    
    // Giới hạn số lượng thông báo
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notify();
    return newNotification;
  }

  // Đánh dấu đã đọc
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  // Đánh dấu tất cả đã đọc
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notify();
  }

  // Xóa thông báo
  removeNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notify();
  }

  // Tạo thông báo chu kỳ sinh sản
  generateCycleNotifications(cycleData) {
    if (!cycleData.lastPeriod) return [];

    const notifications = [];
    const today = new Date();
    const lastPeriodDate = new Date(cycleData.lastPeriod);

    // Tính toán các mốc quan trọng
    const nextPeriodDate = addDays(lastPeriodDate, cycleData.cycleLength);
    const ovulationDate = addDays(lastPeriodDate, cycleData.cycleLength - 14);
    const fertilityStartDate = addDays(ovulationDate, -5);
    const fertilityEndDate = addDays(ovulationDate, 1);

    const daysToNextPeriod = differenceInDays(nextPeriodDate, today);
    const daysToOvulation = differenceInDays(ovulationDate, today);

    // Thông báo rụng trứng
    if (daysToOvulation === 1) {
      notifications.push({
        type: 'ovulation',
        title: 'Rụng trứng dự kiến',
        message: 'Ngày mai là ngày dự đoán rụng trứng. Hãy theo dõi các dấu hiệu của cơ thể!',
        priority: 'high',
        actionText: 'Xem chi tiết',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    if (daysToOvulation === 0) {
      notifications.push({
        type: 'ovulation',
        title: 'Ngày rụng trứng',
        message: 'Hôm nay là ngày dự đoán rụng trứng. Đây là thời điểm có khả năng thụ thai cao nhất!',
        priority: 'high',
        actionText: 'Ghi nhận triệu chứng',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    // Thông báo kỳ kinh sắp tới
    if (daysToNextPeriod === 2) {
      notifications.push({
        type: 'period',
        title: 'Kỳ kinh sắp tới',
        message: 'Kỳ kinh dự kiến bắt đầu trong 2 ngày nữa. Hãy chuẩn bị sẵn sàng!',
        priority: 'medium',
        actionText: 'Chuẩn bị',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    if (daysToNextPeriod === 1) {
      notifications.push({
        type: 'period',
        title: 'Kỳ kinh bắt đầu ngày mai',
        message: 'Ngày mai kỳ kinh dự kiến sẽ bắt đầu. Đừng quên mang theo băng vệ sinh!',
        priority: 'high',
        actionText: 'Chuẩn bị',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    if (daysToNextPeriod === 0) {
      notifications.push({
        type: 'period',
        title: 'Kỳ kinh bắt đầu hôm nay',
        message: 'Hôm nay là ngày dự đoán kỳ kinh bắt đầu. Hãy ghi nhận nếu đã bắt đầu!',
        priority: 'high',
        actionText: 'Ghi nhận',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    // Thông báo thời kỳ màu mỡ
    const fertilityDaysLeft = differenceInDays(fertilityEndDate, today);
    if (fertilityDaysLeft >= 0 && differenceInDays(today, fertilityStartDate) >= 0) {
      notifications.push({
        type: 'fertility',
        title: 'Thời kỳ màu mỡ',
        message: `Bạn đang trong thời kỳ màu mỡ. Còn ${fertilityDaysLeft + 1} ngày.`,
        priority: 'medium',
        actionText: 'Theo dõi',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    // Thông báo chăm sóc sức khỏe
    if (daysToNextPeriod <= 7 && daysToNextPeriod > 2) {
      notifications.push({
        type: 'health',
        title: 'Chăm sóc sức khỏe',
        message: 'Hãy duy trì chế độ ăn uống lành mạnh và tập thể dục nhẹ nhàng để chuẩn bị cho kỳ kinh.',
        priority: 'low',
        actionText: 'Xem lời khuyên',
        actionUrl: '/dashboard/cycle-tracking'
      });
    }

    return notifications;
  }

  // Lên lịch thông báo browser
  scheduleBrowserNotifications(cycleData) {
    if (!cycleData.lastPeriod) return;

    const notifications = this.generateCycleNotifications(cycleData);
    
    notifications.forEach(notification => {
      // Tạo thông báo trong app
      this.createInAppNotification(notification);

      // Hiển thị browser notification cho priority cao
      if (notification.priority === 'high') {
        this.showBrowserNotification(notification.title, {
          body: notification.message,
          tag: notification.type,
          requireInteraction: true
        });
      }
    });
  }

  // Nhắc nhở hàng ngày
  setDailyReminders(cycleData) {
    const notifications = this.generateCycleNotifications(cycleData);
    
    notifications.forEach(notification => {
      this.createInAppNotification(notification);
    });
  }

  // Thông báo khi có triệu chứng bất thường
  checkAbnormalSymptoms(symptoms, cycleData) {
    const concerningSymptoms = [
      'Chảy máu bất thường',
      'Đau bụng dữ dội', 
      'Sốt cao',
      'Khí hư có mùi lạ'
    ];

    const foundConcerningSymptoms = symptoms.filter(symptom => 
      concerningSymptoms.some(concerning => 
        symptom.toLowerCase().includes(concerning.toLowerCase())
      )
    );

    if (foundConcerningSymptoms.length > 0) {
      this.createInAppNotification({
        type: 'health_alert',
        title: 'Triệu chứng cần chú ý',
        message: 'Bạn đã ghi nhận một số triệu chứng có thể cần được tư vấn y tế. Hãy liên hệ với chuyên gia.',
        priority: 'high',
        actionText: 'Tư vấn ngay',
        actionUrl: '/consultation'
      });

      this.showBrowserNotification('Triệu chứng cần chú ý', {
        body: 'Bạn có triệu chứng cần được tư vấn y tế. Nhấn để xem chi tiết.',
        tag: 'health_alert',
        requireInteraction: true
      });
    }
  }

  // Thông báo khi chu kỳ bất thường
  checkIrregularCycle(cycleHistory) {
    if (cycleHistory.length < 3) return;

    const recentCycles = cycleHistory.slice(-3);
    const cycleLengths = recentCycles.map(cycle => cycle.cycleLength);
    const avgLength = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
    
    const hasIrregularity = cycleLengths.some(length => 
      Math.abs(length - avgLength) > 5
    );

    if (hasIrregularity) {
      this.createInAppNotification({
        type: 'cycle_alert',
        title: 'Chu kỳ bất thường',
        message: 'Chu kỳ gần đây của bạn có sự thay đổi đáng kể. Hãy tham khảo ý kiến chuyên gia.',
        priority: 'medium',
        actionText: 'Tư vấn',
        actionUrl: '/consultation'
      });
    }
  }

  // Lấy thống kê thông báo
  getNotificationStats() {
    const total = this.notifications.length;
    const unread = this.notifications.filter(n => !n.read).length;
    const byType = this.notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {});

    return { total, unread, byType };
  }

  // Xóa thông báo cũ
  cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.notifications = this.notifications.filter(
      notification => notification.timestamp > cutoffDate
    );

    this.notify();
  }
}

// Singleton instance
const notificationService = new NotificationService();

export default notificationService; 