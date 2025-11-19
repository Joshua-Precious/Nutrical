import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealCategory;
  name: string;
  brand?: string;
  servingQty: number; // user-entered quantity units
  servingUnit: string; // e.g., g, ml, serving
  calories: number; // per entry, already multiplied by servingQty
  protein: number; // grams per entry
  carbs: number; // grams per entry
  fat: number; // grams per entry
}

interface LogState {
  logsByDate: Record<string, FoodLog[]>;
  waterByDate: Record<string, number>; // total ml per day
  addLog: (entry: FoodLog) => void;
  updateLog: (date: string, id: string, update: Partial<FoodLog>) => void;
  deleteLog: (date: string, id: string) => void;
  addWater: (date: string, amount: number) => void;
  setWater: (date: string, amount: number) => void;
  clearAll: () => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      logsByDate: {},
      waterByDate: {},
      addLog: (entry) =>
        set((state) => {
          const list = state.logsByDate[entry.date] ?? [];
          return {
            logsByDate: { ...state.logsByDate, [entry.date]: [entry, ...list] },
          };
        }),
      updateLog: (date, id, update) =>
        set((state) => {
          const list = state.logsByDate[date] ?? [];
          const updated = list.map((l) =>
            l.id === id ? { ...l, ...update } : l
          );
          return { logsByDate: { ...state.logsByDate, [date]: updated } };
        }),
      deleteLog: (date, id) =>
        set((state) => {
          const list = state.logsByDate[date] ?? [];
          const filtered = list.filter((l) => l.id !== id);
          return { logsByDate: { ...state.logsByDate, [date]: filtered } };
        }),
      addWater: (date, amount) =>
        set((state) => {
          const current = state.waterByDate[date] ?? 0;
          return {
            waterByDate: { ...state.waterByDate, [date]: current + amount },
          };
        }),
      setWater: (date, amount) =>
        set((state) => ({
          waterByDate: { ...state.waterByDate, [date]: amount },
        })),
      clearAll: () => set({ logsByDate: {}, waterByDate: {} }),
    }),
    {
      name: "food-logs",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
