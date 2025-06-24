import React, { createContext, useContext, useState } from "react";

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider"
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [counselors, setCounselors] = useState([
    {
      id: 1,
      name: "Dr. Nguyễn Thị Hương",
      specialty: "Chuyên khoa Sản Phụ khoa",
      experience: "10+ năm kinh nghiệm",
      rating: 4.9,
      avatar: "/images/doctor1.jpg",
      available: true,
      timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    },
    {
      id: 2,
      name: "Dr. Lê Văn Minh",
      specialty: "Tư vấn tâm lý",
      experience: "8+ năm kinh nghiệm",
      rating: 4.8,
      avatar: "/images/doctor2.jpg",
      available: true,
      timeSlots: ["09:30", "10:30", "11:30", "14:30", "15:30", "16:30"],
    },
  ]);

  const [consultations, setConsultations] = useState([]);

  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: "scheduled",
      createdAt: new Date(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
    return newAppointment;
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
      )
    );
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, date: newDate, time: newTime, status: "rescheduled" }
          : apt
      )
    );
  };

  const createConsultation = (consultationData) => {
    const newConsultation = {
      id: Date.now(),
      ...consultationData,
      status: "active",
      createdAt: new Date(),
      messages: [],
    };
    setConsultations((prev) => [...prev, newConsultation]);
    return newConsultation;
  };

  const addMessage = (consultationId, message) => {
    setConsultations((prev) =>
      prev.map((consultation) =>
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
      .filter(
        (apt) => new Date(apt.date) >= today && apt.status === "scheduled"
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getAvailableCounselors = () => {
    return counselors.filter((counselor) => counselor.available);
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
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
