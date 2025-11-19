import { Card } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLogStore } from "@/src/stores/log.store";
import { useUserStore } from "@/src/stores/user.store";
import { getLastNDates } from "@/src/utils/date";
import { Flame } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";

export function StreakTracker() {
  const { colors } = useAppTheme();
  const logsByDate = useLogStore((s) => s.logsByDate);
  const profile = useUserStore((s) => s.profile);

  const currentStreak = useMemo(() => {
    if (!profile) return 0;

    const dates = getLastNDates(365); // Check last year
    let streak = 0;

    for (const date of dates) {
      const logs = logsByDate[date] ?? [];
      const totalCals = logs.reduce((s, l) => s + l.calories, 0);

      // Count as a logged day if they logged at least something
      if (totalCals > 0) {
        streak++;
      } else {
        break; // Streak broken
      }
    }

    return streak;
  }, [logsByDate, profile]);

  if (!profile || currentStreak === 0) return null;

  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors["bg-200"] }}
          >
            <Flame size={24} color={colors.primary} />
          </View>
          <View>
            <Text
              className="text-sm"
              style={{ color: colors["bg-text-muted"] }}
            >
              Current Streak
            </Text>
            <Text
              className="text-2xl font-bold"
              style={{ color: colors["bg-text"] }}
            >
              {currentStreak} {currentStreak === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>
        <Text className="text-3xl">🔥</Text>
      </View>

      {currentStreak >= 7 && (
        <View
          className="mt-3 p-2 rounded-lg"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <Text
            className="text-center text-sm"
            style={{ color: colors["bg-text"] }}
          >
            {currentStreak >= 30
              ? "🏆 Amazing! You're unstoppable!"
              : currentStreak >= 14
                ? "💪 Two weeks strong! Keep it up!"
                : "🌟 One week streak! You're doing great!"}
          </Text>
        </View>
      )}
    </Card>
  );
}
