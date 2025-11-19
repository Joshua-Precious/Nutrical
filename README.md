# NutriCal 🥗

A comprehensive calorie and nutrition tracking app built with React Native and Expo.

## ✨ Features

### 🍽️ Manual Food Entry

- **Extensive Food Database** - Search thousands of foods via OpenFoodFacts API
- **Custom Food Creation** - Add your own foods with complete nutrition details
- **Recipe Builder** - Create recipes with multiple ingredients and automatic nutrition calculation
- **My Foods Library** - Manage all your custom foods and recipes in one place

### 📊 Daily Calorie Tracking

- **Visual Progress Bars** - Main calorie bar plus individual macro progress bars
- **Meal Categorization** - Organize foods by Breakfast, Lunch, Dinner, and Snacks
- **Macronutrient Breakdown** - Track protein, carbs, and fat with color-coded progress
- **Real-time Updates** - All metrics update instantly as you log food

### 🎯 Goal Setting

- **Daily Calorie Targets** - Set custom targets or auto-calculate based on your profile
- **Weight Goals** - Track target weight with weekly change rates and time estimates
- **Custom Macro Ratios** - Personalize your protein/carbs/fat percentages
- **Smart Calculations** - Uses Mifflin-St Jeor equation for accurate BMR and TDEE

## 🚀 Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 📱 Usage

### Track Your First Meal

1. Open the app and complete onboarding (if first time)
2. Tap "Add Food" on the home screen
3. Search for a food or create a custom one
4. Select meal category (breakfast, lunch, dinner, or snack)
5. Enter serving size and log it

### Create a Recipe

1. Tap "Add Food" → "Build Recipe"
2. Name your recipe and set servings
3. Add ingredients with their quantities and nutrition
4. Save and reuse anytime

### Set Your Goals

1. Navigate to the Profile tab
2. Choose your goal (Lose/Maintain/Gain weight)
3. Set your daily calorie target
4. Define target weight and weekly change
5. Customize macro ratios or use defaults
6. Save and start tracking!

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **Zustand** - Lightweight state management
- **AsyncStorage** - Local data persistence
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based navigation
- **Lucide Icons** - Beautiful icon library

## 📁 Project Structure

```
nutrical/
├── src/
│   ├── app/               # Screens (file-based routing)
│   │   ├── (tabs)/        # Tab navigation screens
│   │   │   ├── index.tsx  # Home screen
│   │   │   ├── profile.tsx # Profile & goals
│   │   │   ├── history.tsx
│   │   │   └── analytics.tsx
│   │   └── food/          # Food-related screens
│   │       ├── search.tsx       # Search & browse foods
│   │       ├── create-custom.tsx # Create custom food
│   │       ├── recipe-builder.tsx # Build recipes
│   │       └── my-foods.tsx     # Manage foods/recipes
│   ├── stores/            # State management
│   │   ├── user.store.ts  # User profile & goals
│   │   ├── log.store.ts   # Food logs
│   │   └── food.store.ts  # Custom foods & recipes
│   ├── utils/             # Utility functions
│   │   ├── calorie.ts     # Calorie calculations
│   │   └── date.ts        # Date helpers
│   ├── hooks/             # Custom React hooks
│   ├── config/            # App configuration
│   └── styles/            # Global styles
└── assets/                # Images and resources
```

## 📚 Documentation

- **FEATURES.md** - Detailed feature documentation
- **QUICK_REFERENCE.md** - Developer reference guide
- **VISUAL_GUIDE.md** - UI mockups and patterns
- **TESTING.md** - Testing guide and checklist
- **IMPLEMENTATION_COMPLETE.md** - Implementation summary

## 🎨 Key Features in Detail

### Visual Progress Tracking

- Main calorie progress bar with percentage
- Color-coded macro bars (🟢 Protein, 🟠 Carbs, 🔴 Fat)
- Current vs target values for all metrics

### Meal Organization

- 🌅 Breakfast
- ☀️ Lunch
- 🌙 Dinner
- 🍿 Snacks
- Each category shows subtotal calories

### Smart Calculations

- BMR using Mifflin-St Jeor equation
- TDEE with activity level multipliers
- Goal-based calorie adjustments
- Macro gram targets from percentage ratios
- Time to reach weight goal estimates

## 🔐 Privacy

All data is stored locally on your device:

- No server uploads
- No user accounts required
- Complete privacy
- Works offline

## 🌟 Future Enhancements

Potential features for future development:

- Edit custom foods after creation
- Duplicate and modify recipes
- Favorite foods for quick access
- Weekly/monthly progress charts
- Food photos
- Barcode scanner
- Meal planning calendar
- Exercise tracking
- Water intake logging

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own needs!

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using React Native and Expo
