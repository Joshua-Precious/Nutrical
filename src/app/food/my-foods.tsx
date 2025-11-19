import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFoodStore } from "@/src/stores/food.store";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

export default function MyFoodsScreen() {
  const { colors } = useAppTheme();
  const customFoods = useFoodStore((s) => s.customFoods);
  const recipes = useFoodStore((s) => s.recipes);
  const deleteCustomFood = useFoodStore((s) => s.deleteCustomFood);
  const deleteRecipe = useFoodStore((s) => s.deleteRecipe);

  function handleDeleteFood(id: string, name: string) {
    Alert.alert("Delete Food", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCustomFood(id),
      },
    ]);
  }

  function handleDeleteRecipe(id: string, name: string) {
    Alert.alert("Delete Recipe", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteRecipe(id),
      },
    ]);
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors["bg-200"] }}>
      <View className="mt-12 px-6 mb-4">
        <Pressable
          onPress={() => router.back()}
          className="mb-3 self-start px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors["bg-300"] }}
        >
          <Text style={{ color: colors["bg-text"] }}>Back</Text>
        </Pressable>
        <Text
          className="text-2xl font-bold"
          style={{ color: colors["bg-text"] }}
        >
          My Foods & Recipes
        </Text>
      </View>

      <FlatList
        data={[
          ...customFoods.map((f) => ({ ...f, type: "food" as const })),
          ...recipes.map((r) => ({ ...r, type: "recipe" as const })),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
        ListEmptyComponent={
          <Text
            className="text-center mt-10"
            style={{ color: colors["bg-text-muted"] }}
          >
            No custom foods or recipes yet.{"\n"}
            Create some from the Add Food screen!
          </Text>
        }
        renderItem={({ item }) => (
          <View
            className="mb-3 p-4 rounded-xl flex-row justify-between items-center"
            style={{ backgroundColor: colors["bg-100"] }}
          >
            <View className="flex-1">
              <Text
                className="text-base font-semibold"
                style={{ color: colors["bg-text"] }}
              >
                {item.type === "recipe" ? "📖 " : "🍽️ "}
                {item.name}
              </Text>
              {item.type === "food" && (
                <Text style={{ color: colors["bg-text-muted"], fontSize: 13 }}>
                  {item.brand ? `${item.brand} · ` : ""}
                  {Math.round(item.caloriesPer100g)} kcal/100g
                </Text>
              )}
              {item.type === "recipe" && (
                <Text style={{ color: colors["bg-text-muted"], fontSize: 13 }}>
                  {item.ingredients.length} ingredients · {item.servings}{" "}
                  servings · {Math.round(item.totalCalories / item.servings)}{" "}
                  kcal/serving
                </Text>
              )}
            </View>
            <Pressable
              onPress={() =>
                item.type === "food"
                  ? handleDeleteFood(item.id, item.name)
                  : handleDeleteRecipe(item.id, item.name)
              }
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors["bg-300"] }}
            >
              <Trash2 size={20} color="#ef4444" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
