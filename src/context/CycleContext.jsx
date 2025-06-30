import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  addDays,
  differenceInDays,
  format,
  subDays,
  isToday,
  isTomorrow,
} from 'date-fns';
import { safeFormatDate, safeCreateDate } from '../utils/dateUtils';

const CycleContext = createContext();

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};

export const CycleProvider = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const [cycleData, setCycleData] = useState({
    lastPeriod: null,
    cycleLength: 28,
    periodLength: 5,
    symptoms: {},
    mood: {},
    notes: {},
    cycleHistory: [], // Lịch sử các chu kỳ trước
    personalizedTips: [], // Lời khuyên cá nhân hóa
    reminders: [], // Nhắc nhở đã tạo
  });

  const [predictions, setPredictions] = useState({
    nextPeriod: null,
    ovulation: null,
    fertilityWindow: null,
    safeDays: null,
    currentPhase: 'unknown',
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.cycleData) {
      const mergedData = {
        lastPeriod: null,
        cycleLength: 28,
        periodLength: 5,
        symptoms: {},
        mood: {},
        notes: {},
        cycleHistory: [],
        personalizedTips: [],
        reminders: [],
        ...user.cycleData,
      };
      setCycleData(mergedData);
      calculatePredictions(mergedData);
      generatePersonalizedTips(mergedData);
      scheduleNotifications(mergedData);
    }
  }, [user]);

  const calculatePredictions = data => {
    if (!data.lastPeriod) return;

    const lastPeriodDate = new Date(data.lastPeriod);
    const today = new Date();

    // Tính toán các mốc trong chu kỳ
    const nextPeriod = addDays(lastPeriodDate, data.cycleLength);
    const ovulation = addDays(lastPeriodDate, data.cycleLength - 14);
    const fertilityStart = addDays(ovulation, -5);
    const fertilityEnd = addDays(ovulation, 1);

    // Tính ngày an toàn (sau rụng trứng và trước kỳ kinh tiếp theo)
    const safeStart = addDays(ovulation, 2);
    const safeEnd = subDays(nextPeriod, 3);

    // Xác định giai đoạn hiện tại
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodDate);
    let currentPhase = 'unknown';

    if (daysSinceLastPeriod < data.periodLength) {
      currentPhase = 'menstrual';
    } else if (
      daysSinceLastPeriod >= data.cycleLength - 16 &&
      daysSinceLastPeriod <= data.cycleLength - 12
    ) {
      currentPhase = 'ovulation';
    } else if (
      daysSinceLastPeriod >= data.cycleLength - 19 &&
      daysSinceLastPeriod <= data.cycleLength - 11
    ) {
      currentPhase = 'fertile';
    } else if (
      daysSinceLastPeriod >= data.cycleLength - 11 &&
      daysSinceLastPeriod <= data.cycleLength - 3
    ) {
      currentPhase = 'luteal';
    } else if (daysSinceLastPeriod >= data.cycleLength - 3) {
      currentPhase = 'premenstrual';
    } else {
      currentPhase = 'follicular';
    }

    setPredictions({
      nextPeriod,
      ovulation,
      fertilityWindow: { start: fertilityStart, end: fertilityEnd },
      safeDays: { start: safeStart, end: safeEnd },
      currentPhase,
    });
  };

  const generatePersonalizedTips = data => {
    const tips = [];
    const today = new Date();

    if (!data.lastPeriod) return;

    const daysSinceLastPeriod = differenceInDays(
      today,
      new Date(data.lastPeriod)
    );
    const cycleDay =
      ((daysSinceLastPeriod % data.cycleLength) + data.cycleLength) %
      data.cycleLength;

    // Lời khuyên theo giai đoạn chu kỳ
    if (cycleDay < data.periodLength) {
      tips.push({
        type: 'nutrition',
        title: 'Dinh dưỡng trong kỳ kinh',
        content:
          'Bổ sung sắt qua thực phẩm như thịt đỏ, rau lá xanh. Uống nhiều nước để giảm chuột rút.',
        icon: 'nutrition',
      });
      tips.push({
        type: 'exercise',
        title: 'Vận động nhẹ nhàng',
        content:
          'Yoga, đi bộ nhẹ hoặc stretching có thể giúp giảm đau bụng kinh.',
        icon: 'exercise',
      });
    } else if (
      cycleDay >= data.cycleLength - 16 &&
      cycleDay <= data.cycleLength - 12
    ) {
      tips.push({
        type: 'fertility',
        title: 'Thời kỳ rụng trứng',
        content:
          'Đây là thời điểm có khả năng thụ thai cao nhất. Chú ý theo dõi dấu hiệu cơ thể.',
        icon: 'heart',
      });
    } else if (cycleDay >= data.cycleLength - 7) {
      tips.push({
        type: 'pms',
        title: 'Chuẩn bị cho kỳ kinh',
        content:
          'Giảm caffeine và muối, tăng cường ăn rau xanh để giảm triệu chứng PMS.',
        icon: 'care',
      });
    }

    setCycleData(prev => ({ ...prev, personalizedTips: tips }));
  };

  const scheduleNotifications = data => {
    if (!data.lastPeriod) return;

    const notifications = [];
    const today = new Date();

    // Nhắc nhở rụng trứng
    const ovulationDate = addDays(
      new Date(data.lastPeriod),
      data.cycleLength - 14
    );
    const daysToOvulation = differenceInDays(ovulationDate, today);

    if (daysToOvulation === 1) {
      notifications.push({
        id: 'ovulation_tomorrow',
        type: 'ovulation',
        title: 'Rụng trứng dự kiến',
        message:
          'Ngày mai là ngày dự đoán rụng trứng. Hãy theo dõi các dấu hiệu của cơ thể!',
        scheduledFor: 'tomorrow',
        priority: 'high',
      });
    }

    // Nhắc nhở kỳ kinh sắp tới
    const nextPeriodDate = addDays(new Date(data.lastPeriod), data.cycleLength);
    const daysToNextPeriod = differenceInDays(nextPeriodDate, today);

    if (daysToNextPeriod === 2) {
      notifications.push({
        id: 'period_coming',
        type: 'period',
        title: 'Kỳ kinh sắp tới',
        message:
          'Kỳ kinh dự kiến bắt đầu trong 2 ngày nữa. Hãy chuẩn bị sẵn sàng!',
        scheduledFor: 'soon',
        priority: 'medium',
      });
    }

    // Nhắc nhở chăm sóc sức khỏe
    if (daysToNextPeriod <= 7 && daysToNextPeriod > 2) {
      notifications.push({
        id: 'health_reminder',
        type: 'health',
        title: 'Chăm sóc sức khỏe',
        message:
          'Hãy duy trì chế độ ăn uống lành mạnh và tập thể dục nhẹ nhàng.',
        scheduledFor: 'weekly',
        priority: 'low',
      });
    }

    setNotifications(notifications);
  };

  const updateCycleData = newData => {
    const updatedData = { ...cycleData, ...newData };
    setCycleData(updatedData);
    calculatePredictions(updatedData);
    generatePersonalizedTips(updatedData);
    scheduleNotifications(updatedData);

    if (user) {
      updateUserProfile({ cycleData: updatedData });
    }
  };

  const addSymptom = (date, symptom, severity = 'mild') => {
    const dateKey = safeFormatDate(date, 'yyyy-MM-dd');
    if (!dateKey) return;
    const newSymptoms = {
      ...(cycleData.symptoms || {}),
      [dateKey]: [
        ...((cycleData.symptoms && cycleData.symptoms[dateKey]) || []),
        { symptom, severity, time: new Date().toISOString() },
      ],
    };
    updateCycleData({ symptoms: newSymptoms });
  };

  const addMood = (date, mood, intensity = 'normal') => {
    const dateKey = safeFormatDate(date, 'yyyy-MM-dd');
    if (!dateKey) return;
    const newMood = {
      ...(cycleData.mood || {}),
      [dateKey]: [
        ...((cycleData.mood && cycleData.mood[dateKey]) || []),
        { mood, intensity, time: new Date().toISOString() },
      ],
    };
    updateCycleData({ mood: newMood });
  };

  const addNote = (date, note) => {
    const dateKey = safeFormatDate(date, 'yyyy-MM-dd');
    if (!dateKey) return;
    const newNotes = {
      ...(cycleData.notes || {}),
      [dateKey]: [
        ...((cycleData.notes && cycleData.notes[dateKey]) || []),
        { note, time: new Date().toISOString() },
      ],
    };
    updateCycleData({ notes: newNotes });
  };

  const addCycleHistory = (startDate, endDate, cycleLength, symptoms = []) => {
    const formattedStartDate = safeFormatDate(startDate, 'yyyy-MM-dd');
    const formattedEndDate = safeFormatDate(endDate, 'yyyy-MM-dd');

    if (!formattedStartDate || !formattedEndDate) {
      console.warn('Invalid dates provided to addCycleHistory');
      return;
    }

    const newHistoryEntry = {
      id: Date.now(),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      cycleLength,
      symptoms,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [...(cycleData.cycleHistory || []), newHistoryEntry];
    updateCycleData({ cycleHistory: updatedHistory });
  };

  const getDaysUntilNextPeriod = () => {
    if (!predictions.nextPeriod) return null;
    const days = differenceInDays(predictions.nextPeriod, new Date());
    return days >= 0 ? days : null;
  };

  const getDaysUntilOvulation = () => {
    if (!predictions.ovulation) return null;
    const days = differenceInDays(predictions.ovulation, new Date());
    return days >= 0 ? days : null;
  };

  const isInFertilityWindow = () => {
    if (!predictions.fertilityWindow) return false;
    const today = new Date();
    return (
      today >= predictions.fertilityWindow.start &&
      today <= predictions.fertilityWindow.end
    );
  };

  const getDataForDate = date => {
    const dateKey = safeFormatDate(date, 'yyyy-MM-dd');
    if (!dateKey) return { symptoms: [], mood: [], notes: [] };

    return {
      symptoms: (cycleData.symptoms && cycleData.symptoms[dateKey]) || [],
      mood: (cycleData.mood && cycleData.mood[dateKey]) || [],
      notes: (cycleData.notes && cycleData.notes[dateKey]) || [],
    };
  };

  const getCyclePhaseForDate = date => {
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
    if (
      cycleDay >= cycleData.cycleLength - 11 &&
      cycleDay <= cycleData.cycleLength - 3
    )
      return 'luteal';
    if (cycleDay >= cycleData.cycleLength - 3) return 'premenstrual';
    return 'follicular';
  };

  const getHealthRecommendations = () => {
    const phase = predictions.currentPhase;
    const recommendations = {
      menstrual: [
        { type: 'rest', text: 'Nghỉ ngơi đầy đủ và tránh stress' },
        { type: 'food', text: 'Ăn thực phẩm giàu sắt như rau bina, thịt đỏ' },
        { type: 'exercise', text: 'Yoga nhẹ nhàng hoặc đi bộ' },
      ],
      fertile: [
        { type: 'nutrition', text: 'Tăng cường folate và vitamin E' },
        { type: 'hydration', text: 'Uống đủ nước, ít nhất 2L/ngày' },
        { type: 'monitoring', text: 'Theo dõi dấu hiệu rụng trứng' },
      ],
      luteal: [
        { type: 'mood', text: 'Thực hành thiền định để cân bằng tâm trạng' },
        { type: 'food', text: 'Giảm caffeine và đường' },
        { type: 'exercise', text: 'Tập thể dục vừa phải' },
      ],
      premenstrual: [
        { type: 'preparation', text: 'Chuẩn bị băng vệ sinh cho kỳ kinh' },
        { type: 'comfort', text: 'Sử dụng túi chườm ấm nếu đau bụng' },
        { type: 'nutrition', text: 'Ăn thực phẩm giàu magie như hạt, chuối' },
      ],
    };

    return recommendations[phase] || [];
  };

  const value = {
    cycleData,
    predictions,
    notifications,
    updateCycleData,
    addSymptom,
    addMood,
    addNote,
    addCycleHistory,
    getDaysUntilNextPeriod,
    getDaysUntilOvulation,
    isInFertilityWindow,
    getDataForDate,
    getCyclePhaseForDate,
    getHealthRecommendations,
  };

  return (
    <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
  );
};
