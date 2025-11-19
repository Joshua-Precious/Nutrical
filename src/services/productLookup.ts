// Service for looking up detailed product information from multiple sources

export type DetailedProduct = {
  // Basic Info
  name: string;
  brand?: string;
  barcode: string;
  imageUrl?: string;

  // Serving Information
  servingSize?: number;
  servingUnit?: string;
  servingSizeText?: string;
  isLiquid?: boolean; // Indicates if the product is a liquid/beverage

  // Nutritional Information (per 100g/100ml for consistency)
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;

  // Additional Nutrients (per 100g/100ml)
  fiberPer100g?: number;
  sugarPer100g?: number;
  sodiumPer100g?: number; // in mg
  saturatedFatPer100g?: number;
  cholesterolPer100g?: number; // in mg

  // Source information
  source: "usda" | "openfoodfacts" | "unknown";
  sourceId?: string;
};

const USDA_API_KEY = "BHZPJt4Xl7F7WCzCOq1Z2nbq4hlzDp8PIPKXzLRg";

/**
 * Detect if a product is a liquid/beverage based on its name, category, or unit
 */
function isLiquidProduct(
  name: string,
  categories?: string[],
  unit?: string
): boolean {
  const liquidKeywords = [
    "drink",
    "beverage",
    "juice",
    "soda",
    "water",
    "milk",
    "coffee",
    "tea",
    "beer",
    "wine",
    "spirits",
    "liquor",
    "energy drink",
    "smoothie",
    "shake",
    "cola",
    "lemonade",
    "cocktail",
    "cider",
    "kombucha",
    "tonic",
    "cordial",
    "syrup",
    "sauce", // liquid sauces
    "oil", // cooking oils
    "vinegar",
    "broth",
    "stock",
    "soup", // liquid soups
    "yogurt",
    "kefir",
    "cream",
  ];

  const nameLower = name.toLowerCase();
  const hasLiquidKeyword = liquidKeywords.some((keyword) =>
    nameLower.includes(keyword)
  );

  const hasLiquidCategory = categories?.some((cat) => {
    const catLower = cat.toLowerCase();
    return (
      catLower.includes("beverage") ||
      catLower.includes("drink") ||
      catLower.includes("juice") ||
      catLower.includes("water") ||
      catLower.includes("milk") ||
      catLower.includes("dairy-drink") ||
      catLower.includes("soft-drink") ||
      catLower.includes("alcoholic")
    );
  });

  const hasLiquidUnit =
    unit?.toLowerCase().includes("ml") ||
    unit?.toLowerCase().includes("cl") ||
    unit?.toLowerCase().includes("fl oz") ||
    unit?.toLowerCase().includes("liter") ||
    unit?.toLowerCase().includes("litre");

  return hasLiquidKeyword || !!hasLiquidCategory || !!hasLiquidUnit;
}

/**
 * Convert serving size to appropriate unit for liquids
 */
function normalizeLiquidServing(
  servingSize: number,
  servingUnit: string,
  isLiquid: boolean
): { size: number; unit: string } {
  if (!isLiquid) {
    return { size: servingSize, unit: servingUnit };
  }

  const unitLower = servingUnit.toLowerCase();

  // If already in ml or cl, keep it
  if (unitLower.includes("ml") || unitLower.includes("cl")) {
    return { size: servingSize, unit: servingUnit };
  }

  // Convert grams to ml for liquids (assuming density ~1 g/ml for most beverages)
  if (unitLower.includes("g")) {
    return { size: servingSize, unit: "ml" };
  }

  // Convert liters to ml
  if (unitLower.includes("l") && !unitLower.includes("ml")) {
    return { size: servingSize * 1000, unit: "ml" };
  }

  // Default to ml for liquids
  return { size: servingSize, unit: "ml" };
}

/**
 * Lookup product details by barcode using multiple APIs
 * Tries Open Food Facts first (better barcode coverage), then USDA
 */
export async function lookupProductByBarcode(
  barcode: string
): Promise<DetailedProduct | null> {
  // Try Open Food Facts first (free, no API key needed, great barcode database)
  const offProduct = await lookupOpenFoodFacts(barcode);
  if (offProduct) return offProduct;

  // Fallback to USDA
  const usdaProduct = await lookupUSDA(barcode);
  if (usdaProduct) return usdaProduct;

  return null;
}

/**
 * Open Food Facts API - Best for barcode scanning
 * Free, no API key, extensive database, includes images
 */
async function lookupOpenFoodFacts(
  barcode: string
): Promise<DetailedProduct | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
    const response = await fetch(url);
    const data = await response.json();

    const p = data.product;

    // Get nutrients per 100g (OpenFoodFacts provides this)
    const nutrients = p.nutriments || {};

    // Check if we have minimal nutritional data
    const hasNutritionalData =
      nutrients["energy-kcal_100g"] ||
      nutrients["energy_100g"] ||
      nutrients.proteins_100g ||
      nutrients.carbohydrates_100g ||
      nutrients.fat_100g;

    if (!hasNutritionalData) {
      // Return partial product with flag indicating missing nutrition data
      // This allows user to see the product and manually add nutrition info
      const productQuantity = p.quantity || "";
      const categories = p.categories_tags || [];
      const productIsLiquid = isLiquidProduct(
        p.product_name || "",
        categories,
        p.serving_quantity_unit || productQuantity
      );

      let servingSize = 100;
      let servingUnit = productIsLiquid ? "ml" : "g";

      // Try to extract serving size from quantity field
      if (productQuantity) {
        const match = productQuantity.match(
          /(\d+(?:\.\d+)?)\s*(ml|cl|l|g|kg)/i
        );
        if (match) {
          const value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();

          if (unit === "l") {
            servingSize = value * 1000;
            servingUnit = "ml";
          } else if (unit === "cl") {
            servingSize = value * 10;
            servingUnit = "ml";
          } else if (unit === "kg") {
            servingSize = value * 1000;
            servingUnit = "g";
          } else {
            servingSize = value;
            servingUnit = unit;
          }
        }
      }

      return {
        name: p.product_name || p.product_name_en || "Unknown Product",
        brand: p.brands || undefined,
        barcode,
        imageUrl: p.image_url || p.image_front_url || undefined,
        isLiquid: productIsLiquid,
        servingSize,
        servingUnit,
        servingSizeText: p.serving_size || productQuantity || undefined,

        // Default nutrition values - user can edit
        caloriesPer100g: 0,
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 0,

        source: "openfoodfacts",
        sourceId: barcode,
      };
    }

    // Detect if product is a liquid
    const categories = p.categories_tags || [];
    const productQuantity = p.quantity || ""; // e.g., "330 ml", "1.5 l"
    const productIsLiquid = isLiquidProduct(
      p.product_name || "",
      categories,
      p.serving_quantity_unit || productQuantity
    );

    // Extract serving size info
    let servingSize = p.serving_quantity || 100;
    let servingUnit = p.serving_quantity_unit || "g";

    // Try to extract serving size from quantity field if not available
    if (!p.serving_quantity && productQuantity) {
      const match = productQuantity.match(/(\d+(?:\.\d+)?)\s*(ml|cl|l|g|kg)/i);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        if (unit === "l") {
          servingSize = value * 1000;
          servingUnit = "ml";
        } else if (unit === "cl") {
          servingSize = value * 10;
          servingUnit = "ml";
        } else if (unit === "kg") {
          servingSize = value * 1000;
          servingUnit = "g";
        } else {
          servingSize = value;
          servingUnit = unit;
        }
      }
    }

    // Normalize liquid serving sizes
    if (productIsLiquid) {
      const normalized = normalizeLiquidServing(servingSize, servingUnit, true);
      servingSize = normalized.size;
      servingUnit = normalized.unit;
    }

    // Calculate calories with proper fallback
    let calories = 0;
    if (nutrients["energy-kcal_100g"]) {
      calories = nutrients["energy-kcal_100g"];
    } else if (nutrients["energy_100g"]) {
      calories = nutrients["energy_100g"] / 4.184; // Convert kJ to kcal
    } else if (nutrients["energy-kcal"]) {
      calories = nutrients["energy-kcal"]; // Sometimes it's not per 100g
    }

    return {
      name: p.product_name || p.product_name_en || "Unknown Product",
      brand: p.brands || undefined,
      barcode,
      imageUrl: p.image_url || p.image_front_url || undefined,
      isLiquid: productIsLiquid,

      servingSize,
      servingUnit,
      servingSizeText: p.serving_size || productQuantity || undefined,

      // Nutritional values per 100g
      caloriesPer100g: calories,
      proteinPer100g: nutrients.proteins_100g || 0,
      carbsPer100g: nutrients.carbohydrates_100g || 0,
      fatPer100g: nutrients.fat_100g || 0,

      // Additional nutrients
      fiberPer100g: nutrients.fiber_100g || undefined,
      sugarPer100g: nutrients.sugars_100g || undefined,
      sodiumPer100g: nutrients.sodium_100g
        ? nutrients.sodium_100g * 1000
        : undefined, // Convert g to mg
      saturatedFatPer100g: nutrients["saturated-fat_100g"] || undefined,
      cholesterolPer100g: nutrients.cholesterol_100g
        ? nutrients.cholesterol_100g * 1000
        : undefined,

      source: "openfoodfacts",
      sourceId: barcode,
    };
  } catch (error) {
    console.error("Open Food Facts lookup failed:", error);
    return null;
  }
}

/**
 * USDA FoodData Central API - Good fallback
 */
async function lookupUSDA(barcode: string): Promise<DetailedProduct | null> {
  try {
    // Search for product by barcode/GTIN
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(barcode)}&dataType=Branded&pageSize=1`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json();

    if (!searchData.foods || searchData.foods.length === 0) {
      return null;
    }

    const food = searchData.foods[0];

    // Get detailed information
    const detailUrl = `https://api.nal.usda.gov/fdc/v1/food/${food.fdcId}?api_key=${USDA_API_KEY}`;
    const detailResp = await fetch(detailUrl);
    const detailData = await detailResp.json();

    // Extract nutrients
    const nutrients = detailData.foodNutrients || food.foodNutrients || [];

    const getNutrient = (names: string[]): number | undefined => {
      for (const name of names) {
        const nutrient = nutrients.find((n: any) =>
          n.nutrientName?.toLowerCase().includes(name.toLowerCase())
        );
        if (nutrient?.value) return nutrient.value;
      }
      return undefined;
    };

    // Detect if product is a liquid
    const productName = food.description || detailData.description || "";
    const foodCategory = detailData.foodCategory?.description || "";
    const productIsLiquid = isLiquidProduct(
      productName,
      [foodCategory],
      detailData.servingSizeUnit
    );

    // Get serving size from label or household serving
    let servingSize = detailData.servingSize || 100;
    let servingUnit = detailData.servingSizeUnit || "g";

    // Normalize liquid serving sizes
    if (productIsLiquid) {
      const normalized = normalizeLiquidServing(servingSize, servingUnit, true);
      servingSize = normalized.size;
      servingUnit = normalized.unit;
    }

    const calories = getNutrient(["energy", "calories"]) || 0;

    return {
      name: productName,
      brand:
        food.brandName || food.brandOwner || detailData.brandName || undefined,
      barcode,
      imageUrl: undefined, // USDA doesn't provide images
      isLiquid: productIsLiquid,

      servingSize,
      servingUnit,
      servingSizeText: detailData.householdServingFullText || undefined,

      // USDA provides per 100g values
      caloriesPer100g: calories,
      proteinPer100g: getNutrient(["protein"]) || 0,
      carbsPer100g: getNutrient(["carbohydrate"]) || 0,
      fatPer100g: getNutrient(["total lipid", "fat"]) || 0,

      // Additional nutrients
      fiberPer100g: getNutrient(["fiber", "dietary fiber"]),
      sugarPer100g: getNutrient(["sugars", "total sugars"]),
      sodiumPer100g: getNutrient(["sodium"]),
      saturatedFatPer100g: getNutrient([
        "saturated",
        "fatty acids, total saturated",
      ]),
      cholesterolPer100g: getNutrient(["cholesterol"]),

      source: "usda",
      sourceId: detailData.fdcId?.toString(),
    };
  } catch (error) {
    console.error("USDA lookup failed:", error);
    return null;
  }
}
