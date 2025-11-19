import { Platform, ViewStyle } from "react-native";

export type ShadowSize = "sm" | "md" | "lg" | "xl";

interface ShadowConfig {
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const shadowConfigs: Record<ShadowSize, ShadowConfig> = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

/**
 * Returns platform-specific shadow styles
 * @param size - Shadow size: sm, md, lg, or xl
 * @param shadowColor - Color for the shadow (iOS only, Android uses elevation)
 * @returns ViewStyle with shadow properties
 */
export function getShadowStyle(
  size: ShadowSize = "md",
  shadowColor: string = "#000"
): ViewStyle {
  const config = shadowConfigs[size];

  return Platform.select({
    ios: {
      shadowColor,
      shadowOffset: config.shadowOffset,
      shadowOpacity: config.shadowOpacity,
      shadowRadius: config.shadowRadius,
    },
    android: {
      elevation: config.elevation,
    },
    default: {
      shadowColor,
      shadowOffset: config.shadowOffset,
      shadowOpacity: config.shadowOpacity,
      shadowRadius: config.shadowRadius,
      elevation: config.elevation,
    },
  }) as ViewStyle;
}
