import {
  ActivityLevel,
  Gender,
  Goal,
  MacroRatios,
} from "@/src/stores/user.store";

export function calculateBMRMifflinStJeor(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number
): number {
  // Mifflin-St Jeor Equation
  // Men: BMR = 10W + 6.25H − 5A + 5
  // Women: BMR = 10W + 6.25H − 5A − 161
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === "male" ? base + 5 : base - 161);
}

export function activityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "active":
      return 1.725;
    case "very_active":
      return 1.9;
    default:
      return 1.2;
  }
}

export function adjustForGoal(calories: number, goal: Goal): number {
  // Simple adjustment for MVP
  if (goal === "lose") return Math.max(1200, Math.round(calories - 400));
  if (goal === "gain") return Math.round(calories + 300);
  return Math.round(calories);
}

export function calculateDailyCalorieTarget(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
  activity: ActivityLevel,
  goal: Goal
): number {
  const bmr = calculateBMRMifflinStJeor(gender, age, heightCm, weightKg);
  const tdee = bmr * activityMultiplier(activity);
  return adjustForGoal(tdee, goal);
}

// Default macro ratios based on goal
export function getDefaultMacroRatios(goal: Goal): MacroRatios {
  switch (goal) {
    case "lose":
      return { protein: 40, carbs: 30, fat: 30 }; // High protein for weight loss
    case "gain":
      return { protein: 30, carbs: 40, fat: 30 }; // Higher carbs for muscle gain
    case "maintain":
    default:
      return { protein: 30, carbs: 40, fat: 30 }; // Balanced
  }
}

// Calculate macro targets in grams based on calorie target and ratios
export function calculateMacroTargets(
  calorieTarget: number,
  ratios: MacroRatios
) {
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const proteinGrams = Math.round((calorieTarget * (ratios.protein / 100)) / 4);
  const carbsGrams = Math.round((calorieTarget * (ratios.carbs / 100)) / 4);
  const fatGrams = Math.round((calorieTarget * (ratios.fat / 100)) / 9);

  return {
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  };
}

// Calculate estimated time to reach weight goal
export function calculateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  weeklyChange: number
): number {
  if (weeklyChange === 0) return 0;
  const totalChange = Math.abs(targetWeight - currentWeight);
  return Math.ceil(totalChange / Math.abs(weeklyChange));
}
