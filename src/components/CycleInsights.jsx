import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Heart,
  Calendar,
} from 'lucide-react';
import { differenceInDays, format, addDays } from 'date-fns';

const CycleInsights = ({ cycleData, predictions }) => {
  const generateInsights = () => {
    const insights = [];

    if (!cycleData.lastPeriod) {
      insights.push({
        type: 'info',
        icon: Calendar,
        title: 'Bắt đầu theo dõi',
        message:
          'Hãy ghi nhận ngày bắt đầu kỳ kinh để nhận được dự đoán chính xác.',
        color: '#3a99b7',
      });
      return insights;
    }

    const today = new Date();
    const lastPeriod = new Date(cycleData.lastPeriod);
    const daysSinceLastPeriod = differenceInDays(today, lastPeriod);
    const cycleDay =
      ((daysSinceLastPeriod % cycleData.cycleLength) + cycleData.cycleLength) %
      cycleData.cycleLength;

    // Insight về giai đoạn hiện tại
    if (predictions.currentPhase === 'menstrual') {
      insights.push({
        type: 'current',
        icon: CheckCircle,
        title: 'Đang trong kỳ kinh',
        message: 'Hãy chú ý nghỉ ngơi đầy đủ và bổ sung sắt trong chế độ ăn.',
        color: '#e91e63',
      });
    } else if (predictions.currentPhase === 'fertile') {
      insights.push({
        type: 'fertility',
        icon: Heart,
        title: 'Thời kỳ màu mỡ',
        message: 'Đây là thời điểm có khả năng thụ thai cao nhất trong chu kỳ.',
        color: '#ff9800',
      });
    } else if (predictions.currentPhase === 'ovulation') {
      insights.push({
        type: 'ovulation',
        icon: Heart,
        title: 'Ngày rụng trứng',
        message:
          'Hôm nay là ngày dự đoán rụng trứng. Theo dõi dấu hiệu cơ thể!',
        color: '#ff5722',
      });
    }

    // Insight về chu kỳ sắp tới
    if (predictions.nextPeriod) {
      const daysToNextPeriod = differenceInDays(predictions.nextPeriod, today);

      if (daysToNextPeriod <= 3 && daysToNextPeriod >= 0) {
        insights.push({
          type: 'upcoming',
          icon: Calendar,
          title: 'Kỳ kinh sắp tới',
          message: `Kỳ kinh dự kiến bắt đầu trong ${daysToNextPeriod} ngày. Hãy chuẩn bị sẵn sàng!`,
          color: '#9c27b0',
        });
      }
    }

    // Phân tích chu kỳ
    if (cycleData.cycleHistory && cycleData.cycleHistory.length >= 3) {
      const recentCycles = cycleData.cycleHistory.slice(-3);
      const cycleLengths = recentCycles.map(cycle => cycle.cycleLength);
      const avgLength =
        cycleLengths.reduce((sum, length) => sum + length, 0) /
        cycleLengths.length;
      const variance =
        cycleLengths.reduce(
          (sum, length) => sum + Math.pow(length - avgLength, 2),
          0
        ) / cycleLengths.length;

      if (variance > 9) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Chu kỳ không đều',
          message:
            'Chu kỳ gần đây có sự thay đổi lớn. Hãy tham khảo ý kiến chuyên gia.',
          color: '#f44336',
        });
      } else if (variance < 4) {
        insights.push({
          type: 'positive',
          icon: CheckCircle,
          title: 'Chu kỳ đều đặn',
          message:
            'Chu kỳ của bạn rất đều đặn! Tiếp tục duy trì lối sống lành mạnh.',
          color: '#4caf50',
        });
      }
    }

    // Phân tích triệu chứng
    if (cycleData.symptoms) {
      const recentSymptoms = Object.values(cycleData.symptoms)
        .flat()
        .filter(symptom => {
          const symptomDate = new Date(symptom.time);
          return differenceInDays(today, symptomDate) <= 30;
        });

      const symptomCounts = {};
      recentSymptoms.forEach(symptom => {
        symptomCounts[symptom.symptom] =
          (symptomCounts[symptom.symptom] || 0) + 1;
      });

      const mostCommonSymptom = Object.entries(symptomCounts).sort(
        ([, a], [, b]) => b - a
      )[0];

      if (mostCommonSymptom && mostCommonSymptom[1] >= 3) {
        insights.push({
          type: 'pattern',
          icon: TrendingUp,
          title: 'Triệu chứng thường gặp',
          message: `Bạn thường gặp "${mostCommonSymptom[0]}" trong tháng qua. Hãy ghi chú để theo dõi xu hướng.`,
          color: '#607d8b',
        });
      }

      // Cảnh báo triệu chứng nghiêm trọng
      const seriousSymptoms = recentSymptoms.filter(symptom =>
        ['Chảy máu bất thường', 'Đau bụng dữ dội', 'Sốt cao'].includes(
          symptom.symptom
        )
      );

      if (seriousSymptoms.length > 0) {
        insights.push({
          type: 'urgent',
          icon: AlertTriangle,
          title: 'Cần chú ý',
          message:
            'Bạn có triệu chứng cần được tư vấn y tế. Hãy liên hệ với chuyên gia.',
          color: '#f44336',
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="cycle-insights">
      <h3 className="insights-title">
        <TrendingUp size={20} />
        Nhận định thông minh
      </h3>

      <div className="insights-list">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-item ${insight.type}`}>
            <div className="insight-icon" style={{ color: insight.color }}>
              <insight.icon size={24} />
            </div>
            <div className="insight-content">
              <h4 className="insight-title">{insight.title}</h4>
              <p className="insight-message">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleInsights;
