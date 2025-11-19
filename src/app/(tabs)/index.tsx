import { EditFoodModal } from "@/src/components/EditFoodModal";
import { MealRecommendations } from "@/src/components/MealRecommendations";
import { MealSection } from "@/src/components/MealSection";
import { NutritionalInsights } from "@/src/components/NutritionalInsights";
import { StreakTracker } from "@/src/components/StreakTracker";
import { WaterTracker } from "@/src/components/WaterTracker";
import { WeeklyProgress } from "@/src/components/WeeklyProgress";
import { Button, Card, EmptyState, ProgressBar } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { FoodLog, useLogStore } from "@/src/stores/log.store";
import { useUserStore } from "@/src/stores/user.store";
import {
  calculateMacroTargets,
  getDefaultMacroRatios,
} from "@/src/utils/calorie";
import { getTodayKey } from "@/src/utils/date";
import { Link } from "expo-router";
import { Plus, UserRound, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const profile = useUserStore((s) => s.profile);
  const logsByDate = useLogStore((s) => s.logsByDate);
  const today = getTodayKey();
  const todayLogs = logsByDate[today] ?? [];

  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);

  // Calculate totals
  const totalCalories = todayLogs.reduce((sum, l) => sum + l.calories, 0);
  const protein = todayLogs.reduce((sum, l) => sum + l.protein, 0);
  const carbs = todayLogs.reduce((sum, l) => sum + l.carbs, 0);
  const fat = todayLogs.reduce((sum, l) => sum + l.fat, 0);
  const goal = profile?.calorieTarget ?? 0;
  const progress = goal > 0 ? Math.min(1, totalCalories / goal) : 0;
  const caloriesRemaining = goal - totalCalories;

  // Calculate macro targets
  const macroRatios =
    profile?.macroRatios ??
    (profile?.goal
      ? getDefaultMacroRatios(profile.goal)
      : { protein: 30, carbs: 40, fat: 30 });
  const macroTargets =
    goal > 0
      ? calculateMacroTargets(goal, macroRatios)
      : { protein: 0, carbs: 0, fat: 0 };

  // Group by meal category
  const breakfastLogs = todayLogs.filter((l) => l.meal === "breakfast");
  const lunchLogs = todayLogs.filter((l) => l.meal === "lunch");
  const dinnerLogs = todayLogs.filter((l) => l.meal === "dinner");
  const snackLogs = todayLogs.filter((l) => l.meal === "snack");

  const breakfastCals = breakfastLogs.reduce((sum, l) => sum + l.calories, 0);
  const lunchCals = lunchLogs.reduce((sum, l) => sum + l.calories, 0);
  const dinnerCals = dinnerLogs.reduce((sum, l) => sum + l.calories, 0);
  const snackCals = snackLogs.reduce((sum, l) => sum + l.calories, 0);

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
          <Button variant="ghost" size="sm">
            <UserRound size={32} color={colors["bg-text"]} />
          </Button>
        </Link>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 gap-6">
          {/* Onboarding CTA */}
          {!profile && (
            <Card>
              <Text
                className="text-2xl font-bold mb-2"
                style={{ color: colors["bg-text"] }}
              >
                Welcome to NutriCal! 👋
              </Text>
              <Text
                className="text-base mb-4"
                style={{ color: colors["bg-text-muted"] }}
              >
                Set up your profile to get a personalized calorie target and
                start tracking your nutrition.
              </Text>
              <Link href="/onboarding" asChild>
                <Button variant="primary">Start Onboarding</Button>
              </Link>
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
                {Math.round(totalCalories)} / {goal || "—"}
              </Text>
              <ProgressBar progress={progress} height={12} />
              <Text
                className="mt-2 text-sm"
                style={{
                  color:
                    caloriesRemaining < 0
                      ? colors.danger
                      : colors["bg-text-muted"],
                }}
              >
                {caloriesRemaining >= 0
                  ? `${Math.round(caloriesRemaining)} kcal remaining`
                  : `Over by ${Math.abs(Math.round(caloriesRemaining))} kcal`}
              </Text>
            </Card>
          )}

          {/* Macros Card */}
          {profile && goal > 0 && (
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
                    {Math.round(protein)}g / {macroTargets.protein}g
                  </Text>
                </View>
                <ProgressBar
                  progress={protein / macroTargets.protein}
                  color="#10b981"
                  height={8}
                />
              </View>

              {/* Carbs */}
              <View className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors["bg-text-muted"] }}>Carbs</Text>
                  <Text style={{ color: colors["bg-text"] }}>
                    {Math.round(carbs)}g / {macroTargets.carbs}g
                  </Text>
                </View>
                <ProgressBar
                  progress={carbs / macroTargets.carbs}
                  color="#f59e0b"
                  height={8}
                />
              </View>

              {/* Fat */}
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors["bg-text-muted"] }}>Fat</Text>
                  <Text style={{ color: colors["bg-text"] }}>
                    {Math.round(fat)}g / {macroTargets.fat}g
                  </Text>
                </View>
                <ProgressBar
                  progress={fat / macroTargets.fat}
                  color="#ef4444"
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
              calorieTarget={goal}
              proteinTarget={macroTargets.protein}
              carbsTarget={macroTargets.carbs}
              fatTarget={macroTargets.fat}
              goal={profile.goal}
            />
          )}

          {/* Weekly Progress */}
          {profile && <WeeklyProgress />}

          {/* Meal Recommendations */}
          {profile && caloriesRemaining > 100 && (
            <MealRecommendations
              goal={profile.goal}
              calorieTarget={goal}
              proteinTarget={macroTargets.protein}
              currentCalories={totalCalories}
              currentProtein={protein}
            />
          )}

          {/* Meals Section */}
          <View className="flex-row justify-between items-center">
            <Text
              className="text-xl font-bold"
              style={{ color: colors["bg-text"] }}
            >
              Today&apos;s Meals
            </Text>
            <Link href="/food/search" asChild>
              <Button variant="accent" size="sm">
                <View className="flex-row items-center gap-2">
                  <Plus size={18} color="#fff" />
                  <Text className="text-white font-semibold">Add Food</Text>
                </View>
              </Button>
            </Link>
          </View>

          {todayLogs.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No meals logged yet"
              description="Start tracking your nutrition by adding your first meal!"
              action={
                <Link href="/food/search" asChild>
                  <Button variant="primary">
                    <View className="flex-row items-center gap-2">
                      <Plus size={18} color="#fff" />
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
                logs={breakfastLogs}
                totalCalories={breakfastCals}
                onEditLog={setEditingLog}
              />
              <MealSection
                emoji="☀️"
                title="Lunch"
                logs={lunchLogs}
                totalCalories={lunchCals}
                onEditLog={setEditingLog}
              />
              <MealSection
                emoji="🌙"
                title="Dinner"
                logs={dinnerLogs}
                totalCalories={dinnerCals}
                onEditLog={setEditingLog}
              />
              <MealSection
                emoji="🍿"
                title="Snacks"
                logs={snackLogs}
                totalCalories={snackCals}
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
    </View>
  );
}
