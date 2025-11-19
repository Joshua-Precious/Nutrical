import { EditFoodModal } from "@/src/components/EditFoodModal";
import { MealRecommendations } from "@/src/components/MealRecommendations";
import { MealSection } from "@/src/components/MealSection";
import { NutritionalInsights } from "@/src/components/NutritionalInsights";
import { StreakTracker } from "@/src/components/StreakTracker";
import { WaterTracker } from "@/src/components/WaterTracker";
import { WeeklyProgress } from "@/src/components/WeeklyProgress";
import {
  Button,
  Card,
  EmptyState,
  FloatingButton,
  ProgressBar,
  SectionHeader,
} from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog, useLogStore } from "@/src/stores/log.store";
import { useUserStore } from "@/src/stores/user.store";
import {
  calculateMacroTargets,
  getDefaultMacroRatios,
} from "@/src/utils/calorie";
import { getTodayKey } from "@/src/utils/date";
import { Link, router } from "expo-router";
import { Plus, UserRound, UtensilsCrossed } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const profile = useUserStore((s) => s.profile);
  const logsByDate = useLogStore((s) => s.logsByDate);
  const today = getTodayKey();
  const todayLogs = logsByDate[today] ?? [];

  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);

  // Memoize macro targets calculation - only recalculate when profile changes
  const macroTargets = useMemo(() => {
    const goal = profile?.calorieTarget ?? 0;
    if (goal === 0) return { protein: 0, carbs: 0, fat: 0 };

    const macroRatios =
      profile?.macroRatios ??
      (profile?.goal
        ? getDefaultMacroRatios(profile.goal)
        : { protein: 30, carbs: 40, fat: 30 });

    return calculateMacroTargets(goal, macroRatios);
  }, [profile?.calorieTarget, profile?.macroRatios, profile?.goal]);

  // Memoize totals and meal breakdowns - only recalculate when logs change
  const nutritionSummary = useMemo(() => {
    const totalCalories = todayLogs.reduce((sum, l) => sum + l.calories, 0);
    const protein = todayLogs.reduce((sum, l) => sum + l.protein, 0);
    const carbs = todayLogs.reduce((sum, l) => sum + l.carbs, 0);
    const fat = todayLogs.reduce((sum, l) => sum + l.fat, 0);

    // Group by meal category
    const breakfastLogs = todayLogs.filter((l) => l.meal === "breakfast");
    const lunchLogs = todayLogs.filter((l) => l.meal === "lunch");
    const dinnerLogs = todayLogs.filter((l) => l.meal === "dinner");
    const snackLogs = todayLogs.filter((l) => l.meal === "snack");

    return {
      totalCalories,
      protein,
      carbs,
      fat,
      breakfastLogs,
      lunchLogs,
      dinnerLogs,
      snackLogs,
      breakfastCals: breakfastLogs.reduce((sum, l) => sum + l.calories, 0),
      lunchCals: lunchLogs.reduce((sum, l) => sum + l.calories, 0),
      dinnerCals: dinnerLogs.reduce((sum, l) => sum + l.calories, 0),
      snackCals: snackLogs.reduce((sum, l) => sum + l.calories, 0),
    };
  }, [todayLogs]);

  // Memoize progress calculations - only recalculate when totals or targets change
  const progressValues = useMemo(() => {
    const goal = profile?.calorieTarget ?? 0;
    const calorieProgress =
      goal > 0 ? Math.min(1, nutritionSummary.totalCalories / goal) : 0;
    const caloriesRemaining = goal - nutritionSummary.totalCalories;

    return {
      goal,
      calorieProgress,
      caloriesRemaining,
      proteinProgress:
        macroTargets.protein > 0
          ? Math.max(
              0,
              Math.min(1, nutritionSummary.protein / macroTargets.protein)
            )
          : 0,
      carbsProgress:
        macroTargets.carbs > 0
          ? Math.max(
              0,
              Math.min(1, nutritionSummary.carbs / macroTargets.carbs)
            )
          : 0,
      fatProgress:
        macroTargets.fat > 0
          ? Math.max(0, Math.min(1, nutritionSummary.fat / macroTargets.fat))
          : 0,
    };
  }, [profile?.calorieTarget, nutritionSummary, macroTargets]);

  return (
    <View style={{ backgroundColor: colors["bg-200"] }} className="flex-1">
      {/* Header */}
      <View
        className="p-5 pt-16 mb-6 flex-row justify-between items-center"
        style={{ backgroundColor: colors["bg-100"] }}
      >
        <View className="flex">
          <Text
            className="text-3xl font-bold"
            style={{ color: colors["bg-text"] }}
          >
            NutriCal
          </Text>
          <Text
            className="text-lg opacity-60"
            style={{ color: colors["bg-text"] }}
          >
            Good Morning, Friend!
          </Text>
        </View>

        <Link href="/(tabs)/profile" asChild>
          <Button
            variant="ghost"
            size="sm"
            accessibilityLabel="Go to profile settings"
            accessibilityRole="button"
          >
            <UserRound size={32} color={colors["bg-text"]} />
          </Button>
        </Link>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 gap-6">
          {/* Onboarding CTA */}
          {!profile && (
            <Card style={{ borderWidth: 2, borderColor: colors.primary }}>
              <View className="items-center">
                <Text className="text-4xl mb-3">👋</Text>
                <Text
                  className="text-2xl font-bold mb-2 text-center"
                  style={{ color: colors["bg-text"] }}
                >
                  Welcome to NutriCal!
                </Text>
                <Text
                  className="text-base mb-6 text-center"
                  style={{ color: colors["bg-text-muted"], lineHeight: 22 }}
                >
                  Set up your personalized profile to get your calorie target,
                  track macros, and reach your health goals.
                </Text>
                <Link href="/onboarding" asChild>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    accessibilityLabel="Start onboarding to set up your profile"
                  >
                    <Text className="text-white font-bold text-lg">
                      Get Started
                    </Text>
                  </Button>
                </Link>
              </View>
            </Card>
          )}

          {/* Calorie Card */}
          {profile && (
            <Card>
              <Text
                className="text-lg font-semibold mb-2"
                style={{ color: colors["bg-text"] }}
              >
                Today&apos;s Calories
              </Text>
              <Text
                className="text-4xl font-extrabold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                {Math.round(nutritionSummary.totalCalories)} /{" "}
                {progressValues.goal || "—"}
              </Text>
              <ProgressBar
                progress={progressValues.calorieProgress}
                height={12}
              />
              <Text
                className="mt-2 text-sm"
                style={{
                  color:
                    progressValues.caloriesRemaining < 0
                      ? colors.danger
                      : colors["bg-text-muted"],
                }}
              >
                {progressValues.caloriesRemaining >= 0
                  ? `${Math.round(progressValues.caloriesRemaining)} kcal remaining`
                  : `Over by ${Math.abs(Math.round(progressValues.caloriesRemaining))} kcal`}
              </Text>
            </Card>
          )}

          {/* Macros Card */}
          {profile && progressValues.goal > 0 && (
            <Card>
              <Text
                className="text-lg font-semibold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Macros
              </Text>

              {/* Protein */}
              <View className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors["bg-text-muted"] }}>
                    Protein
                  </Text>
                  <Text style={{ color: colors["bg-text"] }}>
                    {Math.round(nutritionSummary.protein)}g /{" "}
                    {macroTargets.protein}g
                  </Text>
                </View>
                <ProgressBar
                  progress={progressValues.proteinProgress}
                  color={colors.success}
                  height={8}
                />
              </View>

              {/* Carbs */}
              <View className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors["bg-text-muted"] }}>Carbs</Text>
                  <Text style={{ color: colors["bg-text"] }}>
                    {Math.round(nutritionSummary.carbs)}g / {macroTargets.carbs}
                    g
                  </Text>
                </View>
                <ProgressBar
                  progress={progressValues.carbsProgress}
                  color={colors.warning}
                  height={8}
                />
              </View>

              {/* Fat */}
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors["bg-text-muted"] }}>Fat</Text>
                  <Text style={{ color: colors["bg-text"] }}>
                    {Math.round(nutritionSummary.fat)}g / {macroTargets.fat}g
                  </Text>
                </View>
                <ProgressBar
                  progress={progressValues.fatProgress}
                  color={colors.danger}
                  height={8}
                />
              </View>
            </Card>
          )}

          {/* Water Tracker */}
          {profile && <WaterTracker />}

          {/* Streak Tracker */}
          {profile && <StreakTracker />}

          {/* Nutritional Insights */}
          {profile && todayLogs.length > 0 && (
            <NutritionalInsights
              todayLogs={todayLogs}
              calorieTarget={progressValues.goal}
              proteinTarget={macroTargets.protein}
              carbsTarget={macroTargets.carbs}
              fatTarget={macroTargets.fat}
              goal={profile.goal}
            />
          )}

          {/* Weekly Progress */}
          {profile && <WeeklyProgress />}

          {/* Meal Recommendations */}
          {profile && progressValues.caloriesRemaining > 100 && (
            <MealRecommendations
              goal={profile.goal}
              calorieTarget={progressValues.goal}
              proteinTarget={macroTargets.protein}
              currentCalories={nutritionSummary.totalCalories}
              currentProtein={nutritionSummary.protein}
            />
          )}

          {/* Meals Section */}
          <SectionHeader
            title="Today's Meals"
            action={
              <Link href="/food/search" asChild>
                <Button
                  variant="accent"
                  size="sm"
                  accessibilityLabel="Add food to today's meals"
                  accessibilityRole="button"
                >
                  <View className="flex-row items-center gap-2">
                    <Plus size={18} color={colors.white} />
                    <Text className="text-white font-semibold">Add Food</Text>
                  </View>
                </Button>
              </Link>
            }
          />

          {todayLogs.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No meals logged yet"
              description="Start tracking your nutrition by adding your first meal!"
              action={
                <Link href="/food/search" asChild>
                  <Button variant="primary">
                    <View className="flex-row items-center gap-2">
                      <Plus size={18} color={colors.white} />
                      <Text className="text-white font-semibold">
                        Add First Meal
                      </Text>
                    </View>
                  </Button>
                </Link>
              }
            />
          ) : (
            <View className="mb-16">
              <MealSection
                emoji="🌅"
                title="Breakfast"
                logs={nutritionSummary.breakfastLogs}
                totalCalories={nutritionSummary.breakfastCals}
                onEditLog={setEditingLog}
              />
              <MealSection
                emoji="☀️"
                title="Lunch"
                logs={nutritionSummary.lunchLogs}
                totalCalories={nutritionSummary.lunchCals}
                onEditLog={setEditingLog}
              />
              <MealSection
                emoji="🌙"
                title="Dinner"
                logs={nutritionSummary.dinnerLogs}
                totalCalories={nutritionSummary.dinnerCals}
                onEditLog={setEditingLog}
              />
              <MealSection
                emoji="🍿"
                title="Snacks"
                logs={nutritionSummary.snackLogs}
                totalCalories={nutritionSummary.snackCals}
                onEditLog={setEditingLog}
              />
            </View>
          )}

          <Link href="/(tabs)/history" asChild>
            <Button variant="secondary" className="mb-10">
              View Full History
            </Button>
          </Link>
        </View>
      </ScrollView>

      {/* Edit Food Modal */}
      <EditFoodModal
        visible={!!editingLog}
        log={editingLog}
        onClose={() => setEditingLog(null)}
      />

      {/* Floating Action Button */}
      {profile && (
        <FloatingButton
          onPress={() => router.push("/food/search")}
          accessibilityLabel="Add food to log"
          testID="fab-add-food"
        >
          <Plus size={24} color={colors.white} />
        </FloatingButton>
      )}
    </View>
  );
}
