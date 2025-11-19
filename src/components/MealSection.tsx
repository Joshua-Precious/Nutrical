import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog } from "@/src/stores/log.store";
import { Text, View } from "react-native";
import { FoodItemCard } from "./FoodItemCard";

interface MealSectionProps {
  emoji: string;
  title: string;
  logs: FoodLog[];
  totalCalories: number;
  onEditLog?: (log: FoodLog) => void;
}

export function MealSection({
  emoji,
  title,
  logs,
  totalCalories,
  onEditLog,
}: MealSectionProps) {
  const { colors } = useAppTheme();

  if (logs.length === 0) return null;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className="text-base font-bold"
          style={{ color: colors["bg-text"] }}
        >
          {emoji} {title}
        </Text>
        <Text style={{ color: colors["bg-text-muted"] }}>
          {Math.round(totalCalories)} kcal
        </Text>
      </View>
      {logs.map((log) => (
        <FoodItemCard key={log.id} log={log} onEdit={onEditLog} />
      ))}
    </View>
  );
}
