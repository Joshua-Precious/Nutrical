# Quick Start: Barcode Scanner Setup

## Step 1: Verify Dependencies

All required packages are already installed:

- ✅ `expo-barcode-scanner@^13.0.1`
- ✅ `expo-camera@~17.0.9`

## Step 2: Rebuild the App

Since we've added camera permissions, you need to rebuild the native app:

### For Android:

```bash
npx expo run:android
```

### For iOS:

```bash
npx expo run:ios
```

**Important**: The camera features won't work in Expo Go. You must use a development build.

## Step 3: Test the Feature

1. Launch the app on your device
2. Navigate to the home screen
3. Tap the "+" button or navigate to "Add Food"
4. Tap the "Scan Barcode" button
5. Grant camera permission when prompted
6. Point the camera at a product barcode
7. The barcode will be automatically detected and searched

## Testing Tips

- Use good lighting for best results
- Position the barcode clearly within the scanning frame
- Try common household items with barcodes
- If a product isn't found in the USDA database, you can create a custom food

## Troubleshooting

### Camera permission denied

- Go to device Settings → Apps → Nutrical → Permissions → Camera
- Enable camera permission

### Barcode not scanning

- Ensure good lighting
- Make sure barcode is not damaged or dirty
- Hold device steady

### No results found

- Not all products are in the USDA database
- Try searching manually by name
- Create a custom food as an alternative

## Features Included

✅ Camera permission handling
✅ Visual scanning frame with corner guides
✅ Automatic barcode detection
✅ USDA database search integration
✅ Error handling and user feedback
✅ Support for multiple barcode formats (UPC, EAN, QR, etc.)

## Next Steps

You can enhance this feature by:

- Adding more food databases (Open Food Facts API)
- Implementing offline barcode cache
- Adding manual barcode entry
- Showing scanning history
