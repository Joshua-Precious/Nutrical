# Barcode Scanner Implementation

## Overview

This document describes the barcode scanning feature implemented in the Nutrical app using Expo's barcode scanner and camera APIs.

## Features Implemented

### 1. BarcodeScanner Component (`src/components/BarcodeScanner.tsx`)

A reusable modal component that provides:

- **Camera View**: Full-screen camera with barcode scanning capability
- **Visual Scanning Frame**: Corner guides to help users align barcodes
- **Supported Barcode Types**:
  - EAN-13 (most common for food products)
  - EAN-8
  - UPC-A (common in North America)
  - UPC-E
  - Code 128
  - Code 39
  - QR codes
- **User Feedback**: Visual confirmation when a barcode is scanned
- **Clean UI**: Header with close button and instructions

### 2. Integration in Food Search (`src/app/food/search.tsx`)

- **"Scan Barcode" Button**: Prominently displayed in the search screen
- **Camera Permission Handling**: Requests and checks permissions before opening scanner
- **Barcode Search**: Automatically searches USDA database using scanned barcode
- **Error Handling**: Alerts user if no product is found
- **Seamless Flow**: After scanning, results appear in the existing search interface

### 3. Configuration Updates (`app.json`)

- **iOS Camera Permission**: NSCameraUsageDescription added
- **Android Camera Permission**: CAMERA permission added
- **Expo Camera Plugin**: Configured with appropriate permission message

## How It Works

### User Flow

1. User navigates to "Add Food" screen
2. User taps "Scan Barcode" button
3. App requests camera permission (first time only)
4. Camera view opens with scanning frame
5. User positions barcode within the frame
6. Barcode is automatically detected and scanned
7. Scanner closes and searches USDA database
8. Results appear in the search list
9. User taps a result to log the food

### Technical Flow

```
User taps "Scan Barcode"
    ↓
Check camera permission
    ↓
Permission granted? → Yes → Open scanner modal
    ↓                  No → Request permission → Open scanner
Scanner detects barcode
    ↓
Call onBarcodeScanned with barcode data
    ↓
Close scanner modal
    ↓
Search USDA API with barcode (UPC/GTIN)
    ↓
Display results or show "not found" alert
```

## API Integration

### USDA FoodData Central API

The barcode scanner searches for products using the barcode as a query:

```typescript
https://api.nal.usda.gov/fdc/v1/foods/search
  ?api_key=${USDA_API_KEY}
  &query=${barcode}
  &dataType=Branded
```

**Note**: The USDA database primarily contains branded foods with UPC/EAN codes. Coverage may vary by region and product.

## Permissions Required

### iOS

- **Camera Permission**: Required for barcode scanning
- **Usage Description**: "Allow $(PRODUCT_NAME) to access your camera to scan product barcodes."

### Android

- **android.permission.CAMERA**: Required for camera access

## Testing

### On Device

1. Build the app: `npx expo run:android` or `npx expo run:ios`
2. Navigate to food search
3. Tap "Scan Barcode"
4. Grant camera permission when prompted
5. Scan a product barcode (try items from your pantry)
6. Verify results appear

### Common Test Barcodes

- Coca-Cola: 0049000050103
- Oreo Cookies: 0044000032227
- Lay's Chips: 0028400063005

## Limitations & Considerations

1. **Database Coverage**: Not all products are in the USDA database
2. **Internet Required**: Searches require an active internet connection
3. **Camera Quality**: Better cameras = better scanning performance
4. **Lighting**: Good lighting improves scan success rate
5. **Barcode Condition**: Damaged or dirty barcodes may not scan

## Future Enhancements

Potential improvements:

- Integrate additional food databases (Open Food Facts, etc.)
- Add manual barcode entry as fallback
- Cache scanned products locally
- Add haptic feedback on successful scan
- Support batch scanning for multiple items
- Add scanning history

## Dependencies

- `expo-camera@~17.0.9`: Provides camera functionality
- `expo-barcode-scanner@^13.0.1`: Barcode scanning capabilities
- `lucide-react-native`: Icons (ScanBarcode icon)

## Development Notes

### Building the App

After adding camera permissions, you need to rebuild the native app:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

**Important**: Expo Go app may have limited camera permissions. Test on a development build for full functionality.

### Debugging

- Check camera permissions in device settings
- Verify API key is valid
- Check network connectivity for API calls
- Use console logs to debug barcode data

## Support

For issues related to:

- **Camera not working**: Check permissions in device settings
- **Barcode not scanning**: Ensure good lighting and barcode is clear
- **No results found**: Try manual search or create custom food
- **Permission denied**: User must grant camera permission in settings
