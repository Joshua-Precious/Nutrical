import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog, useLogStore } from "@/src/stores/log.store";
import * as Haptics from "expo-haptics";
import { Pencil, Trash2 } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface FoodItemCardProps {
  log: FoodLog;
  onEdit?: (log: FoodLog) => void;
}

export function FoodItemCard({ log, onEdit }: FoodItemCardProps) {
  const { colors } = useAppTheme();
  const deleteLog = useLogStore((s) => s.deleteLog);
  const translateX = useSharedValue(0);

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Delete Food Entry", `Remove "${log.name}" from your log?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteLog(log.date, log.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newValue = event.translationX;
      if (newValue > 0) {
        translateX.value = 0;
      } else if (newValue < -150) {
        translateX.value = -150;
      } else {
        translateX.value = newValue;
      }
    })
    .onEnd(() => {
      if (translateX.value < -80) {
        translateX.value = withSpring(-150);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="mb-2 relative">
      {/* Action buttons behind */}
      <View
        className="absolute right-0 top-0 bottom-0 flex-row items-center justify-end gap-2 px-2"
        style={{ width: 150 }}
      >
        {onEdit && (
          <Pressable
            onPress={() => {
              translateX.value = withSpring(0);
              onEdit(log);
            }}
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.accent }}
          >
            <Pencil size={20} color="#fff" />
          </Pressable>
        )}
        <Pressable
          onPress={handleDelete}
          className="p-3 rounded-xl"
          style={{ backgroundColor: colors.danger }}
        >
          <Trash2 size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Swipeable card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="p-3 rounded-xl"
          style={[{ backgroundColor: colors["bg-100"] }, animatedStyle]}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: colors["bg-text"] }}
          >
            {log.name} {log.brand ? `· ${log.brand}` : ""}
          </Text>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
            {log.servingQty} {log.servingUnit} · {Math.round(log.calories)} kcal
          </Text>
          <Text style={{ color: colors["bg-text-muted"], fontSize: 11 }}>
            P: {Math.round(log.protein)}g · C: {Math.round(log.carbs)}g · F:{" "}
            {Math.round(log.fat)}g
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
