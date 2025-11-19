import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Goal } from "@/src/stores/user.store";
import { ScrollView, Text, View } from "react-native";

interface MealRecommendationsProps {
  goal: Goal;
  calorieTarget: number;
  proteinTarget: number;
  currentCalories: number;
  currentProtein: number;
}

type FoodSuggestion = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  icon: string;
  why: string;
};

export function MealRecommendations({
  goal,
  calorieTarget,
  proteinTarget,
  currentCalories,
  currentProtein,
}: MealRecommendationsProps) {
  const { colors } = useAppTheme();

  const caloriesRemaining = calorieTarget - currentCalories;
  const proteinRemaining = proteinTarget - currentProtein;

  // Food suggestions based on goal
  const getFoodSuggestions = (): FoodSuggestion[] => {
    const baseSuggestions: FoodSuggestion[] = [];

    if (goal === "lose") {
      baseSuggestions.push(
        {
          name: "Grilled Chicken Breast",
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          icon: "🍗",
          why: "High protein, low calorie - perfect for weight loss",
        },
        {
          name: "Greek Yogurt (0%)",
          calories: 59,
          protein: 10,
          carbs: 4,
          fat: 0.4,
          icon: "🥛",
          why: "Protein-rich, keeps you full longer",
        },
        {
          name: "Mixed Green Salad",
          calories: 30,
          protein: 2,
          carbs: 6,
          fat: 0.3,
          icon: "🥗",
          why: "High volume, low calorie - fills you up",
        },
        {
          name: "Egg White Omelette",
          calories: 52,
          protein: 11,
          carbs: 0.7,
          fat: 0.2,
          icon: "🍳",
          why: "Pure protein with minimal calories",
        },
        {
          name: "Steamed Vegetables",
          calories: 50,
          protein: 3,
          carbs: 10,
          fat: 0.5,
          icon: "🥦",
          why: "Fiber-rich, nutrient-dense, low calorie",
        }
      );
    } else if (goal === "gain") {
      baseSuggestions.push(
        {
          name: "Salmon Fillet",
          calories: 206,
          protein: 22,
          carbs: 0,
          fat: 13,
          icon: "🐟",
          why: "Protein + healthy fats for muscle growth",
        },
        {
          name: "Brown Rice (1 cup)",
          calories: 216,
          protein: 5,
          carbs: 45,
          fat: 1.8,
          icon: "🍚",
          why: "Complex carbs for energy and glycogen",
        },
        {
          name: "Peanut Butter (2 tbsp)",
          calories: 190,
          protein: 8,
          carbs: 7,
          fat: 16,
          icon: "🥜",
          why: "Calorie-dense, good fats, easy to add",
        },
        {
          name: "Whole Eggs (2)",
          calories: 155,
          protein: 13,
          carbs: 1,
          fat: 11,
          icon: "🥚",
          why: "Complete protein, nutrient-rich",
        },
        {
          name: "Avocado (half)",
          calories: 120,
          protein: 1.5,
          carbs: 6,
          fat: 11,
          icon: "🥑",
          why: "Healthy fats, calorie-dense",
        },
        {
          name: "Oatmeal with Banana",
          calories: 240,
          protein: 7,
          carbs: 45,
          fat: 4,
          icon: "🥣",
          why: "Pre-workout fuel, sustained energy",
        }
      );
    } else {
      // Maintain
      baseSuggestions.push(
        {
          name: "Grilled Fish",
          calories: 143,
          protein: 26,
          carbs: 0,
          fat: 3,
          icon: "🐟",
          why: "Lean protein, omega-3 fatty acids",
        },
        {
          name: "Sweet Potato",
          calories: 112,
          protein: 2,
          carbs: 26,
          fat: 0.1,
          icon: "🍠",
          why: "Complex carbs, vitamins, fiber",
        },
        {
          name: "Mixed Nuts (handful)",
          calories: 170,
          protein: 5,
          carbs: 6,
          fat: 15,
          icon: "🥜",
          why: "Healthy fats, protein, satisfying",
        },
        {
          name: "Chicken & Quinoa Bowl",
          calories: 320,
          protein: 35,
          carbs: 30,
          fat: 8,
          icon: "🍲",
          why: "Balanced macros, complete meal",
        }
      );
    }

    return baseSuggestions;
  };

  const suggestions = getFoodSuggestions();

  // Filter suggestions based on remaining calories and protein
  const relevantSuggestions = suggestions.filter((s) => {
    if (caloriesRemaining < 100) return false; // No room for more food
    if (proteinRemaining > 20 && s.protein < 10) return false; // Need more protein
    if (caloriesRemaining < 200 && s.calories > 200) return false; // Too many calories
    return true;
  });

  if (caloriesRemaining < 100) {
    return (
      <View
        className="p-5 rounded-2xl"
        style={{ backgroundColor: colors["bg-100"] }}
      >
        <Text
          className="text-xl font-bold mb-3"
          style={{ color: colors["bg-text"] }}
        >
          🎯 Meal Suggestions
        </Text>
        <View
          className="p-4 rounded-xl"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <Text
            className="text-center font-semibold"
            style={{ color: colors["bg-text"] }}
          >
            You&apos;ve hit your calorie target! 🎉
          </Text>
          <Text
            className="text-center mt-2"
            style={{ color: colors["bg-text-muted"], fontSize: 13 }}
          >
            {goal === "lose"
              ? "Great job staying in a deficit!"
              : goal === "gain"
                ? "Consider adding one more small meal if you're still hungry."
                : "Perfect for maintenance!"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="p-5 rounded-2xl"
      style={{ backgroundColor: colors["bg-100"] }}
    >
      <Text
        className="text-xl font-bold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        🎯 Meal Suggestions
      </Text>
      <Text
        className="mb-4"
        style={{ color: colors["bg-text-muted"], fontSize: 13 }}
      >
        Based on your{" "}
        {goal === "lose"
          ? "weight loss"
          : goal === "gain"
            ? "muscle gain"
            : "maintenance"}{" "}
        goal
      </Text>

      {/* Remaining targets */}
      <View
        className="p-3 rounded-xl mb-4"
        style={{ backgroundColor: colors["bg-200"] }}
      >
        <View className="flex-row justify-between">
          <Text style={{ color: colors["bg-text-muted"] }}>
            Remaining Today
          </Text>
          <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
            {Math.round(caloriesRemaining)} kcal ·{" "}
            {Math.round(proteinRemaining)}g protein
          </Text>
        </View>
      </View>

      {/* Food suggestions */}
      {relevantSuggestions.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="gap-3"
          contentContainerStyle={{ gap: 12 }}
        >
          {relevantSuggestions.map((food, idx) => (
            <View
              key={idx}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: colors["bg-200"],
                width: 180,
              }}
            >
              <Text className="text-3xl mb-2">{food.icon}</Text>
              <Text
                className="font-bold mb-2"
                style={{ color: colors["bg-text"], fontSize: 14 }}
              >
                {food.name}
              </Text>
              <View className="gap-1 mb-2">
                <Text style={{ color: colors["bg-text"], fontSize: 12 }}>
                  {food.calories} kcal
                </Text>
                <Text style={{ color: colors["bg-text-muted"], fontSize: 11 }}>
                  P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                </Text>
              </View>
              <View
                className="pt-2 mt-2"
                style={{ borderTopWidth: 1, borderTopColor: colors["bg-300"] }}
              >
                <Text
                  style={{
                    color: colors["bg-text-muted"],
                    fontSize: 11,
                    lineHeight: 14,
                  }}
                >
                  {food.why}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View
          className="p-4 rounded-xl"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <Text
            className="text-center"
            style={{ color: colors["bg-text-muted"] }}
          >
            Great progress! You&apos;re very close to your target.
          </Text>
        </View>
      )}

      {/* Goal-specific tips */}
      <View
        className="mt-4 p-3 rounded-xl"
        style={{ backgroundColor: colors["bg-300"] }}
      >
        <Text
          className="font-semibold mb-1"
          style={{ color: colors["bg-text"], fontSize: 13 }}
        >
          💡 Quick Tip
        </Text>
        <Text style={{ color: colors["bg-text-muted"], fontSize: 12 }}>
          {goal === "lose"
            ? "Choose foods high in protein and fiber to stay full longer while keeping calories low."
            : goal === "gain"
              ? "Add calorie-dense foods like nuts, nut butters, and healthy oils to reach your surplus without feeling overly full."
              : "Maintain a balanced diet with adequate protein to preserve muscle mass while managing weight."}
        </Text>
      </View>
    </View>
  );
}
