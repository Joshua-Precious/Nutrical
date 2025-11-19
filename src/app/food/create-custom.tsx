import { useAppTheme } from "@/src/hooks/useAppTheme";
import { CustomFood, useFoodStore } from "@/src/stores/food.store";
import { router } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateCustomFood() {
  const { colors } = useAppTheme();
  const addCustomFood = useFoodStore((s) => s.addCustomFood);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingSize, setServingSize] = useState("100");
  const [servingUnit, setServingUnit] = useState("g");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a food name");
      return;
    }

    const cal = parseFloat(calories) || 0;
    const prot = parseFloat(protein) || 0;
    const carb = parseFloat(carbs) || 0;
    const f = parseFloat(fat) || 0;
    const serving = parseFloat(servingSize) || 100;

    const customFood: CustomFood = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      brand: brand.trim() || undefined,
      servingSize: serving,
      servingUnit: servingUnit.trim(),
      caloriesPer100g: cal,
      proteinPer100g: prot,
      carbsPer100g: carb,
      fatPer100g: f,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    addCustomFood(customFood);
    Alert.alert("Success", "Custom food created!");
    router.back();
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors["bg-200"] }}
    >
      <View className="mt-16 px-6 pb-10">
        <View className="flex flex-row gap-2">
          <Pressable onPress={() => router.back()}>
            <ArrowLeftIcon size={30} color={colors["bg-text"]} />
          </Pressable>

          <Text
            className="text-2xl font-bold mb-6"
            style={{ color: colors["bg-text"] }}
          >
            Create Custom Food
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text
              className="mb-2 font-semibold"
              style={{ color: colors["bg-text"] }}
            >
              Food Name *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Homemade Pasta"
              placeholderTextColor={colors["bg-text-muted"]}
              className="px-4 py-3 rounded-xl"
              style={{
                backgroundColor: colors["bg-100"],
                color: colors["bg-text"],
              }}
            />
          </View>

          <View>
            <Text
              className="mb-2 font-semibold"
              style={{ color: colors["bg-text"] }}
            >
              Brand (Optional)
            </Text>
            <TextInput
              value={brand}
              onChangeText={setBrand}
              placeholder="e.g., Homemade"
              placeholderTextColor={colors["bg-text-muted"]}
              className="px-4 py-3 rounded-xl"
              style={{
                backgroundColor: colors["bg-100"],
                color: colors["bg-text"],
              }}
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text
                className="mb-2 font-semibold"
                style={{ color: colors["bg-text"] }}
              >
                Serving Size
              </Text>
              <TextInput
                value={servingSize}
                onChangeText={setServingSize}
                keyboardType="decimal-pad"
                placeholder="100"
                placeholderTextColor={colors["bg-text-muted"]}
                className="px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: colors["bg-100"],
                  color: colors["bg-text"],
                }}
              />
            </View>
            <View className="flex-1">
              <Text
                className="mb-2 font-semibold"
                style={{ color: colors["bg-text"] }}
              >
                Unit
              </Text>
              <TextInput
                value={servingUnit}
                onChangeText={setServingUnit}
                placeholder="g"
                placeholderTextColor={colors["bg-text-muted"]}
                className="px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: colors["bg-100"],
                  color: colors["bg-text"],
                }}
              />
            </View>
          </View>

          <View className="mt-3">
            <Text
              className="text-lg font-bold mb-3"
              style={{ color: colors["bg-text"] }}
            >
              Nutrition per 100g
            </Text>

            <View className="gap-3">
              <View>
                <Text
                  className="mb-2 font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  Calories (kcal)
                </Text>
                <TextInput
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors["bg-text-muted"]}
                  className="px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: colors["bg-100"],
                    color: colors["bg-text"],
                  }}
                />
              </View>

              <View>
                <Text
                  className="mb-2 font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  Protein (g)
                </Text>
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors["bg-text-muted"]}
                  className="px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: colors["bg-100"],
                    color: colors["bg-text"],
                  }}
                />
              </View>

              <View>
                <Text
                  className="mb-2 font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  Carbs (g)
                </Text>
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors["bg-text-muted"]}
                  className="px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: colors["bg-100"],
                    color: colors["bg-text"],
                  }}
                />
              </View>

              <View>
                <Text
                  className="mb-2 font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  Fat (g)
                </Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors["bg-text-muted"]}
                  className="px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: colors["bg-100"],
                    color: colors["bg-text"],
                  }}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            className="mt-6 py-4 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-center font-bold text-lg">
              Save Custom Food
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
