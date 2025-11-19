import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
  ActivityLevel,
  Gender,
  Goal,
  useUserStore,
} from "@/src/stores/user.store";
import { calculateDailyCalorieTarget } from "@/src/utils/calorie";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type WeightGoalRate = 0.5 | 1 | 1.5 | 2;

interface OnboardingData {
  name: string;
  age: string;
  gender: Gender;
  heightFeet: string;
  heightInches: string;
  weightLbs: string;
  activityLevel: ActivityLevel;
  goal: Goal;
  weightGoalRate?: WeightGoalRate;
  targetWeight?: string;
}

export default function Onboarding() {
  const { colors } = useAppTheme();
  const setProfile = useUserStore((s) => s.setProfile);

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    gender: "male",
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    activityLevel: "moderate",
    goal: "maintain",
  });

  const totalSteps = 12;
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const goToNext = () => {
    if (currentStep === 5) {
      if (data.goal === "lose" || data.goal === "gain") {
        setCurrentStep(5.5);
      } else {
        setCurrentStep(6);
      }
    } else if (currentStep === 5.5) {
      setCurrentStep(6);
    } else if (currentStep === 12) {
      setCurrentStep(13);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep === 13) {
      setCurrentStep(12);
    } else if (
      currentStep === 6 &&
      (data.goal === "lose" || data.goal === "gain")
    ) {
      setCurrentStep(5.5);
    } else if (currentStep === 5.5) {
      setCurrentStep(5);
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const handleComplete = () => {
    const ageNum = parseInt(data.age);
    const heightInchesTotal =
      parseInt(data.heightFeet) * 12 + parseInt(data.heightInches);
    const heightCm = heightInchesTotal * 2.54;
    const weightNum = parseFloat(data.weightLbs);
    const weightKg = weightNum * 0.453592;

    const calorieTarget = calculateDailyCalorieTarget(
      data.gender,
      ageNum,
      heightCm,
      weightKg,
      data.activityLevel,
      data.goal
    );

    setProfile({
      age: ageNum,
      gender: data.gender,
      heightCm,
      weightKg,
      activityLevel: data.activityLevel,
      goal: data.goal,
      calorieTarget,
    });

    router.replace("/(tabs)");
  };

  const renderProgressBar = () => (
    <View className="px-6 pt-4 pb-2">
      <View
        className="h-2 rounded-full"
        style={{ backgroundColor: colors["bg-300"] }}
      >
        <View
          className="h-2 rounded-full"
          style={{
            backgroundColor: colors.primary,
            width: `${progressPercentage}%`,
          }}
        />
      </View>
      {currentStep < 13 && (
        <Text
          className="text-xs mt-1"
          style={{ color: colors["bg-text-muted"] }}
        >
          Step {currentStep === 5.5 ? 5 : currentStep} of {totalSteps}
        </Text>
      )}
    </View>
  );

  const renderWelcome = () => (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="text-5xl mb-4">👋</Text>
      <Text
        className="text-3xl font-bold mb-3 text-center"
        style={{ color: colors["bg-text"] }}
      >
        Welcome to SnapCal!
      </Text>
      <Text
        className="text-base text-center mb-8"
        style={{ color: colors["bg-text-muted"] }}
      >
        Let&apos;s personalize your nutrition journey. This takes about 2
        minutes.
      </Text>
      <Pressable
        onPress={goToNext}
        className="w-full p-4 rounded-lg items-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-white text-lg font-semibold">
          Let&apos;s Get Started
        </Text>
      </Pressable>
    </View>
  );

  const renderName = () => (
    <View className="flex-1 p-6">
      <Text
        className="text-2xl font-bold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        What should we call you?
      </Text>
      <Text className="text-sm mb-6" style={{ color: colors["bg-text-muted"] }}>
        We&apos;ll use this to personalize your experience
      </Text>
      <TextInput
        value={data.name}
        onChangeText={(text) => updateData({ name: text })}
        placeholder="Enter your first name"
        placeholderTextColor={colors["bg-text-muted"]}
        maxLength={50}
        className="p-4 rounded-lg text-lg"
        style={{
          backgroundColor: colors["bg-100"],
          color: colors["bg-text"],
        }}
      />
    </View>
  );

  const renderPersonalDetails = () => (
    <ScrollView className="flex-1 p-6">
      <Text
        className="text-2xl font-bold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Tell us about yourself
      </Text>
      <Text className="text-sm mb-6" style={{ color: colors["bg-text-muted"] }}>
        This helps us calculate your personalized calorie goals
      </Text>

      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Age
      </Text>
      <TextInput
        value={data.age}
        onChangeText={(text) => updateData({ age: text })}
        keyboardType="number-pad"
        placeholder="Age"
        placeholderTextColor={colors["bg-text-muted"]}
        className="p-3 rounded-lg mb-4"
        style={{
          backgroundColor: colors["bg-100"],
          color: colors["bg-text"],
        }}
      />

      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Gender
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ].map((item) => (
          <Pressable
            key={item.value}
            onPress={() => updateData({ gender: item.value as Gender })}
            className="p-3 rounded-lg flex-1 min-w-[45%]"
            style={{
              backgroundColor:
                data.gender === item.value
                  ? colors.primary + "20"
                  : colors["bg-300"],
            }}
          >
            <Text
              className="text-center font-medium"
              style={{
                color:
                  data.gender === item.value
                    ? colors.primary
                    : colors["bg-text"],
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Height
      </Text>
      <View className="flex-row gap-2 mb-4">
        <TextInput
          value={data.heightFeet}
          onChangeText={(text) => updateData({ heightFeet: text })}
          keyboardType="number-pad"
          placeholder="Feet"
          placeholderTextColor={colors["bg-text-muted"]}
          className="flex-1 p-3 rounded-lg"
          style={{
            backgroundColor: colors["bg-100"],
            color: colors["bg-text"],
          }}
        />
        <TextInput
          value={data.heightInches}
          onChangeText={(text) => updateData({ heightInches: text })}
          keyboardType="number-pad"
          placeholder="Inches"
          placeholderTextColor={colors["bg-text-muted"]}
          className="flex-1 p-3 rounded-lg"
          style={{
            backgroundColor: colors["bg-100"],
            color: colors["bg-text"],
          }}
        />
      </View>

      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Current Weight (lbs)
      </Text>
      <TextInput
        value={data.weightLbs}
        onChangeText={(text) => updateData({ weightLbs: text })}
        keyboardType="decimal-pad"
        placeholder="Weight in pounds"
        placeholderTextColor={colors["bg-text-muted"]}
        className="p-3 rounded-lg"
        style={{
          backgroundColor: colors["bg-100"],
          color: colors["bg-text"],
        }}
      />
    </ScrollView>
  );

  const renderActivityLevel = () => (
    <ScrollView className="flex-1 p-6">
      <Text
        className="text-2xl font-bold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        How active are you? 🏃
      </Text>
      <Text className="text-sm mb-6" style={{ color: colors["bg-text-muted"] }}>
        Your activity level affects how many calories you need daily
      </Text>

      <View className="gap-3">
        {[
          {
            value: "sedentary",
            emoji: "🛋️",
            label: "Sedentary",
            desc: "Little to no exercise, desk job",
          },
          {
            value: "light",
            emoji: "🚶",
            label: "Lightly Active",
            desc: "Light exercise 1-3 days/week",
          },
          {
            value: "moderate",
            emoji: "🏃",
            label: "Moderately Active",
            desc: "Moderate exercise 3-5 days/week",
          },
          {
            value: "active",
            emoji: "💪",
            label: "Very Active",
            desc: "Hard exercise 6-7 days/week",
          },
          {
            value: "very_active",
            emoji: "🏋️",
            label: "Extra Active",
            desc: "Very hard exercise daily + physical job",
          },
        ].map((item) => (
          <Pressable
            key={item.value}
            onPress={() =>
              updateData({ activityLevel: item.value as ActivityLevel })
            }
            className="p-4 rounded-xl"
            style={{
              backgroundColor:
                data.activityLevel === item.value
                  ? colors.primary + "20"
                  : colors["bg-300"],
            }}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">{item.emoji}</Text>
              <View className="flex-1">
                <Text
                  className="font-semibold text-base mb-1"
                  style={{
                    color:
                      data.activityLevel === item.value
                        ? colors.primary
                        : colors["bg-text"],
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors["bg-text-muted"] }}
                >
                  {item.desc}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  const renderGoal = () => (
    <ScrollView className="flex-1 p-6">
      <Text
        className="text-2xl font-bold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        What&apos;s your main goal? 🎯
      </Text>
      <Text className="text-sm mb-6" style={{ color: colors["bg-text-muted"] }}>
        Your goal determines your daily calorie target
      </Text>

      <View className="gap-3">
        {[
          {
            value: "lose",
            emoji: "🔻",
            label: "Lose Weight",
            desc: "Reduce body weight at a healthy pace",
          },
          {
            value: "maintain",
            emoji: "⚖️",
            label: "Maintain Weight",
            desc: "Keep your current weight stable",
          },
          {
            value: "gain",
            emoji: "🔺",
            label: "Gain Weight",
            desc: "Build muscle or increase body mass",
          },
        ].map((item) => (
          <Pressable
            key={item.value}
            onPress={() => updateData({ goal: item.value as Goal })}
            className="p-4 rounded-xl"
            style={{
              backgroundColor:
                data.goal === item.value
                  ? colors.primary + "20"
                  : colors["bg-300"],
            }}
          >
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{item.emoji}</Text>
              <View className="flex-1">
                <Text
                  className="font-semibold text-base mb-1"
                  style={{
                    color:
                      data.goal === item.value
                        ? colors.primary
                        : colors["bg-text"],
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors["bg-text-muted"] }}
                >
                  {item.desc}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  const renderWeightGoalDetails = () => (
    <ScrollView className="flex-1 p-6">
      <Text
        className="text-2xl font-bold mb-2"
        style={{ color: colors["bg-text"] }}
      >
        How much weight do you want to {data.goal === "lose" ? "lose" : "gain"}?
      </Text>
      <Text className="text-sm mb-6" style={{ color: colors["bg-text-muted"] }}>
        Safe weight {data.goal === "lose" ? "loss" : "gain"} is typically 0.5-2
        lbs per week
      </Text>

      <Text
        className="text-sm font-medium mb-3"
        style={{ color: colors["bg-text"] }}
      >
        Weekly Rate
      </Text>
      <View className="gap-3 mb-6">
        {[
          {
            value: 0.5,
            label: "0.5 lbs per week",
            badge: "",
            desc: "Gentle approach, easiest to maintain",
          },
          {
            value: 1,
            label: "1 lb per week",
            badge: "Most Popular",
            desc: "Balanced approach",
          },
          {
            value: 1.5,
            label: "1.5 lbs per week",
            badge: "",
            desc: "Challenging but achievable",
          },
          {
            value: 2,
            label: "2 lbs per week",
            badge: "",
            desc: "Requires strict adherence",
          },
        ].map((item) => (
          <Pressable
            key={item.value}
            onPress={() =>
              updateData({ weightGoalRate: item.value as WeightGoalRate })
            }
            className="p-4 rounded-xl"
            style={{
              backgroundColor:
                data.weightGoalRate === item.value
                  ? colors.primary + "20"
                  : colors["bg-300"],
            }}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className="font-semibold text-base"
                style={{
                  color:
                    data.weightGoalRate === item.value
                      ? colors.primary
                      : colors["bg-text"],
                }}
              >
                {item.label}
              </Text>
              {item.badge && (
                <View
                  className="px-2 py-1 rounded"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-xs font-semibold">
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="text-sm"
              style={{ color: colors["bg-text-muted"] }}
            >
              {item.desc}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors["bg-text"] }}
      >
        Target Weight (Optional)
      </Text>
      <TextInput
        value={data.targetWeight}
        onChangeText={(text) => updateData({ targetWeight: text })}
        keyboardType="decimal-pad"
        placeholder="Enter goal weight"
        placeholderTextColor={colors["bg-text-muted"]}
        className="p-3 rounded-lg"
        style={{
          backgroundColor: colors["bg-100"],
          color: colors["bg-text"],
        }}
      />
      <Text className="text-xs mt-1" style={{ color: colors["bg-text-muted"] }}>
        Optional - helps us estimate timeline
      </Text>
    </ScrollView>
  );

  const renderSkippableScreen = (title: string, emoji: string) => (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="text-5xl mb-4">{emoji}</Text>
      <Text
        className="text-2xl font-bold mb-3 text-center"
        style={{ color: colors["bg-text"] }}
      >
        {title}
      </Text>
      <Text
        className="text-base text-center mb-8"
        style={{ color: colors["bg-text-muted"] }}
      >
        This section can be configured later in settings
      </Text>
      <Pressable
        onPress={goToNext}
        className="w-full p-4 rounded-lg items-center mb-3"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-white text-lg font-semibold">Skip for Now</Text>
      </Pressable>
    </View>
  );

  const renderReview = () => {
    const ageNum = parseInt(data.age);
    const heightInchesTotal =
      parseInt(data.heightFeet) * 12 + parseInt(data.heightInches);
    const heightCm = heightInchesTotal * 2.54;
    const weightNum = parseFloat(data.weightLbs);
    const weightKg = weightNum * 0.453592;

    const calorieTarget = calculateDailyCalorieTarget(
      data.gender,
      ageNum,
      heightCm,
      weightKg,
      data.activityLevel,
      data.goal
    );

    const proteinCal = calorieTarget * 0.27;
    const carbsCal = calorieTarget * 0.44;
    const fatsCal = calorieTarget * 0.29;
    const proteinG = Math.round(proteinCal / 4);
    const carbsG = Math.round(carbsCal / 4);
    const fatsG = Math.round(fatsCal / 9);

    return (
      <ScrollView className="flex-1 p-6">
        <Text
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: colors["bg-text"] }}
        >
          Your Personalized Plan is Ready! 🎉
        </Text>
        <Text
          className="text-base mb-6 text-center"
          style={{ color: colors["bg-text-muted"] }}
        >
          Here&apos;s what we calculated for you
        </Text>

        <View
          className="p-4 rounded-xl mb-4"
          style={{ backgroundColor: colors["bg-300"] }}
        >
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors["bg-text"] }}
          >
            Your Profile
          </Text>
          <Text style={{ color: colors["bg-text-muted"] }}>
            👤 {data.name || "User"}
          </Text>
          <Text style={{ color: colors["bg-text-muted"] }}>
            📅 {data.age} years old
          </Text>
          <Text style={{ color: colors["bg-text-muted"] }}>
            📏 {data.heightFeet}&apos;{data.heightInches}&quot;
          </Text>
          <Text style={{ color: colors["bg-text-muted"] }}>
            ⚖️ {data.weightLbs} lbs
          </Text>
        </View>

        <View
          className="p-6 rounded-xl mb-4 items-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Text
            className="text-sm mb-1"
            style={{ color: colors["bg-text-muted"] }}
          >
            Daily Calorie Target
          </Text>
          <Text
            className="text-5xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            {Math.round(calorieTarget)}
          </Text>
          <Text style={{ color: colors["bg-text-muted"] }}>
            To {data.goal} weight
          </Text>
        </View>

        <View
          className="p-4 rounded-xl mb-6"
          style={{ backgroundColor: colors["bg-300"] }}
        >
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors["bg-text"] }}
          >
            Macronutrient Breakdown
          </Text>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors["bg-text"] }}>🍗 Protein</Text>
              <Text style={{ color: colors["bg-text"] }}>
                {proteinG}g (27%)
              </Text>
            </View>
            <View
              className="h-2 rounded-full"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <View
                className="h-2 rounded-full"
                style={{ backgroundColor: "#10B981", width: "27%" }}
              />
            </View>
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors["bg-text"] }}>🍞 Carbs</Text>
              <Text style={{ color: colors["bg-text"] }}>{carbsG}g (44%)</Text>
            </View>
            <View
              className="h-2 rounded-full"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <View
                className="h-2 rounded-full"
                style={{ backgroundColor: "#3B82F6", width: "44%" }}
              />
            </View>
          </View>

          <View>
            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors["bg-text"] }}>🥑 Fats</Text>
              <Text style={{ color: colors["bg-text"] }}>{fatsG}g (29%)</Text>
            </View>
            <View
              className="h-2 rounded-full"
              style={{ backgroundColor: colors["bg-100"] }}
            >
              <View
                className="h-2 rounded-full"
                style={{ backgroundColor: "#F97316", width: "29%" }}
              />
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleComplete}
          className="p-4 rounded-lg items-center mb-3"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-lg font-semibold">
            Start Tracking!
          </Text>
        </Pressable>

        <Pressable onPress={goToPrevious} className="items-center p-2">
          <Text style={{ color: colors["bg-text-muted"] }}>
            ✏️ Edit Details
          </Text>
        </Pressable>
      </ScrollView>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderWelcome();
      case 2:
        return renderName();
      case 3:
        return renderPersonalDetails();
      case 4:
        return renderActivityLevel();
      case 5:
        return renderGoal();
      case 5.5:
        return renderWeightGoalDetails();
      case 6:
        return renderSkippableScreen("Dietary Preferences", "🥗");
      case 7:
        return renderSkippableScreen("Food Allergies", "⚠️");
      case 8:
        return renderSkippableScreen("Eating Schedule", "🍽️");
      case 9:
        return renderSkippableScreen("Cooking Habits", "👨‍🍳");
      case 10:
        return renderSkippableScreen("Biggest Challenge", "💭");
      case 11:
        return renderSkippableScreen("Motivation", "💪");
      case 12:
        return renderSkippableScreen("Notifications", "🔔");
      case 13:
        return renderReview();
      default:
        return renderWelcome();
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return data.name.length >= 2;
      case 3:
        return (
          data.age !== "" &&
          data.heightFeet !== "" &&
          data.heightInches !== "" &&
          data.weightLbs !== ""
        );
      case 4:
        return true;
      case 5:
        return true;
      case 5.5:
        return data.weightGoalRate !== undefined;
      case 13:
        return false;
      default:
        return true;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors["bg-200"] }}>
      {currentStep > 1 && currentStep < 13 && renderProgressBar()}
      {renderStep()}
      {currentStep > 1 && currentStep < 13 && (
        <View className="p-6 gap-3">
          <Pressable
            onPress={goToNext}
            disabled={!canContinue()}
            className="p-4 rounded-lg items-center"
            style={{
              backgroundColor: canContinue()
                ? colors.primary
                : colors["bg-300"],
              opacity: canContinue() ? 1 : 0.5,
            }}
          >
            <Text className="text-white text-lg font-semibold">Continue</Text>
          </Pressable>
          {currentStep > 2 && (
            <Pressable onPress={goToPrevious} className="items-center p-2">
              <Text style={{ color: colors["bg-text-muted"] }}>← Back</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
