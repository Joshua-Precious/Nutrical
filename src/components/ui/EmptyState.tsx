import { useAppTheme } from "@/src/hooks/useAppTheme";
import { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View className="items-center justify-center py-12 px-6">
      {Icon && (
        <View
          className="mb-4 p-4 rounded-full"
          style={{ backgroundColor: colors["bg-200"] }}
        >
          <Icon size={40} color={colors["bg-text-muted"]} />
        </View>
      )}
      <Text
        className="text-xl font-bold text-center mb-2"
        style={{ color: colors["bg-text"] }}
      >
        {title}
      </Text>
      <Text
        className="text-center text-base mb-6"
        style={{ color: colors["bg-text-muted"] }}
      >
        {description}
      </Text>
      {action}
    </View>
  );
}
