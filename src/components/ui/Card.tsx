import { useAppTheme } from "@/src/hooks/useAppTheme";
import { getShadowStyle, ShadowSize } from "@/src/utils/shadows";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  noPadding?: boolean;
  shadowSize?: ShadowSize;
}

export function Card({
  children,
  className = "",
  style,
  noPadding,
  shadowSize = "md",
}: CardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={`rounded-2xl ${noPadding ? "" : "p-5"} ${className}`}
      style={[
        {
          backgroundColor: colors["bg-100"],
          ...getShadowStyle(shadowSize, colors.black),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
