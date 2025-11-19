import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog } from "@/src/stores/log.store";
import { Goal } from "@/src/stores/user.store";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import { Text, View } from "react-native";

interface NutritionalInsightsProps {
  todayLogs: FoodLog[];
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  goal: Goal;
}

export function NutritionalInsights({
  todayLogs,
  calorieTarget,
  proteinTarget,
  carbsTarget,
  fatTarget,
  goal,
}: NutritionalInsightsProps) {
  const { colors } = useAppTheme();

  const totalCalories = todayLogs.reduce((sum, l) => sum + l.calories, 0);
  const totalProtein = todayLogs.reduce((sum, l) => sum + l.protein, 0);
  const totalCarbs = todayLogs.reduce((sum, l) => sum + l.carbs, 0);
  const totalFat = todayLogs.reduce((sum, l) => sum + l.fat, 0);

  const caloriesRemaining = calorieTarget - totalCalories;
  const proteinRemaining = proteinTarget - totalProtein;
  const carbsRemaining = carbsTarget - totalCarbs;
  const fatRemaining = fatTarget - totalFat;

  const proteinPct = (totalProtein / proteinTarget) * 100;
  const carbsPct = (totalCarbs / carbsTarget) * 100;
  const fatPct = (totalFat / fatTarget) * 100;

  // Calculate meal distribution
  const mealCalories = {
    breakfast: todayLogs
      .filter((l) => l.meal === "breakfast")
      .reduce((sum, l) => sum + l.calories, 0),
    lunch: todayLogs
      .filter((l) => l.meal === "lunch")
      .reduce((sum, l) => sum + l.calories, 0),
    dinner: todayLogs
      .filter((l) => l.meal === "dinner")
      .reduce((sum, l) => sum + l.calories, 0),
    snack: todayLogs
      .filter((l) => l.meal === "snack")
      .reduce((sum, l) => sum + l.calories, 0),
  };

  const totalLogged = Object.values(mealCalories).reduce(
    (sum, val) => sum + val,
    0
  );

  // Generate insights
  const insights: {
    type: "success" | "warning" | "info";
    message: string;
  }[] = [];

  // Calorie insights
  if (caloriesRemaining > 300) {
    insights.push({
      type: "info",
      message: `You have ${Math.round(caloriesRemaining)} calories remaining today. ${
        goal === "gain"
          ? "Consider adding a protein-rich snack to meet your bulking goals."
          : goal === "lose"
            ? "Great progress! You're in a calorie deficit."
            : "You're on track for maintenance."
      }`,
    });
  } else if (caloriesRemaining < -200) {
    insights.push({
      type: "warning",
      message: `You've exceeded your target by ${Math.round(Math.abs(caloriesRemaining))} calories. ${
        goal === "lose"
          ? "This might slow your weight loss progress."
          : goal === "gain"
            ? "This is acceptable for bulking, but ensure quality calories."
            : "Consider adjusting portions tomorrow."
      }`,
    });
  } else {
    insights.push({
      type: "success",
      message: `Perfect! You're right on target with your calorie intake.`,
    });
  }

  // Protein insights
  if (proteinPct < 80) {
    insights.push({
      type: "warning",
      message: `Protein intake is low (${Math.round(totalProtein)}g / ${proteinTarget}g). Add lean meats, eggs, or protein shakes to preserve muscle mass.`,
    });
  } else if (proteinPct >= 90 && proteinPct <= 110) {
    insights.push({
      type: "success",
      message: `Excellent protein intake! This supports ${
        goal === "gain"
          ? "muscle growth"
          : goal === "lose"
            ? "muscle preservation during weight loss"
            : "muscle maintenance"
      }.`,
    });
  }

  // Carbs insights for specific goals
  if (goal === "lose" && carbsPct > 120) {
    insights.push({
      type: "info",
      message: `Carb intake is high for weight loss. Consider replacing some carbs with vegetables or lean protein.`,
    });
  } else if (goal === "gain" && carbsPct < 80) {
    insights.push({
      type: "info",
      message: `Increase carbs to fuel your workouts and muscle growth. Add rice, pasta, or oats.`,
    });
  }

  // Fat insights
  if (fatPct < 60) {
    insights.push({
      type: "warning",
      message: `Fat intake is low. Healthy fats are essential for hormone production. Add nuts, avocado, or olive oil.`,
    });
  }

  // Meal distribution insights
  const largestMeal = Object.entries(mealCalories).reduce((a, b) =>
    b[1] > a[1] ? b : a
  );
  const largestMealPct = (largestMeal[1] / totalLogged) * 100;

  if (largestMealPct > 50) {
    insights.push({
      type: "info",
      message: `Your ${largestMeal[0]} contains ${Math.round(largestMealPct)}% of today's calories. Consider spreading calories more evenly for better energy levels.`,
    });
  }

  // Meal frequency
  const mealsLogged = Object.values(mealCalories).filter(
    (cal) => cal > 0
  ).length;
  if (mealsLogged < 3 && totalCalories > calorieTarget * 0.5) {
    insights.push({
      type: "info",
      message: `You've logged ${mealsLogged} meal(s). Eating more frequently can help ${
        goal === "gain"
          ? "meet your calorie surplus"
          : "manage hunger and energy levels"
      }.`,
    });
  }

  const IconComponent = (type: "success" | "warning" | "info") => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} color={colors.success} />;
      case "warning":
        return <AlertCircle size={20} color={colors.warning} />;
      case "info":
        return <Activity size={20} color={colors.primary} />;
    }
  };

  return (
    <View
      className="p-5 rounded-2xl"
      style={{ backgroundColor: colors["bg-100"] }}
    >
      {/* Header */}
      <Text
        className="text-xl font-bold mb-3"
        style={{ color: colors["bg-text"] }}
      >
        💡 Today's Insights
      </Text>

      {/* Quick Stats */}
      <View
        className="p-3 rounded-xl mb-4"
        style={{ backgroundColor: colors["bg-200"] }}
      >
        <View className="flex-row justify-between mb-2">
          <Text style={{ color: colors["bg-text-muted"] }}>Remaining</Text>
          <View className="flex-row items-center gap-1">
            {caloriesRemaining > 0 ? (
              <TrendingDown size={16} color={colors.success} />
            ) : (
              <TrendingUp size={16} color={colors.danger} />
            )}
            <Text
              style={{
                color:
                  caloriesRemaining > 0
                    ? colors.success
                    : caloriesRemaining < -100
                      ? colors.danger
                      : colors.warning,
                fontWeight: "600",
              }}
            >
              {Math.round(Math.abs(caloriesRemaining))} kcal
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between">
          <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
            P: {Math.round(totalProtein)}g / {proteinTarget}g
          </Text>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
            C: {Math.round(totalCarbs)}g / {carbsTarget}g
          </Text>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
            F: {Math.round(totalFat)}g / {fatTarget}g
          </Text>
        </View>
      </View>

      {/* Insights List */}
      {insights.length > 0 ? (
        <View className="gap-3">
          {insights.map((insight, idx) => (
            <View
              key={idx}
              className="flex-row gap-3 p-3 rounded-xl"
              style={{
                backgroundColor:
                  insight.type === "success"
                    ? "rgba(16, 185, 129, 0.1)"
                    : insight.type === "warning"
                      ? "rgba(245, 158, 11, 0.1)"
                      : "rgba(59, 130, 246, 0.1)",
              }}
            >
              <View className="mt-1">{IconComponent(insight.type)}</View>
              <Text
                className="flex-1"
                style={{
                  color: colors["bg-text"],
                  fontSize: 13,
                  lineHeight: 18,
                }}
              >
                {insight.message}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ color: colors["bg-text-muted"], textAlign: "center" }}>
          Log your first meal to see insights!
        </Text>
      )}

      {/* Goal-specific tips */}
      {todayLogs.length > 0 && (
        <View
          className="mt-4 p-3 rounded-xl"
          style={{ backgroundColor: colors["bg-300"] }}
        >
          <Text
            className="font-semibold mb-1"
            style={{ color: colors["bg-text"], fontSize: 13 }}
          >
            {goal === "lose"
              ? "💪 Weight Loss Tip"
              : goal === "gain"
                ? "🏋️ Muscle Gain Tip"
                : "🎯 Maintenance Tip"}
          </Text>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
            {goal === "lose"
              ? "Aim for 0.5-1kg loss per week. Prioritize protein to preserve muscle while in a deficit."
              : goal === "gain"
                ? "Eat in a 300-500 calorie surplus. Focus on progressive overload in training."
                : "Adjust calories based on weekly weight trends. Aim for stable weight within ±1kg."}
          </Text>
        </View>
      )}
    </View>
  );
}
