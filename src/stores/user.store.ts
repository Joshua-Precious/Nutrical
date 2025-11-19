import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Gender = "male" | "female";
export type Goal = "lose" | "maintain" | "gain";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface MacroRatios {
  protein: number; // percentage 0-100
  carbs: number; // percentage 0-100
  fat: number; // percentage 0-100
}

export interface WeightGoal {
  current: number; // kg
  target: number; // kg
  weeklyChange: number; // kg per week (negative for loss, positive for gain)
}

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  calorieTarget: number;
  macroRatios?: MacroRatios; // Custom macro percentages
  weightGoal?: WeightGoal;
}

interface UserState {
  profile?: UserProfile;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: undefined,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: undefined }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
