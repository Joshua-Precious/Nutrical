import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog, useLogStore } from "@/src/stores/log.store";
import * as Haptics from "expo-haptics";
import { MoreVertical, Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Snackbar } from "./ui/Snackbar";

interface FoodItemCardProps {
  log: FoodLog;
  onEdit?: (log: FoodLog) => void;
}

export function FoodItemCard({ log, onEdit }: FoodItemCardProps) {
  const { colors } = useAppTheme();
  const deleteLog = useLogStore((s) => s.deleteLog);
  const addLog = useLogStore((s) => s.addLog);
  const translateX = useSharedValue(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [deletedLog, setDeletedLog] = useState<FoodLog | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    setShowMenu(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Store the log for undo functionality
    setDeletedLog(log);

    // Delete the log
    deleteLog(log.date, log.id);

    // Show snackbar with undo option
    setShowSnackbar(true);

    // Reset swipe position
    translateX.value = withSpring(0);
  };

  const handleUndo = () => {
    if (deletedLog) {
      // Restore the deleted log
      addLog(deletedLog);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setDeletedLog(null);
  };

  const handleEdit = () => {
    setShowMenu(false);
    translateX.value = withSpring(0);
    onEdit?.(log);
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
    <>
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
              accessibilityRole="button"
              accessibilityLabel={`Edit ${log.name}`}
            >
              <Pencil size={20} color="#fff" />
            </Pressable>
          )}
          <Pressable
            onPress={handleDelete}
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.danger }}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${log.name}`}
          >
            <Trash2 size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Swipeable card */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="p-3 rounded-xl flex-row items-center justify-between"
            style={[{ backgroundColor: colors["bg-100"] }, animatedStyle]}
          >
            <View className="flex-1">
              <Text
                className="text-sm font-semibold"
                style={{ color: colors["bg-text"] }}
              >
                {log.name} {log.brand ? `· ${log.brand}` : ""}
              </Text>
              <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
                {log.servingQty} {log.servingUnit} · {Math.round(log.calories)}{" "}
                kcal
              </Text>
              <Text style={{ color: colors["bg-text-muted"], fontSize: 11 }}>
                P: {Math.round(log.protein)}g · C: {Math.round(log.carbs)}g · F:{" "}
                {Math.round(log.fat)}g
              </Text>
            </View>

            {/* Overflow menu button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowMenu(true);
              }}
              className="p-2"
              accessibilityRole="button"
              accessibilityLabel="More options"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MoreVertical size={20} color={colors["bg-text-muted"]} />
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Options Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={{
              backgroundColor: colors["bg-100"],
              borderRadius: 12,
              padding: 8,
              minWidth: 200,
            }}
          >
            {onEdit && (
              <Pressable
                onPress={handleEdit}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  gap: 12,
                }}
                accessibilityRole="button"
                accessibilityLabel="Edit food entry"
              >
                <Pencil size={20} color={colors.accent} />
                <Text
                  style={{
                    color: colors["bg-text"],
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Edit
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleDelete}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                gap: 12,
              }}
              accessibilityRole="button"
              accessibilityLabel="Delete food entry"
            >
              <Trash2 size={20} color={colors.danger} />
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Snackbar for undo */}
      <Snackbar
        visible={showSnackbar}
        message={`Removed "${log.name}" from your log`}
        actionLabel="Undo"
        onAction={handleUndo}
        onDismiss={() => setShowSnackbar(false)}
      />
    </>
  );
}
