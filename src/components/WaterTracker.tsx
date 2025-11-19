import { Button, Card } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLogStore } from "@/src/stores/log.store";
import { getTodayKey } from "@/src/utils/date";
import * as Haptics from "expo-haptics";
import { Droplet, Minus, Plus } from "lucide-react-native";
import { Text, View } from "react-native";

const GLASS_SIZE = 250; // ml
const DAILY_TARGET = 2000; // ml (8 glasses)

export function WaterTracker() {
  const { colors } = useAppTheme();
  const today = getTodayKey();
  const waterByDate = useLogStore((s) => s.waterByDate);
  const addWater = useLogStore((s) => s.addWater);
  const setWater = useLogStore((s) => s.setWater);

  const currentWater = waterByDate[today] ?? 0;
  const progress = Math.min(1, currentWater / DAILY_TARGET);
  const glassesCount = Math.round(currentWater / GLASS_SIZE);

  const handleAddWater = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addWater(today, GLASS_SIZE);
  };

  const handleRemoveWater = () => {
    if (currentWater > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setWater(today, Math.max(0, currentWater - GLASS_SIZE));
    }
  };

  return (
    <Card>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Droplet size={24} color={colors.primary} />
          <Text
            className="text-lg font-semibold"
            style={{ color: colors["bg-text"] }}
          >
            Water Intake
          </Text>
        </View>
        <Text className="text-sm" style={{ color: colors["bg-text-muted"] }}>
          {currentWater} / {DAILY_TARGET} ml
        </Text>
      </View>

      {/* Progress Bar */}
      <View
        className="h-3 w-full rounded-full mb-4"
        style={{ backgroundColor: colors["bg-300"] }}
      >
        <View
          className="h-3 rounded-full"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: colors.primary,
          }}
        />
      </View>

      {/* Glasses Visual */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            className="w-8 h-10 rounded-lg border-2 items-center justify-center"
            style={{
              borderColor: colors["bg-300"],
              backgroundColor:
                i < glassesCount ? colors.primary : "transparent",
            }}
          >
            {i < glassesCount && <Droplet size={16} color="#fff" />}
          </View>
        ))}
      </View>

      {/* Controls */}
      <View className="flex-row gap-2">
        <Button
          variant="secondary"
          size="sm"
          onPress={handleRemoveWater}
          className="flex-1"
          disabled={currentWater === 0}
        >
          <View className="flex-row items-center gap-2">
            <Minus size={16} color={colors["bg-text"]} />
            <Text style={{ color: colors["bg-text"] }}>Remove</Text>
          </View>
        </Button>
        <Button
          variant="primary"
          size="sm"
          onPress={handleAddWater}
          className="flex-1"
        >
          <View className="flex-row items-center gap-2">
            <Plus size={16} color="#fff" />
            <Text style={{ color: "#fff" }}>Add Glass</Text>
          </View>
        </Button>
      </View>
    </Card>
  );
}
