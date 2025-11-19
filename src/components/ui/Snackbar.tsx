import { useAppTheme } from "@/src/hooks/useAppTheme";
import { getShadowStyle } from "@/src/utils/shadows";
import { useCallback, useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Snackbar({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 5000,
}: SnackbarProps) {
  const { colors } = useAppTheme();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, { damping: 20, stiffness: 300 });
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      onDismiss();
    }, 300);
  }, [translateY, opacity, onDismiss]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withSpring(100, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, handleDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 24,
          left: 16,
          right: 16,
          backgroundColor: colors["bg-100"],
          borderRadius: 12,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          ...getShadowStyle("lg", colors.black),
          zIndex: 9999,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          color: colors["bg-text"],
          fontSize: 14,
          flex: 1,
          marginRight: actionLabel ? 12 : 0,
        }}
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={() => {
            onAction();
            handleDismiss();
          }}
        >
          <Text
            style={{
              color: colors.accent,
              fontSize: 14,
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
