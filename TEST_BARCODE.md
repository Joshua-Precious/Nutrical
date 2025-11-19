# Barcode Scanner Testing Guide

## How to Debug

Now that I've added logging, when you scan a barcode, you'll see detailed logs in your dev console showing:

1. **What API is being called** (Open Food Facts first, then USDA)
2. **What data was found** (product name, categories, nutrients)
3. **Whether liquid was detected**
4. **What serving size/unit was set**

## Testing Steps

### 1. Open Your App in Development Mode

Make sure you're running in development mode so you can see console logs.

### 2. Scan a Pepsi Barcode

When you scan a Pepsi bottle, check the console output. You should see something like:

```
Open Food Facts Product: {
  name: "Pepsi",
  brand: "PepsiCo",
  categories: ["en:beverages", "en:carbonated-drinks", ...],
  quantity: "330 ml",
  serving_quantity: 330,
  serving_quantity_unit: "ml",
  nutriments: { energy-kcal_100g: 42, proteins_100g: 0, ... }
}
```

### 3. Check What Happens

**If you see "Product found but no nutritional data available":**

- The product exists in the database but has incomplete nutrition info
- The app will try the USDA database next
- If USDA also has no data, you'll get "Product Not Found" alert

**If you see "Open Food Facts: Returning product":**

- Great! The product was found with nutrition data
- Check the `isLiquid` value - should be `true` for Pepsi
- Check the `servingUnit` - should be `ml` for liquids

### 4. Common Pepsi Barcodes to Test

Try scanning these barcodes or search for them manually:

- **Pepsi 330ml Can**: `5449000054227` (UK)
- **Pepsi 500ml Bottle**: `5449000000996` (UK)
- **Pepsi 2L Bottle**: `0012000003066` (US)
- **Diet Pepsi**: `0012000002113` (US)

## What I Fixed

### Added Detection for:

1. **Product quantity parsing** - Now extracts volume from "330 ml", "1.5 l", etc.
2. **Better liquid keywords** - Added pepsi, cola, soda detection
3. **Nutritional data validation** - Skips products with no nutrition info
4. **Multiple calorie field checks** - Looks for energy-kcal_100g, energy_100g, energy-kcal
5. **Better logging** - Shows exactly what data is found and why it failed

### The Flow:

```
1. Scan barcode
   ↓
2. Try Open Food Facts
   - Product found? ✓
   - Has nutrition data? → Check all fields
   - Is liquid? → Detect from name/categories/quantity
   - Convert to ml if needed
   ↓
3. If OFF fails → Try USDA
   - Same checks
   ↓
4. If both fail → Show helpful error message
```

## If It Still Doesn't Work

Share with me:

1. **The barcode number** you scanned
2. **The console output** (copy the logs)
3. **What error message** you saw

I can then test that specific barcode and see what's being returned from the APIs.

## Manual Testing URLs

You can test the APIs directly in your browser:

**Open Food Facts:**

```
https://world.openfoodfacts.org/api/v2/product/5449000054227.json
```

**USDA (need to use curl/Postman):**

```
https://api.nal.usda.gov/fdc/v1/foods/search?api_key=BHZPJt4Xl7F7WCzCOq1Z2nbq4hlzDp8PIPKXzLRg&query=5449000054227&dataType=Branded
```

Replace `5449000054227` with your barcode number.
