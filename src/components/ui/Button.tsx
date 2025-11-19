import { useAppTheme } from "@/src/hooks/useAppTheme";
import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Pressable, PressableProps, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends Omit<PressableProps, "style"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: ViewStyle;
  textClassName?: string;
  haptic?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: "button" | "link" | "none";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  style,
  textClassName = "",
  haptic = true,
  onPress,
  accessibilityLabel,
  accessibilityRole = "button",
  ...props
}: ButtonProps) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = (e: any) => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors["bg-300"];
      case "accent":
        return colors.accent;
      case "ghost":
        return "transparent";
      case "danger":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === "secondary" || variant === "ghost") {
      return colors["bg-text"];
    }
    return colors.white;
  };

  const getPadding = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2";
      case "md":
        return "px-4 py-3";
      case "lg":
        return "px-6 py-4";
      default:
        return "px-4 py-3";
    }
  };

  return (
    <AnimatedPressable
      className={`rounded-xl items-center justify-center ${getPadding()} ${className}`}
      style={[
        animatedStyle,
        {
          backgroundColor: getBackgroundColor(),
          minHeight: 44,
          minWidth: 44,
        },
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={`font-semibold text-center ${textClassName}`}
          style={{ color: getTextColor() }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}
