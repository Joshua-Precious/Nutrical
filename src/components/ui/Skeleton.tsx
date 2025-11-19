import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { colors } = useAppTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors["bg-300"],
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: number | string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = "70%",
}: SkeletonTextProps) {
  return (
    <View className="gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : "100%"}
          height={16}
        />
      ))}
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View
      className="p-4 rounded-2xl mb-4"
      style={{ backgroundColor: "transparent" }}
    >
      <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={40} style={{ marginBottom: 8 }} />
      <SkeletonText lines={2} lastLineWidth="60%" />
    </View>
  );
}
