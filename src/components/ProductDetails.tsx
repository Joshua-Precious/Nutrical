import { useAppTheme } from "@/src/hooks/useAppTheme";
import { DetailedProduct } from "@/src/services/productLookup";
import { MealCategory, useLogStore } from "@/src/stores/log.store";
import { getTodayKey } from "@/src/utils/date";
import { router } from "expo-router";
import { ArrowLeftIcon, Check } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface ProductDetailsProps {
  product: DetailedProduct;
  onClose: () => void;
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const { colors } = useAppTheme();
  const addLog = useLogStore((s) => s.addLog);

  const [servingQty, setServingQty] = useState<string>(
    product.servingSize?.toString() || "100"
  );
  const [servingUnit, setServingUnit] = useState<string>(
    product.servingUnit || (product.isLiquid ? "ml" : "g")
  );
  const [meal, setMeal] = useState<MealCategory>("breakfast");

  // Editable nutrition values for products with missing data
  const hasNoNutrition =
    product.caloriesPer100g === 0 &&
    product.proteinPer100g === 0 &&
    product.carbsPer100g === 0 &&
    product.fatPer100g === 0;

  const [editableCalories, setEditableCalories] = useState<string>(
    product.caloriesPer100g.toString()
  );
  const [editableProtein, setEditableProtein] = useState<string>(
    product.proteinPer100g.toString()
  );
  const [editableCarbs, setEditableCarbs] = useState<string>(
    product.carbsPer100g.toString()
  );
  const [editableFat, setEditableFat] = useState<string>(
    product.fatPer100g.toString()
  );

  function calculateNutrients() {
    const qty = parseFloat(servingQty || "0") || 0;
    const factor = qty / 100;

    // Use editable values if nutrition data is missing
    const caloriesPer100g = hasNoNutrition
      ? parseFloat(editableCalories) || 0
      : product.caloriesPer100g;
    const proteinPer100g = hasNoNutrition
      ? parseFloat(editableProtein) || 0
      : product.proteinPer100g;
    const carbsPer100g = hasNoNutrition
      ? parseFloat(editableCarbs) || 0
      : product.carbsPer100g;
    const fatPer100g = hasNoNutrition
      ? parseFloat(editableFat) || 0
      : product.fatPer100g;

    return {
      calories: Math.round(caloriesPer100g * factor),
      protein: Number((proteinPer100g * factor).toFixed(1)),
      carbs: Number((carbsPer100g * factor).toFixed(1)),
      fat: Number((fatPer100g * factor).toFixed(1)),
      fiber: product.fiberPer100g
        ? Number((product.fiberPer100g * factor).toFixed(1))
        : undefined,
      sugar: product.sugarPer100g
        ? Number((product.sugarPer100g * factor).toFixed(1))
        : undefined,
      sodium: product.sodiumPer100g
        ? Math.round(product.sodiumPer100g * factor)
        : undefined,
      saturatedFat: product.saturatedFatPer100g
        ? Number((product.saturatedFatPer100g * factor).toFixed(1))
        : undefined,
      cholesterol: product.cholesterolPer100g
        ? Math.round(product.cholesterolPer100g * factor)
        : undefined,
    };
  }

  function handleAddToLog() {
    const nutrients = calculateNutrients();
    const qty = parseFloat(servingQty || "0") || 0;

    if (qty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a valid serving quantity.");
      return;
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: getTodayKey(),
      meal,
      name: product.name,
      brand: product.brand,
      servingQty: qty,
      servingUnit,
      calories: nutrients.calories,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fat: nutrients.fat,
    };

    addLog(entry);
    Alert.alert("Success", "Food added to your log!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  function MealChoice({ v }: { v: MealCategory }) {
    const selected = meal === v;
    return (
      <Pressable
        onPress={() => setMeal(v)}
        className="px-3 py-2 rounded-lg mr-2 mb-2"
        style={{
          backgroundColor: selected ? colors.primary : colors["bg-300"],
        }}
      >
        <Text style={{ color: selected ? colors.white : colors["bg-text"] }}>
          {v}
        </Text>
      </Pressable>
    );
  }

  function NutrientRow({
    label,
    value,
    unit,
  }: {
    label: string;
    value: number | undefined;
    unit: string;
  }) {
    if (value === undefined) return null;

    return (
      <View className="flex-row justify-between py-2 border-b border-gray-700">
        <Text style={{ color: colors["bg-text"] }}>{label}</Text>
        <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
          {value}
          {unit}
        </Text>
      </View>
    );
  }

  const nutrients = calculateNutrients();

  return (
    <View className="flex-1" style={{ backgroundColor: colors["bg-200"] }}>
      <ScrollView>
        {/* Header */}
        <View className="mt-16 px-6">
          <Pressable onPress={onClose} className="mb-4">
            <ArrowLeftIcon size={30} color={colors["bg-text"]} />
          </Pressable>

          {/* Product Image */}
          {product.imageUrl && (
            <View className="items-center mb-4">
              <Image
                source={{ uri: product.imageUrl }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 12,
                  backgroundColor: colors["bg-100"],
                }}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Product Name & Brand */}
          <Text
            className="text-2xl font-bold mb-1"
            style={{ color: colors["bg-text"] }}
          >
            {product.name}
          </Text>
          {product.brand && (
            <Text
              className="text-lg mb-2"
              style={{ color: colors["bg-text-muted"] }}
            >
              {product.brand}
            </Text>
          )}

          {/* Source Badge */}
          <View className="flex-row items-center mb-4">
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="text-xs text-white">
                {product.source === "openfoodfacts"
                  ? "Open Food Facts"
                  : "USDA Database"}
              </Text>
            </View>
          </View>

          {/* Serving Size Input */}
          <View
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: colors["bg-100"] }}
          >
            <Text
              className="text-sm mb-2"
              style={{ color: colors["bg-text-muted"] }}
            >
              Serving Size {product.isLiquid ? "(Liquid)" : ""}
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                value={servingQty}
                onChangeText={setServingQty}
                keyboardType="numeric"
                className="flex-1 px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: colors["bg-200"],
                  color: colors["bg-text"],
                }}
                placeholder="100"
                placeholderTextColor={colors["bg-text-muted"]}
              />
              <TextInput
                value={servingUnit}
                onChangeText={setServingUnit}
                className="w-20 px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: colors["bg-200"],
                  color: colors["bg-text"],
                }}
                placeholder={product.isLiquid ? "ml" : "g"}
                placeholderTextColor={colors["bg-text-muted"]}
              />
            </View>
            {product.servingSizeText && (
              <Text
                className="text-xs mt-2"
                style={{ color: colors["bg-text-muted"] }}
              >
                Suggested: {product.servingSizeText}
              </Text>
            )}
            {product.isLiquid && (
              <Text className="text-xs mt-1" style={{ color: colors.primary }}>
                💧 Beverage detected - using ml for serving size
              </Text>
            )}
          </View>

          {/* Meal Selection */}
          <View className="mb-4">
            <Text
              className="text-sm mb-2"
              style={{ color: colors["bg-text-muted"] }}
            >
              Meal
            </Text>
            <View className="flex-row flex-wrap">
              <MealChoice v="breakfast" />
              <MealChoice v="lunch" />
              <MealChoice v="dinner" />
              <MealChoice v="snack" />
            </View>
          </View>

          {/* Main Macros */}
          <View
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: colors["bg-100"] }}
          >
            <Text
              className="text-lg font-bold mb-3"
              style={{ color: colors["bg-text"] }}
            >
              Nutrition Facts {hasNoNutrition && "(Enter Values)"}
            </Text>

            {hasNoNutrition && (
              <View
                className="p-2 mb-3 rounded-lg"
                style={{ backgroundColor: colors["bg-300"] }}
              >
                <Text
                  className="text-xs"
                  style={{ color: colors["bg-text-muted"] }}
                >
                  ⚠️ No nutrition data in database. Please enter values per{" "}
                  {product.isLiquid ? "100ml" : "100g"}.
                </Text>
              </View>
            )}

            {hasNoNutrition ? (
              <>
                {/* Editable Calories */}
                <View className="flex-row justify-between items-center py-2 border-b-2 border-gray-700">
                  <Text
                    className="font-semibold text-base"
                    style={{ color: colors["bg-text"] }}
                  >
                    Calories (per 100{product.isLiquid ? "ml" : "g"})
                  </Text>
                  <View className="flex-row items-center">
                    <TextInput
                      value={editableCalories}
                      onChangeText={setEditableCalories}
                      keyboardType="numeric"
                      className="px-3 py-1 rounded w-20 text-right"
                      style={{
                        backgroundColor: colors["bg-200"],
                        color: colors.primary,
                        fontWeight: "bold",
                      }}
                      placeholder="0"
                    />
                    <Text
                      className="ml-1 font-bold"
                      style={{ color: colors.primary }}
                    >
                      kcal
                    </Text>
                  </View>
                </View>

                {/* Editable Protein */}
                <View className="flex-row justify-between items-center py-2 border-b border-gray-700">
                  <Text style={{ color: colors["bg-text"] }}>Protein</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      value={editableProtein}
                      onChangeText={setEditableProtein}
                      keyboardType="numeric"
                      className="px-3 py-1 rounded w-20 text-right"
                      style={{
                        backgroundColor: colors["bg-200"],
                        color: colors["bg-text"],
                        fontWeight: "600",
                      }}
                      placeholder="0"
                    />
                    <Text
                      className="ml-1"
                      style={{ color: colors["bg-text"], fontWeight: "600" }}
                    >
                      g
                    </Text>
                  </View>
                </View>

                {/* Editable Carbs */}
                <View className="flex-row justify-between items-center py-2 border-b border-gray-700">
                  <Text style={{ color: colors["bg-text"] }}>
                    Carbohydrates
                  </Text>
                  <View className="flex-row items-center">
                    <TextInput
                      value={editableCarbs}
                      onChangeText={setEditableCarbs}
                      keyboardType="numeric"
                      className="px-3 py-1 rounded w-20 text-right"
                      style={{
                        backgroundColor: colors["bg-200"],
                        color: colors["bg-text"],
                        fontWeight: "600",
                      }}
                      placeholder="0"
                    />
                    <Text
                      className="ml-1"
                      style={{ color: colors["bg-text"], fontWeight: "600" }}
                    >
                      g
                    </Text>
                  </View>
                </View>

                {/* Editable Fat */}
                <View className="flex-row justify-between items-center py-2">
                  <Text style={{ color: colors["bg-text"] }}>Fat</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      value={editableFat}
                      onChangeText={setEditableFat}
                      keyboardType="numeric"
                      className="px-3 py-1 rounded w-20 text-right"
                      style={{
                        backgroundColor: colors["bg-200"],
                        color: colors["bg-text"],
                        fontWeight: "600",
                      }}
                      placeholder="0"
                    />
                    <Text
                      className="ml-1"
                      style={{ color: colors["bg-text"], fontWeight: "600" }}
                    >
                      g
                    </Text>
                  </View>
                </View>

                {/* Show calculated values for current serving */}
                <View
                  className="mt-3 p-2 rounded-lg"
                  style={{ backgroundColor: colors["bg-300"] }}
                >
                  <Text
                    className="text-xs mb-1"
                    style={{ color: colors["bg-text-muted"] }}
                  >
                    For your {servingQty}
                    {servingUnit} serving:
                  </Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {nutrients.calories} kcal • P: {nutrients.protein}g • C:{" "}
                    {nutrients.carbs}g • F: {nutrients.fat}g
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row justify-between py-2 border-b-2 border-gray-700">
                  <Text
                    className="font-semibold text-base"
                    style={{ color: colors["bg-text"] }}
                  >
                    Calories
                  </Text>
                  <Text
                    className="font-bold text-base"
                    style={{ color: colors.primary }}
                  >
                    {nutrients.calories} kcal
                  </Text>
                </View>
                <NutrientRow
                  label="Protein"
                  value={nutrients.protein}
                  unit="g"
                />
                <NutrientRow
                  label="Carbohydrates"
                  value={nutrients.carbs}
                  unit="g"
                />
                <NutrientRow label="Fat" value={nutrients.fat} unit="g" />
              </>
            )}
          </View>

          {/* Additional Nutrients */}
          {(nutrients.fiber ||
            nutrients.sugar ||
            nutrients.sodium ||
            nutrients.saturatedFat ||
            nutrients.cholesterol) && (
            <View
              className="p-4 rounded-xl mb-4"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <Text
                className="text-lg font-bold mb-3"
                style={{ color: colors["bg-text"] }}
              >
                Additional Info
              </Text>
              <NutrientRow label="Fiber" value={nutrients.fiber} unit="g" />
              <NutrientRow label="Sugar" value={nutrients.sugar} unit="g" />
              <NutrientRow
                label="Saturated Fat"
                value={nutrients.saturatedFat}
                unit="g"
              />
              <NutrientRow label="Sodium" value={nutrients.sodium} unit="mg" />
              <NutrientRow
                label="Cholesterol"
                value={nutrients.cholesterol}
                unit="mg"
              />
            </View>
          )}

          {/* Per 100g/100ml Reference */}
          {!hasNoNutrition && (
            <View
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: colors["bg-300"] }}
            >
              <Text
                className="text-xs"
                style={{ color: colors["bg-text-muted"] }}
              >
                Per {product.isLiquid ? "100ml" : "100g"}:{" "}
                {Math.round(product.caloriesPer100g)} kcal • P:{" "}
                {product.proteinPer100g.toFixed(1)}g • C:{" "}
                {product.carbsPer100g.toFixed(1)}g • F:{" "}
                {product.fatPer100g.toFixed(1)}g
              </Text>
            </View>
          )}

          {/* Add Button */}
          <Pressable
            onPress={handleAddToLog}
            className="py-4 rounded-xl mb-8 flex-row items-center justify-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Check size={20} color={colors.white} />
            <Text className="text-white text-lg font-bold">Add to Log</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
