import { BarcodeScanner } from "@/src/components/BarcodeScanner";
import { ProductDetails } from "@/src/components/ProductDetails";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
  DetailedProduct,
  lookupProductByBarcode,
} from "@/src/services/productLookup";
import { useFoodStore } from "@/src/stores/food.store";
import { MealCategory, useLogStore } from "@/src/stores/log.store";
import { getTodayKey } from "@/src/utils/date";
import { useCameraPermissions } from "expo-camera";
import { Link, router } from "expo-router";
import { ArrowLeftIcon, Plus, ScanBarcode } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type FoodProduct = {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients?: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    value: number;
  }[];
};

type SearchTab = "database" | "custom";

const USDA_API_KEY = "BHZPJt4Xl7F7WCzCOq1Z2nbq4hlzDp8PIPKXzLRg";

export default function FoodSearch() {
  const { colors } = useAppTheme();
  const addLog = useLogStore((s) => s.addLog);
  const customFoods = useFoodStore((s) => s.customFoods);

  const [activeTab, setActiveTab] = useState<SearchTab>("database");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<FoodProduct[]>([]);
  const [servingQty, setServingQty] = useState<string>("100");
  const [servingUnit, setServingUnit] = useState<string>("g");
  const [meal, setMeal] = useState<MealCategory>("breakfast");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedProduct, setScannedProduct] = useState<DetailedProduct | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q || q.trim().length < 2) {
        setResults([]);
        return;
      }
      await searchFood(q);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  async function searchFood(query: string) {
    try {
      // USDA FoodData Central API - Branded Foods
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20&dataType=Branded,Survey (FNDDS)`;
      const resp = await fetch(url);
      const data = await resp.json();
      setResults(data?.foods ?? []);
    } catch {
      // ignore MVP
    }
  }

  async function searchByBarcode(barcode: string) {
    setIsLoading(true);
    try {
      console.log("Starting barcode search for:", barcode);

      // Use the new product lookup service
      const product = await lookupProductByBarcode(barcode);

      if (product) {
        console.log("Product found:", {
          name: product.name,
          brand: product.brand,
          isLiquid: product.isLiquid,
          servingUnit: product.servingUnit,
          calories: product.caloriesPer100g,
          source: product.source,
        });

        // Show detailed product view (even if nutrition data is missing)
        setScannedProduct(product);
      } else {
        console.log("No product found for barcode:", barcode);
        Alert.alert(
          "Product Not Found",
          `No product found with barcode: ${barcode}\n\nThe barcode wasn't found in:\n• Open Food Facts database\n• USDA database\n\nYou can create a custom food instead.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Barcode search error:", error);
      Alert.alert(
        "Search Error",
        "Failed to search for product. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenScanner() {
    if (!permission) {
      requestPermission();
      return;
    }

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission",
        "Camera permission is required to scan barcodes.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Grant Permission", onPress: () => requestPermission() },
        ]
      );
      return;
    }

    setScannerVisible(true);
  }

  function handleBarcodeScanned(barcode: string) {
    setScannerVisible(false);
    searchByBarcode(barcode);
  }

  function getNutrientValue(
    nutrients: FoodProduct["foodNutrients"],
    nutrientName: string
  ): number {
    if (!nutrients) return 0;
    const nutrient = nutrients.find((n) =>
      n.nutrientName.toLowerCase().includes(nutrientName.toLowerCase())
    );
    return nutrient?.value ?? 0;
  }

  function logItem(p: FoodProduct) {
    const qty = parseFloat(servingQty || "0") || 0;

    // Get nutritional values per 100g from USDA data
    const calories = getNutrientValue(p.foodNutrients, "energy");
    const protein = getNutrientValue(p.foodNutrients, "protein");
    const carbs = getNutrientValue(p.foodNutrients, "carbohydrate");
    const fat = getNutrientValue(p.foodNutrients, "fat");

    const factor = servingUnit.toLowerCase().includes("serv") ? 1 : qty / 100;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: getTodayKey(),
      meal,
      name: p.description || "Unknown",
      brand: p.brandName || p.brandOwner,
      servingQty: qty,
      servingUnit,
      calories: Math.max(0, Math.round((calories || 0) * factor)),
      protein: Math.max(0, Number(((protein || 0) * factor).toFixed(1))),
      carbs: Math.max(0, Number(((carbs || 0) * factor).toFixed(1))),
      fat: Math.max(0, Number(((fat || 0) * factor).toFixed(1))),
    };
    addLog(entry);
    router.back();
  }

  function logCustomFood(food: any) {
    const qty = parseFloat(servingQty || "0") || 0;
    const factor = qty / 100;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: getTodayKey(),
      meal,
      name: food.name,
      brand: food.brand,
      servingQty: qty,
      servingUnit,
      calories: Math.max(0, Math.round((food.caloriesPer100g || 0) * factor)),
      protein: Math.max(
        0,
        Number(((food.proteinPer100g || 0) * factor).toFixed(1))
      ),
      carbs: Math.max(
        0,
        Number(((food.carbsPer100g || 0) * factor).toFixed(1))
      ),
      fat: Math.max(0, Number(((food.fatPer100g || 0) * factor).toFixed(1))),
    };
    addLog(entry);
    router.back();
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

  const filteredCustomFoods = customFoods.filter((food) =>
    food.name.toLowerCase().includes(q.toLowerCase())
  );

  // Show product details if a product was scanned
  if (scannedProduct) {
    return (
      <ProductDetails
        product={scannedProduct}
        onClose={() => setScannedProduct(null)}
      />
    );
  }

  // Show loading overlay when searching by barcode
  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors["bg-200"] }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          className="mt-4 text-lg"
          style={{ color: colors["bg-text-muted"] }}
        >
          Looking up product...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors["bg-200"] }}>
      <View className="mt-16 px-6">
        <View className="flex flex-row gap-2">
          <Pressable onPress={() => router.back()}>
            <ArrowLeftIcon size={30} color={colors["bg-text"]} />
          </Pressable>

          <Text
            className="text-2xl font-bold mb-6"
            style={{ color: colors["bg-text"] }}
          >
            Add Food
          </Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row mb-3 gap-2">
          <Pressable
            onPress={() => setActiveTab("database")}
            className="flex-1 py-2 rounded-lg"
            style={{
              backgroundColor:
                activeTab === "database" ? colors.primary : colors["bg-100"],
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{
                color:
                  activeTab === "database" ? colors.white : colors["bg-text"],
              }}
            >
              Database
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("custom")}
            className="flex-1 py-2 rounded-lg"
            style={{
              backgroundColor:
                activeTab === "custom" ? colors.primary : colors["bg-100"],
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{
                color:
                  activeTab === "custom" ? colors.white : colors["bg-text"],
              }}
            >
              Custom ({customFoods.length})
            </Text>
          </Pressable>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={
            activeTab === "database"
              ? "Search foods (USDA Database)"
              : `Search ${activeTab}...`
          }
          placeholderTextColor={colors["bg-text-muted"]}
          className="px-4 py-3 rounded-xl mb-3"
          style={{
            backgroundColor: colors["bg-100"],
            color: colors["bg-text"],
          }}
        />

        <View className="flex-row mb-3"></View>

        <View className="mb-3 flex-row flex-wrap">
          <MealChoice v="breakfast" />
          <MealChoice v="lunch" />
          <MealChoice v="dinner" />
          <MealChoice v="snack" />
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-2 mb-3">
          <Pressable
            onPress={handleOpenScanner}
            className="flex-1 py-3 rounded-lg flex-row items-center justify-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <ScanBarcode size={20} color={colors.white} />
            <Text className="text-white font-semibold">Scan Barcode</Text>
          </Pressable>
          <Link href="/food/create-custom" asChild>
            <Pressable
              className="flex-1 py-3 rounded-lg flex-row items-center justify-center gap-2"
              style={{ backgroundColor: colors.accent }}
            >
              <Plus size={20} color={colors.white} />
              <Text className="text-white font-semibold">Create Custom</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Results based on active tab */}
      {activeTab === "database" && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.fdcId.toString()}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const kcal = getNutrientValue(item.foodNutrients, "energy");
            return (
              <Pressable
                onPress={() => logItem(item)}
                className="mb-3 p-4 rounded-xl"
                style={{ backgroundColor: colors["bg-100"] }}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors["bg-text"] }}
                >
                  {item.description || "Unnamed"}
                </Text>
                <Text style={{ color: colors["bg-text-muted"] }}>
                  {item.brandName || item.brandOwner
                    ? `${item.brandName || item.brandOwner} · `
                    : ""}
                  {kcal ? `${Math.round(kcal)} kcal/100g` : "No kcal data"}
                </Text>
              </Pressable>
            );
          }}
        />
      )}

      {activeTab === "custom" && (
        <FlatList
          data={filteredCustomFoods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
          ListEmptyComponent={
            <Text
              className="text-center mt-6"
              style={{ color: colors["bg-text-muted"] }}
            >
              No custom foods yet. Create one above!
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => logCustomFood(item)}
              className="mb-3 p-4 rounded-xl"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: colors["bg-text"] }}
              >
                {item.name}
              </Text>
              <Text style={{ color: colors["bg-text-muted"] }}>
                {item.brand ? `${item.brand} · ` : ""}
                {Math.round(item.caloriesPer100g)} kcal/100g
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
