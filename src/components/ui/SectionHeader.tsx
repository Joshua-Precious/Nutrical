import { useAppTheme } from "@/src/hooks/useAppTheme";
import { ReactNode } from "react";
import { Text, View, ViewStyle } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: ViewStyle;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({
  title,
  subtitle,
  emoji,
  icon,
  action,
  className = "",
  style,
  size = "md",
}: SectionHeaderProps) {
  const { colors } = useAppTheme();

  const getTitleSize = () => {
    switch (size) {
      case "sm":
        return "text-base";
      case "md":
        return "text-xl";
      case "lg":
        return "text-2xl";
      default:
        return "text-xl";
    }
  };

  const getSpacing = () => {
    switch (size) {
      case "sm":
        return "mb-2";
      case "md":
        return "mb-4";
      case "lg":
        return "mb-6";
      default:
        return "mb-4";
    }
  };

  return (
    <View className={`${getSpacing()} ${className}`} style={style}>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          {emoji && (
            <Text
              className="text-2xl mr-2"
              accessibilityLabel={`${emoji} emoji`}
            >
              {emoji}
            </Text>
          )}
          {icon && <View className="mr-2">{icon}</View>}
          <View className="flex-1">
            <Text
              className={`${getTitleSize()} font-bold`}
              style={{ color: colors["bg-text"] }}
              accessibilityRole="header"
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                className="text-sm mt-1"
                style={{ color: colors["bg-text-muted"] }}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {action && <View className="ml-3">{action}</View>}
      </View>
    </View>
  );
}
