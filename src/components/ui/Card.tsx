import { useAppTheme } from "@/src/hooks/useAppTheme";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({
  children,
  className = "",
  style,
  noPadding,
}: CardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={`rounded-2xl ${noPadding ? "" : "p-5"} ${className}`}
      style={[
        {
          backgroundColor: colors["bg-100"],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
