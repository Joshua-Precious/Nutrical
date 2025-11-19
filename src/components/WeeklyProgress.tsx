import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog, useLogStore } from "@/src/stores/log.store";
import { useUserStore } from "@/src/stores/user.store";
import { getTodayKey } from "@/src/utils/date";
import {
  Activity,
  Calendar,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import { Text, View } from "react-native";

export function WeeklyProgress() {
  const { colors } = useAppTheme();
  const profile = useUserStore((s) => s.profile);
  const logsByDate = useLogStore((s) => s.logsByDate);

  if (!profile) return null;

  const goal = profile.goal;
  const calorieTarget = profile.calorieTarget;

  // Get last 7 days
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      days.push({ dateKey, dayName, date });
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Calculate daily totals
  const dailyData = last7Days.map(({ dateKey, dayName, date }) => {
    const logs: FoodLog[] = logsByDate[dateKey] ?? [];
    const calories = logs.reduce((sum, l) => sum + l.calories, 0);
    const protein = logs.reduce((sum, l) => sum + l.protein, 0);
    const carbs = logs.reduce((sum, l) => sum + l.carbs, 0);
    const fat = logs.reduce((sum, l) => sum + l.fat, 0);
    const isToday = dateKey === getTodayKey();

    return {
      dateKey,
      dayName,
      date,
      isToday,
      calories,
      protein,
      carbs,
      fat,
      deficit: calorieTarget - calories,
      percentage: calorieTarget > 0 ? (calories / calorieTarget) * 100 : 0,
    };
  });

  // Calculate weekly averages
  const daysWithLogs = dailyData.filter((d) => d.calories > 0).length;
  const avgCalories = daysWithLogs
    ? dailyData.reduce((sum, d) => sum + d.calories, 0) / daysWithLogs
    : 0;
  const avgDeficit = calorieTarget - avgCalories;
  const weeklyDeficit = dailyData.reduce((sum, d) => sum + d.deficit, 0);

  // Estimate weight change (rough: 7700 cal = 1 kg)
  const estimatedWeightChange = weeklyDeficit / 7700;

  // Consistency score (days logged out of 7)
  const consistencyPct = (daysWithLogs / 7) * 100;

  return (
    <View
      className="p-5 rounded-2xl"
      style={{ backgroundColor: colors["bg-100"] }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Calendar size={20} color={colors["bg-text"]} />
          <Text
            className="text-xl font-bold"
            style={{ color: colors["bg-text"] }}
          >
            Weekly Progress
          </Text>
        </View>
      </View>

      {/* Weekly Stats */}
      <View className="gap-3 mb-4">
        <View
          className="p-3 rounded-xl"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <View className="flex-row justify-between items-center">
            <Text style={{ color: colors["bg-text-muted"] }}>
              Avg. Daily Intake
            </Text>
            <Text
              className="font-bold"
              style={{ color: colors["bg-text"], fontSize: 16 }}
            >
              {Math.round(avgCalories)} kcal
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-1">
            <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
              Target: {calorieTarget} kcal
            </Text>
            <Text
              style={{
                color:
                  avgDeficit > 0
                    ? goal === "lose"
                      ? "#10b981"
                      : "#f59e0b"
                    : goal === "gain"
                      ? "#10b981"
                      : "#f59e0b",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {avgDeficit > 0 ? "-" : "+"}
              {Math.abs(Math.round(avgDeficit))} kcal/day
            </Text>
          </View>
        </View>

        <View
          className="p-3 rounded-xl"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text style={{ color: colors["bg-text-muted"] }}>
              Est. Weekly Change
            </Text>
            <View className="flex-row items-center gap-1">
              {estimatedWeightChange < 0 ? (
                <TrendingDown size={16} color="#10b981" />
              ) : (
                <TrendingUp size={16} color="#3b82f6" />
              )}
              <Text
                className="font-bold"
                style={{
                  color:
                    estimatedWeightChange < 0
                      ? goal === "lose"
                        ? "#10b981"
                        : "#ef4444"
                      : goal === "gain"
                        ? "#10b981"
                        : "#3b82f6",
                  fontSize: 16,
                }}
              >
                {estimatedWeightChange > 0 ? "+" : ""}
                {Math.abs(estimatedWeightChange).toFixed(2)} kg
              </Text>
            </View>
          </View>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 11 }}>
            Based on {daysWithLogs} days of data. Actual results may vary.
          </Text>
        </View>

        <View
          className="p-3 rounded-xl"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Activity size={16} color={colors["bg-text-muted"]} />
              <Text style={{ color: colors["bg-text-muted"] }}>
                Tracking Consistency
              </Text>
            </View>
            <Text
              className="font-bold"
              style={{
                color:
                  consistencyPct >= 85
                    ? "#10b981"
                    : consistencyPct >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                fontSize: 16,
              }}
            >
              {daysWithLogs}/7 days
            </Text>
          </View>
          <View
            className="h-2 w-full rounded-full mt-2"
            style={{ backgroundColor: colors["bg-300"] }}
          >
            <View
              className="h-2 rounded-full"
              style={{
                width: `${consistencyPct}%`,
                backgroundColor:
                  consistencyPct >= 85
                    ? "#10b981"
                    : consistencyPct >= 60
                      ? "#f59e0b"
                      : "#ef4444",
              }}
            />
          </View>
        </View>
      </View>

      {/* Daily Breakdown */}
      <Text
        className="text-sm font-semibold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Daily Breakdown
      </Text>
      <View className="gap-2">
        {dailyData.map((day) => (
          <View
            key={day.dateKey}
            className="flex-row items-center justify-between p-2 rounded-lg"
            style={{
              backgroundColor: day.isToday
                ? colors["bg-300"]
                : colors["bg-200"],
            }}
          >
            <View className="flex-row items-center gap-2">
              <Text
                className="w-10 font-semibold"
                style={{
                  color: day.isToday ? colors.primary : colors["bg-text"],
                  fontSize: 13,
                }}
              >
                {day.dayName}
              </Text>
              {day.calories > 0 ? (
                <Text style={{ color: colors["bg-text"], fontSize: 12 }}>
                  {Math.round(day.calories)} kcal
                </Text>
              ) : (
                <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
                  Not logged
                </Text>
              )}
            </View>
            {day.calories > 0 && (
              <View className="flex-row items-center gap-1">
                <View
                  className="h-1.5 rounded-full"
                  style={{
                    width: 40,
                    backgroundColor: colors["bg-300"],
                  }}
                >
                  <View
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(100, day.percentage)}%`,
                      backgroundColor:
                        day.percentage >= 90 && day.percentage <= 110
                          ? "#10b981"
                          : day.percentage > 110
                            ? goal === "gain"
                              ? "#3b82f6"
                              : "#f59e0b"
                            : "#f59e0b",
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: colors["bg-text-muted"],
                    fontSize: 10,
                    width: 35,
                  }}
                >
                  {Math.round(day.percentage)}%
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Recommendations */}
      {consistencyPct < 85 && (
        <View
          className="mt-4 p-3 rounded-xl"
          style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
        >
          <Text
            className="font-semibold mb-1"
            style={{ color: colors["bg-text"], fontSize: 13 }}
          >
            📊 Tracking Tip
          </Text>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
            Track at least 6 days per week for accurate progress monitoring and
            better results!
          </Text>
        </View>
      )}

      {Math.abs(avgDeficit) < 100 &&
        goal !== "maintain" &&
        daysWithLogs >= 5 && (
          <View
            className="mt-3 p-3 rounded-xl"
            style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
          >
            <Text
              className="font-semibold mb-1"
              style={{ color: colors["bg-text"], fontSize: 13 }}
            >
              ⚖️ Calorie Adjustment
            </Text>
            <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
              Your average intake is very close to maintenance. Consider{" "}
              {goal === "lose" ? "reducing" : "increasing"} by 200-300 calories
              for better {goal === "lose" ? "weight loss" : "muscle gain"}.
            </Text>
          </View>
        )}
    </View>
  );
}
