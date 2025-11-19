import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CustomFood {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isCustom: true;
  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  ingredients: RecipeIngredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
}

export interface RecipeIngredient {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodState {
  customFoods: CustomFood[];
  recipes: Recipe[];
  addCustomFood: (food: CustomFood) => void;
  updateCustomFood: (id: string, food: Partial<CustomFood>) => void;
  deleteCustomFood: (id: string) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getCustomFoodById: (id: string) => CustomFood | undefined;
  getRecipeById: (id: string) => Recipe | undefined;
  clearAll: () => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      customFoods: [],
      recipes: [],
      addCustomFood: (food) =>
        set((state) => ({ customFoods: [...state.customFoods, food] })),
      updateCustomFood: (id, update) =>
        set((state) => ({
          customFoods: state.customFoods.map((f) =>
            f.id === id ? { ...f, ...update } : f
          ),
        })),
      deleteCustomFood: (id) =>
        set((state) => ({
          customFoods: state.customFoods.filter((f) => f.id !== id),
        })),
      addRecipe: (recipe) =>
        set((state) => ({ recipes: [...state.recipes, recipe] })),
      updateRecipe: (id, update) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...update } : r
          ),
        })),
      deleteRecipe: (id) =>
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),
      getCustomFoodById: (id) => get().customFoods.find((f) => f.id === id),
      getRecipeById: (id) => get().recipes.find((r) => r.id === id),
      clearAll: () => set({ customFoods: [], recipes: [] }),
    }),
    {
      name: "food-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
