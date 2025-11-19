import { Card, EmptyState } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLogStore } from "@/src/stores/log.store";
import { useUserStore } from "@/src/stores/user.store";
import { getLastNDates, getTodayKey } from "@/src/utils/date";
import { BarChart3 } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

export default function AnalyticsScreen() {
  const { colors } = useAppTheme();
  const logsByDate = useLogStore((s) => s.logsByDate);
  const waterByDate = useLogStore((s) => s.waterByDate);
  const profile = useUserStore((s) => s.profile);

  const todayKey = getTodayKey();
  const last7 = useMemo(() => getLastNDates(7), []);
  const last30 = useMemo(() => getLastNDates(30), []);

  const todayTotal = useMemo(() => {
    const entries = logsByDate[todayKey] ?? [];
    return entries.reduce((s, e) => s + e.calories, 0);
  }, [logsByDate, todayKey]);

  const sevenDayAvg = useMemo(() => {
    const totals = last7.map((d) => {
      const entries = logsByDate[d] ?? [];
      return entries.reduce((s, e) => s + e.calories, 0);
    });
    const sum = totals.reduce((s, v) => s + v, 0);
    return Math.round(sum / Math.max(1, totals.length));
  }, [logsByDate, last7]);

  const thirtyDayAvg = useMemo(() => {
    const totals = last30.map((d) => {
      const entries = logsByDate[d] ?? [];
      return entries.reduce((s, e) => s + e.calories, 0);
    });
    const sum = totals.reduce((s, v) => s + v, 0);
    return Math.round(sum / Math.max(1, totals.length));
  }, [logsByDate, last30]);

  // Calculate 7-day data for chart
  const weekData = useMemo(() => {
    return last7.map((date) => {
      const entries = logsByDate[date] ?? [];
      const calories = entries.reduce((s, e) => s + e.calories, 0);
      const protein = entries.reduce((s, e) => s + e.protein, 0);
      const water = waterByDate[date] ?? 0;
      return { date, calories, protein, water };
    });
  }, [logsByDate, waterByDate, last7]);

  const target = profile?.calorieTarget ?? 2000;
  const percent = Math.min(100, Math.round((todayTotal / target) * 100));
  const remaining = Math.round(target - todayTotal);

  const maxCalories = Math.max(...weekData.map((d) => d.calories), target);

  const hasData = Object.keys(logsByDate).length > 0;

  return (
    <ScrollView style={{ backgroundColor: colors["bg-200"] }}>
      <View className="flex-1 mt-16 px-6 gap-6 pb-10">
        <Text
          className="text-3xl font-bold"
          style={{ color: colors["bg-text"] }}
        >
          Analytics
        </Text>

        {!hasData ? (
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            description="Start logging your meals to see your analytics and progress over time."
          />
        ) : (
          <>
            {/* Today */}
            <Card>
              <Text
                className="text-lg font-semibold mb-2"
                style={{ color: colors["bg-text"] }}
              >
                Today
              </Text>
              <Text
                className="text-3xl font-bold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                {Math.round(todayTotal)} kcal
              </Text>

              <View
                style={{
                  height: 12,
                  backgroundColor: colors["bg-300"],
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 12,
                    width: `${percent}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>

              <View className="flex-row justify-between mt-3">
                <Text style={{ color: colors["bg-text-muted"] }}>
                  Target: <Text style={{ color: colors["bg-text"] }}>{target} kcal</Text>
                </Text>
                <Text style={{ color: colors["bg-text-muted"] }}>{percent}%</Text>
              </View>

              <Text
                className="mt-3"
                style={{
                  color: remaining < 0 ? colors.danger : colors["bg-text-muted"],
                }}
              >
                {remaining >= 0
                  ? `${remaining} kcal remaining`
                  : `Over by ${Math.abs(remaining)} kcal`}
              </Text>
            </Card>

            {/* 7-day Chart */}
            <Card>
              <Text
                className="text-lg font-semibold mb-4"
                style={{ color: colors["bg-text"] }}
              >
                Last 7 Days
              </Text>

              <View className="flex-row items-end justify-between h-40 mb-3">
                {weekData.reverse().map((day, i) => {
                  const heightPercent = (day.calories / maxCalories) * 100;
                  const dayLabel = new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  const isToday = day.date === todayKey;

                  return (
                    <View key={i} className="flex-1 items-center gap-2">
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: colors["bg-text-muted"] }}
                      >
                        {Math.round(day.calories)}
                      </Text>
                      <View
                        className="w-full rounded-t-lg"
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: day.calories > 0 ? 8 : 0,
                          backgroundColor: isToday ? colors.primary : colors["bg-300"],
                          marginHorizontal: 2,
                        }}
                      />
                      <Text
                        className="text-xs"
                        style={{
                          color: isToday ? colors.primary : colors["bg-text-muted"],
                          fontWeight: isToday ? "bold" : "normal",
                        }}
                      >
                        {dayLabel}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View
                className="pt-3"
                style={{ borderTopWidth: 1, borderTopColor: colors["bg-300"] }}
              >
                <View className="flex-row justify-between">
                  <Text style={{ color: colors["bg-text-muted"] }}>Average</Text>
                  <Text
                    className="font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    {sevenDayAvg} kcal/day
                  </Text>
                </View>
              </View>
            </Card>

            {/* 30-day Average */}
            <Card>
              <Text
                className="text-lg font-semibold mb-2"
                style={{ color: colors["bg-text"] }}
              >
                30-day Average
              </Text>
              <Text
                className="text-3xl font-bold"
                style={{ color: colors["bg-text"] }}
              >
                {thirtyDayAvg} kcal/day
              </Text>
              <Text className="mt-2" style={{ color: colors["bg-text-muted"] }}>
                Based on the last 30 days of logs
              </Text>
            </Card>

            {/* Water Stats */}
            <Card>
              <Text
                className="text-lg font-semibold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Water Intake (Last 7 Days)
              </Text>
              {weekData.reverse().map((day, i) => {
                const dayLabel = new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const waterLiters = (day.water / 1000).toFixed(1);
                const progress = Math.min(1, day.water / 2000);

                return (
                  <View key={i} className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text style={{ color: colors["bg-text-muted"], fontSize: 13 }}>
                        {dayLabel}
                      </Text>
                      <Text style={{ color: colors["bg-text"], fontSize: 13 }}>
                        {waterLiters}L
                      </Text>
                    </View>
                    <View
                      className="h-2 w-full rounded-full"
                      style={{ backgroundColor: colors["bg-300"] }}
                    >
                      <View
                        className="h-2 rounded-full"
                        style={{
                          width: `${progress * 100}%`,
                          backgroundColor: colors.primary,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
}
