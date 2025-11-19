import { FoodItemCard } from "@/src/components/FoodItemCard";
import { Card, EmptyState } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLogStore } from "@/src/stores/log.store";
import { getLastNDates } from "@/src/utils/date";
import { Calendar } from "lucide-react-native";
import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const logsByDate = useLogStore((s) => s.logsByDate);

  const history = useMemo(() => {
    const dates = getLastNDates(30);
    return dates
      .filter((date) => logsByDate[date] && logsByDate[date].length > 0)
      .map((date) => {
        const entries = logsByDate[date] ?? [];
        const total = entries.reduce((s, e) => s + e.calories, 0);
        const protein = entries.reduce((s, e) => s + e.protein, 0);
        return { date, entries, total, protein };
      });
  }, [logsByDate]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors["bg-200"] }}>
      <View className="mt-16 px-6 mb-4">
        <Text
          className="text-3xl font-bold"
          style={{ color: colors["bg-text"] }}
        >
          History
        </Text>
        <Text
          className="text-base mt-1"
          style={{ color: colors["bg-text-muted"] }}
        >
          Last 30 days
        </Text>
      </View>

      {history.length === 0 ? (
        <View className="px-6">
          <EmptyState
            icon={Calendar}
            title="No history yet"
            description="Your food logs will appear here once you start tracking."
          />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.date}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <Card className="mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    className="text-lg font-bold"
                    style={{ color: colors["bg-text"] }}
                  >
                    {formattedDate}
                  </Text>
                  <View className="flex-row gap-4">
                    <View>
                      <Text
                        className="text-xs"
                        style={{ color: colors["bg-text-muted"] }}
                      >
                        Calories
                      </Text>
                      <Text
                        className="text-sm font-bold"
                        style={{ color: colors["bg-text"] }}
                      >
                        {Math.round(item.total)}
                      </Text>
                    </View>
                    <View>
                      <Text
                        className="text-xs"
                        style={{ color: colors["bg-text-muted"] }}
                      >
                        Protein
                      </Text>
                      <Text
                        className="text-sm font-bold"
                        style={{ color: colors["bg-text"] }}
                      >
                        {Math.round(item.protein)}g
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="gap-2">
                  {item.entries.map((log) => (
                    <FoodItemCard key={log.id} log={log} />
                  ))}
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}
