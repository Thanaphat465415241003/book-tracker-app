import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type GoalsState = {
  monthlyGoal: number;      // เป้าหมายจำนวนเล่ม/เดือน
  yearlyGoal: number;       // เผื่ออนาคต
};

type GoalsContextType = {
  goals: GoalsState;
  setMonthlyGoal: (n: number) => Promise<void>;
  setYearlyGoal: (n: number) => Promise<void>;
  isLoading: boolean;
};

const DEFAULT_GOALS: GoalsState = { monthlyGoal: 0, yearlyGoal: 0 };
const STORAGE_KEY = 'book-tracker/goals:v1';

const GoalsContext = createContext<GoalsContextType>({
  goals: DEFAULT_GOALS,
  setMonthlyGoal: async () => {},
  setYearlyGoal: async () => {},
  isLoading: true,
});

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<GoalsState>(DEFAULT_GOALS);
  const [isLoading, setIsLoading] = useState(true);

  // โหลดค่าจาก storage ตอนเปิดแอป
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setGoals(JSON.parse(raw));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: GoalsState) => {
    setGoals(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setMonthlyGoal = useCallback(async (n: number) => {
    const safe = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
    await persist({ ...goals, monthlyGoal: safe });
  }, [goals, persist]);

  const setYearlyGoal = useCallback(async (n: number) => {
    const safe = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
    await persist({ ...goals, yearlyGoal: safe });
  }, [goals, persist]);

  return (
    <GoalsContext.Provider value={{ goals, setMonthlyGoal, setYearlyGoal, isLoading }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);
