import { Button, Card } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog, MealCategory, useLogStore } from "@/src/stores/log.store";
import * as Haptics from "expo-haptics";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface EditFoodModalProps {
  visible: boolean;
  log: FoodLog | null;
  onClose: () => void;
}

const MEAL_OPTIONS: { value: MealCategory; label: string; emoji: string }[] = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch", label: "Lunch", emoji: "☀️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snack", label: "Snacks", emoji: "🍿" },
];

export function EditFoodModal({ visible, log, onClose }: EditFoodModalProps) {
  const { colors } = useAppTheme();
  const updateLog = useLogStore((s) => s.updateLog);

  const [servingQty, setServingQty] = useState(
    log?.servingQty.toString() ?? "1"
  );
  const [meal, setMeal] = useState<MealCategory>(log?.meal ?? "breakfast");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    if (!log) return;

    const qty = parseFloat(servingQty) || 1;
    const multiplier = qty / log.servingQty;

    updateLog(log.date, log.id, {
      servingQty: qty,
      calories: log.calories * multiplier,
      protein: log.protein * multiplier,
      carbs: log.carbs * multiplier,
      fat: log.fat * multiplier,
      meal,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  if (!log) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="rounded-t-3xl p-6 pt-4"
          style={{
            backgroundColor: colors["bg-100"],
            maxHeight: "80%",
          }}
        >
          {/* Handle Bar */}
          <View className="items-center mb-4">
            <View
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: colors["bg-300"] }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-2xl font-bold"
                style={{ color: colors["bg-text"] }}
              >
                Edit Food Entry
              </Text>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close edit food modal"
                style={{
                  minHeight: 44,
                  minWidth: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <X size={24} color={colors["bg-text"]} />
              </Pressable>
            </View>

            {/* Food Name */}
            <Card className="mb-4">
              <Text
                className="text-lg font-bold mb-1"
                style={{ color: colors["bg-text"] }}
              >
                {log.name}
              </Text>
              {log.brand && (
                <Text style={{ color: colors["bg-text-muted"] }}>
                  {log.brand}
                </Text>
              )}
            </Card>

            {/* Serving Quantity */}
            <View className="mb-4">
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: colors["bg-text"] }}
              >
                Serving Quantity
              </Text>
              <View className="flex-row items-center gap-2">
                <TextInput
                  className="flex-1 p-3 rounded-xl font-semibold"
                  style={{
                    backgroundColor: colors["bg-200"],
                    color: colors["bg-text"],
                  }}
                  value={servingQty}
                  onChangeText={setServingQty}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={colors["bg-text-muted"]}
                />
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  {log.servingUnit}
                </Text>
              </View>
            </View>

            {/* Meal Category */}
            <View className="mb-6">
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: colors["bg-text"] }}
              >
                Meal Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {MEAL_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setMeal(option.value);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="px-4 py-2 rounded-xl flex-row items-center gap-2"
                    style={{
                      backgroundColor:
                        meal === option.value
                          ? colors.primary
                          : colors["bg-200"],
                      minHeight: 44,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${option.label} meal`}
                    accessibilityState={{ selected: meal === option.value }}
                  >
                    <Text className="text-base">{option.emoji}</Text>
                    <Text
                      className="font-semibold"
                      style={{
                        color:
                          meal === option.value ? "#fff" : colors["bg-text"],
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Nutrition Preview */}
            <Pressable
              onPress={() => {
                setShowAdvanced(!showAdvanced);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              accessibilityRole="button"
              accessibilityLabel={
                showAdvanced
                  ? "Hide nutrition details"
                  : "Show nutrition details"
              }
            >
              <Card
                className="mb-6"
                style={{ backgroundColor: colors["bg-200"] }}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    Nutrition Preview
                  </Text>
                  {showAdvanced ? (
                    <ChevronUp size={20} color={colors["bg-text-muted"]} />
                  ) : (
                    <ChevronDown size={20} color={colors["bg-text-muted"]} />
                  )}
                </View>
                <View className="flex-row justify-between">
                  <Text style={{ color: colors["bg-text-muted"] }}>
                    Calories
                  </Text>
                  <Text
                    className="font-bold"
                    style={{ color: colors["bg-text"] }}
                  >
                    {Math.round(
                      (log.calories * (parseFloat(servingQty) || 1)) /
                        log.servingQty
                    )}{" "}
                    kcal
                  </Text>
                </View>
                {showAdvanced && (
                  <>
                    <View className="flex-row justify-between mt-1">
                      <Text style={{ color: colors["bg-text-muted"] }}>
                        Protein
                      </Text>
                      <Text style={{ color: colors["bg-text"] }}>
                        {Math.round(
                          (log.protein * (parseFloat(servingQty) || 1)) /
                            log.servingQty
                        )}
                        g
                      </Text>
                    </View>
                    <View className="flex-row justify-between mt-1">
                      <Text style={{ color: colors["bg-text-muted"] }}>
                        Carbs
                      </Text>
                      <Text style={{ color: colors["bg-text"] }}>
                        {Math.round(
                          (log.carbs * (parseFloat(servingQty) || 1)) /
                            log.servingQty
                        )}
                        g
                      </Text>
                    </View>
                    <View className="flex-row justify-between mt-1">
                      <Text style={{ color: colors["bg-text-muted"] }}>
                        Fat
                      </Text>
                      <Text style={{ color: colors["bg-text"] }}>
                        {Math.round(
                          (log.fat * (parseFloat(servingQty) || 1)) /
                            log.servingQty
                        )}
                        g
                      </Text>
                    </View>
                  </>
                )}
              </Card>
            </Pressable>

            {/* Actions */}
            <View className="flex-row gap-2">
              <Button variant="secondary" onPress={onClose} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onPress={handleSave} className="flex-1">
                Save Changes
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
