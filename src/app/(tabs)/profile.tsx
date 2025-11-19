import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useCommonStore } from "@/src/stores/common.store";
import { useFoodStore } from "@/src/stores/food.store";
import { useLogStore } from "@/src/stores/log.store";
import {
  Goal,
  MacroRatios,
  useUserStore,
  WeightGoal,
} from "@/src/stores/user.store";
import {
  calculateDailyCalorieTarget,
  calculateWeeksToGoal,
  getDefaultMacroRatios,
} from "@/src/utils/calorie";
import { Link } from "expo-router";
import { Moon, Sun } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const customFoods = useFoodStore((s) => s.customFoods);
  const recipes = useFoodStore((s) => s.recipes);
  const clearLogs = useLogStore((s) => s.clearAll);
  const clearFoods = useFoodStore((s) => s.clearAll);

  const isDarkMode = useCommonStore((s) => s.isDarkMode);
  const toggleDarkMode = useCommonStore((s) => s.toggleDarkMode);

  const [calorieTarget, setCalorieTarget] = useState(
    profile?.calorieTarget?.toString() ?? "2000"
  );
  const [goalType, setGoalType] = useState<Goal>(profile?.goal ?? "maintain");

  // Macro ratios
  const [proteinRatio, setProteinRatio] = useState(
    profile?.macroRatios?.protein?.toString() ??
      getDefaultMacroRatios(goalType).protein.toString()
  );
  const [carbsRatio, setCarbsRatio] = useState(
    profile?.macroRatios?.carbs?.toString() ??
      getDefaultMacroRatios(goalType).carbs.toString()
  );
  const [fatRatio, setFatRatio] = useState(
    profile?.macroRatios?.fat?.toString() ??
      getDefaultMacroRatios(goalType).fat.toString()
  );

  // Weight goals
  const [targetWeight, setTargetWeight] = useState(
    profile?.weightGoal?.target?.toString() ??
      profile?.weightKg?.toString() ??
      ""
  );
  const [weeklyChange, setWeeklyChange] = useState(
    profile?.weightGoal?.weeklyChange?.toString() ?? "0.5"
  );

  function handleSaveGoals() {
    if (!profile) {
      Alert.alert("Error", "Please complete onboarding first");
      return;
    }

    const cal = parseInt(calorieTarget) || 2000;
    const prot = parseFloat(proteinRatio) || 30;
    const carb = parseFloat(carbsRatio) || 40;
    const f = parseFloat(fatRatio) || 30;

    // Validate macro ratios
    const total = prot + carb + f;
    if (Math.abs(total - 100) > 0.1) {
      Alert.alert(
        "Error",
        `Macro ratios must add up to 100%. Current total: ${total.toFixed(1)}%`
      );
      return;
    }

    const macros: MacroRatios = {
      protein: prot,
      carbs: carb,
      fat: f,
    };

    const target = parseFloat(targetWeight) || profile.weightKg;
    const change = parseFloat(weeklyChange) || 0.5;

    const weightGoal: WeightGoal = {
      current: profile.weightKg,
      target,
      weeklyChange:
        goalType === "lose"
          ? -Math.abs(change)
          : goalType === "gain"
            ? Math.abs(change)
            : 0,
    };

    const updatedProfile = {
      ...profile,
      goal: goalType,
      calorieTarget: cal,
      macroRatios: macros,
      weightGoal,
    };

    setProfile(updatedProfile);
    Alert.alert("Success", "Goals updated successfully!");
  }

  function handleSetDefaultMacros() {
    const defaults = getDefaultMacroRatios(goalType);
    setProteinRatio(defaults.protein.toString());
    setCarbsRatio(defaults.carbs.toString());
    setFatRatio(defaults.fat.toString());
  }

  function handleRecalculateCalories() {
    if (!profile) return;
    const newTarget = calculateDailyCalorieTarget(
      profile.gender,
      profile.age,
      profile.heightCm,
      profile.weightKg,
      profile.activityLevel,
      goalType
    );
    setCalorieTarget(newTarget.toString());
    Alert.alert("Calculated", `Your new target: ${newTarget} kcal/day`);
  }

  const currentWeight = profile?.weightKg ?? 0;
  const targetWt = parseFloat(targetWeight) || currentWeight;
  const change = parseFloat(weeklyChange) || 0.5;
  const weeksToGoal = calculateWeeksToGoal(currentWeight, targetWt, change);

  function handleClearAllData() {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all food logs, custom foods, recipes, and profile data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearLogs();
            clearFoods();
            setProfile(undefined as any);
            Alert.alert("Success", "All data has been cleared");
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors["bg-200"] }}>
      <View className="flex-1 mt-16 px-6 gap-6">
        <Text
          className="text-3xl font-bold"
          style={{
            color: colors["bg-text"],
          }}
        >
          Profile{" "}
        </Text>

        {!profile ? (
          <View
            style={{
              backgroundColor: colors["bg-100"],
              padding: 24,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors["bg-text-muted"],
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Complete onboarding to set your goals
            </Text>
            <Link href="/onboarding" asChild>
              <Pressable
                className="py-3 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-center font-semibold">
                  Start Onboarding
                </Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View className="gap-6">
            {/* Dark Mode Toggle */}
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  {isDarkMode ? (
                    <Moon size={24} color={colors["bg-text"]} />
                  ) : (
                    <Sun size={24} color={colors["bg-text"]} />
                  )}
                  <View>
                    <Text
                      className="text-lg font-bold"
                      style={{ color: colors["bg-text"] }}
                    >
                      Dark Mode
                    </Text>
                    <Text
                      style={{ color: colors["bg-text-muted"], fontSize: 13 }}
                    >
                      {isDarkMode ? "Currently enabled" : "Currently disabled"}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: colors["bg-300"], true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Current Stats */}
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <Text
                className="text-xl font-bold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Your Stats
              </Text>
              <View className="gap-2">
                <Text style={{ color: colors["bg-text-muted"] }}>
                  Age:{" "}
                  <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
                    {profile.age} years
                  </Text>
                </Text>
                <Text style={{ color: colors["bg-text-muted"] }}>
                  Gender:{" "}
                  <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
                    {profile.gender}
                  </Text>
                </Text>
                <Text style={{ color: colors["bg-text-muted"] }}>
                  Height:{" "}
                  <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
                    {profile.heightCm} cm
                  </Text>
                </Text>
                <Text style={{ color: colors["bg-text-muted"] }}>
                  Weight:{" "}
                  <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
                    {profile.weightKg} kg
                  </Text>
                </Text>
                <Text style={{ color: colors["bg-text-muted"] }}>
                  Activity:{" "}
                  <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
                    {profile.activityLevel.replace("_", " ")}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Goal Type */}
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <Text
                className="text-xl font-bold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Goal Type
              </Text>
              <View className="flex-row gap-2">
                {(["lose", "maintain", "gain"] as Goal[]).map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => setGoalType(g)}
                    className="flex-1 py-3 rounded-lg"
                    style={{
                      backgroundColor:
                        goalType === g ? colors.primary : colors["bg-300"],
                    }}
                  >
                    <Text
                      className="text-center font-semibold"
                      style={{
                        color:
                          goalType === g ? colors.white : colors["bg-text"],
                      }}
                    >
                      {g === "lose"
                        ? "📉 Lose"
                        : g === "maintain"
                          ? "➡️ Maintain"
                          : "📈 Gain"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Calorie Target */}
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <Text
                className="text-xl font-bold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Daily Calorie Target
              </Text>
              <TextInput
                value={calorieTarget}
                onChangeText={setCalorieTarget}
                keyboardType="number-pad"
                placeholder="2000"
                placeholderTextColor={colors["bg-text-muted"]}
                className="px-4 py-3 rounded-xl mb-3"
                style={{
                  backgroundColor: colors["bg-200"],
                  color: colors["bg-text"],
                }}
              />
              <Pressable
                onPress={handleRecalculateCalories}
                className="py-2 rounded-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="text-white text-center font-semibold">
                  🔄 Recalculate Based on Profile
                </Text>
              </Pressable>
            </View>

            {/* Weight Goals */}
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <Text
                className="text-xl font-bold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Weight Goal
              </Text>
              <View className="gap-3">
                <View>
                  <Text
                    className="mb-2 font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    Target Weight (kg)
                  </Text>
                  <TextInput
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    keyboardType="decimal-pad"
                    placeholder={profile.weightKg.toString()}
                    placeholderTextColor={colors["bg-text-muted"]}
                    className="px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: colors["bg-200"],
                      color: colors["bg-text"],
                    }}
                  />
                </View>
                <View>
                  <Text
                    className="mb-2 font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    Weekly Change (kg/week)
                  </Text>
                  <TextInput
                    value={weeklyChange}
                    onChangeText={setWeeklyChange}
                    keyboardType="decimal-pad"
                    placeholder="0.5"
                    placeholderTextColor={colors["bg-text-muted"]}
                    className="px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: colors["bg-200"],
                      color: colors["bg-text"],
                    }}
                  />
                </View>
                {weeksToGoal > 0 && (
                  <View
                    className="mt-2 p-3 rounded-lg"
                    style={{ backgroundColor: colors["bg-200"] }}
                  >
                    <Text style={{ color: colors["bg-text-muted"] }}>
                      Estimated time to goal:{" "}
                      <Text
                        className="font-bold"
                        style={{ color: colors["bg-text"] }}
                      >
                        {weeksToGoal} weeks
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: colors["bg-text-muted"],
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      ({Math.abs(targetWt - currentWeight).toFixed(1)} kg{" "}
                      {targetWt > currentWeight ? "to gain" : "to lose"})
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Custom Macro Ratios */}
            <View
              className="p-5 rounded-2xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  className="text-xl font-bold"
                  style={{ color: colors["bg-text"] }}
                >
                  Macro Ratios
                </Text>
                <Pressable
                  onPress={handleSetDefaultMacros}
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: colors["bg-300"] }}
                >
                  <Text style={{ color: colors["bg-text"], fontSize: 12 }}>
                    Use Default
                  </Text>
                </Pressable>
              </View>
              <Text
                className="mb-3"
                style={{ color: colors["bg-text-muted"], fontSize: 13 }}
              >
                Percentages must add up to 100%
              </Text>

              <View className="gap-3">
                <View>
                  <Text
                    className="mb-2 font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    Protein (%)
                  </Text>
                  <TextInput
                    value={proteinRatio}
                    onChangeText={setProteinRatio}
                    keyboardType="decimal-pad"
                    placeholder="30"
                    placeholderTextColor={colors["bg-text-muted"]}
                    className="px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: colors["bg-200"],
                      color: colors["bg-text"],
                    }}
                  />
                </View>
                <View>
                  <Text
                    className="mb-2 font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    Carbs (%)
                  </Text>
                  <TextInput
                    value={carbsRatio}
                    onChangeText={setCarbsRatio}
                    keyboardType="decimal-pad"
                    placeholder="40"
                    placeholderTextColor={colors["bg-text-muted"]}
                    className="px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: colors["bg-200"],
                      color: colors["bg-text"],
                    }}
                  />
                </View>
                <View>
                  <Text
                    className="mb-2 font-semibold"
                    style={{ color: colors["bg-text"] }}
                  >
                    Fat (%)
                  </Text>
                  <TextInput
                    value={fatRatio}
                    onChangeText={setFatRatio}
                    keyboardType="decimal-pad"
                    placeholder="30"
                    placeholderTextColor={colors["bg-text-muted"]}
                    className="px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: colors["bg-200"],
                      color: colors["bg-text"],
                    }}
                  />
                </View>
                <View
                  className="mt-2 p-3 rounded-lg"
                  style={{ backgroundColor: colors["bg-200"] }}
                >
                  <Text style={{ color: colors["bg-text-muted"] }}>
                    Total:{" "}
                    <Text
                      className="font-bold"
                      style={{
                        color:
                          Math.abs(
                            (parseFloat(proteinRatio) || 0) +
                              (parseFloat(carbsRatio) || 0) +
                              (parseFloat(fatRatio) || 0) -
                              100
                          ) < 0.1
                            ? "#10b981"
                            : "#ef4444",
                      }}
                    >
                      {(
                        (parseFloat(proteinRatio) || 0) +
                        (parseFloat(carbsRatio) || 0) +
                        (parseFloat(fatRatio) || 0)
                      ).toFixed(1)}
                      %
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSaveGoals}
              className="py-4 rounded-xl"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-center font-bold text-lg">
                💾 Save Goals
              </Text>
            </Pressable>

            {/* Reset Profile */}
            <Link href="/onboarding" asChild>
              <Pressable
                className="py-3 rounded-lg"
                style={{ backgroundColor: colors["bg-300"] }}
              >
                <Text
                  className="text-center font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  ⚙️ Update Profile Info
                </Text>
              </Pressable>
            </Link>

            {/* My Foods & Recipes */}
            <Link href="/food/my-foods" asChild>
              <Pressable
                className="py-3 rounded-lg mb-8"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="text-white text-center font-semibold">
                  📚 My Foods & Recipes ({customFoods.length + recipes.length})
                </Text>
              </Pressable>
            </Link>

            {/* Clear All Data */}
            <Pressable
              onPress={handleClearAllData}
              className="py-3 rounded-lg mb-8"
              style={{ backgroundColor: colors.danger }}
            >
              <Text className="text-white text-center font-semibold">
                🗑️ Clear All Data
              </Text>
            </Pressable>
          </View>
        )}

        {/* Clear All Data - Always visible */}
        <Pressable
          onPress={handleClearAllData}
          className="mt-4 py-3 rounded-lg mb-8"
          style={{ backgroundColor: colors.danger }}
        >
          <Text className="text-white text-center font-semibold">
            🗑️ Clear All Data
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
