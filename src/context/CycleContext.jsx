import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { addDays, differenceInDays, format } from "date-fns";

const CycleContext = createContext();

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
};

export const CycleProvider = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const [cycleData, setCycleData] = useState({
    lastPeriod: null,
    cycleLength: 28,
    periodLength: 5,
    symptoms: [],
    mood: [],
    notes: [],
  });

  const [predictions, setPredictions] = useState({
    nextPeriod: null,
    ovulation: null,
    fertilityWindow: null,
  });

  useEffect(() => {
    if (user?.cycleData) {
      setCycleData(user.cycleData);
      calculatePredictions(user.cycleData);
    }
  }, [user]);

  const calculatePredictions = (data) => {
    if (!data.lastPeriod) return;

    const lastPeriodDate = new Date(data.lastPeriod);
    const nextPeriod = addDays(lastPeriodDate, data.cycleLength);
    const ovulation = addDays(lastPeriodDate, data.cycleLength - 14);
    const fertilityStart = addDays(ovulation, -5);
    const fertilityEnd = addDays(ovulation, 1);

    setPredictions({
      nextPeriod,
      ovulation,
      fertilityWindow: { start: fertilityStart, end: fertilityEnd },
    });
  };

  const updateCycleData = (newData) => {
    const updatedData = { ...cycleData, ...newData };
    setCycleData(updatedData);
    calculatePredictions(updatedData);

    if (user) {
      updateUserProfile({ cycleData: updatedData });
    }
  };

  const addSymptom = (date, symptom) => {
    const newSymptoms = [...(cycleData.symptoms || []), { date, symptom }];
    updateCycleData({ symptoms: newSymptoms });
  };

  const addMood = (date, mood) => {
    const newMood = [...(cycleData.mood || []), { date, mood }];
    updateCycleData({ mood: newMood });
  };

  const addNote = (date, note) => {
    const newNotes = [...(cycleData.notes || []), { date, note }];
    updateCycleData({ notes: newNotes });
  };

  const getDaysUntilNextPeriod = () => {
    if (!predictions.nextPeriod) return null;
    return differenceInDays(predictions.nextPeriod, new Date());
  };

  const getDaysUntilOvulation = () => {
    if (!predictions.ovulation) return null;
    return differenceInDays(predictions.ovulation, new Date());
  };

  const isInFertilityWindow = () => {
    if (!predictions.fertilityWindow) return false;
    const today = new Date();
    return (
      today >= predictions.fertilityWindow.start &&
      today <= predictions.fertilityWindow.end
    );
  };

  const value = {
    cycleData,
    predictions,
    updateCycleData,
    addSymptom,
    addMood,
    addNote,
    getDaysUntilNextPeriod,
    getDaysUntilOvulation,
    isInFertilityWindow,
  };

  return (
    <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
  );
};
