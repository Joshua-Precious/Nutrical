import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  className?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color,
  height = 12,
  className = "",
  style,
  animated = true,
}: ProgressBarProps) {
  const { colors } = useAppTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      width.value = withSpring(Math.min(1, Math.max(0, progress)) * 100, {
        damping: 20,
        stiffness: 100,
      });
    } else {
      width.value = Math.min(1, Math.max(0, progress)) * 100;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={[{ height, backgroundColor: colors["bg-300"] }, style]}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[animatedStyle, { backgroundColor: color || colors.primary }]}
      />
    </View>
  );
}
