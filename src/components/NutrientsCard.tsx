import { Card } from "@/src/components/ui";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Text, TextInput, View } from "react-native";

interface NutrientRowProps {
  label: string;
  value: number | undefined;
  unit: string;
  editable?: boolean;
  onValueChange?: (value: string) => void;
}

function NutrientRow({
  label,
  value,
  unit,
  editable,
  onValueChange,
}: NutrientRowProps) {
  const { colors } = useAppTheme();

  if (value === undefined && !editable) return null;

  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-700">
      <Text style={{ color: colors["bg-text"] }}>{label}</Text>
      {editable && onValueChange ? (
        <View className="flex-row items-center">
          <TextInput
            value={value?.toString() ?? "0"}
            onChangeText={onValueChange}
            keyboardType="numeric"
            className="px-3 py-1 rounded w-20 text-right"
            style={{
              backgroundColor: colors["bg-200"],
              color: colors["bg-text"],
              fontWeight: "600",
            }}
            placeholder="0"
            accessibilityLabel={`${label} input`}
          />
          <Text
            className="ml-1"
            style={{ color: colors["bg-text"], fontWeight: "600" }}
          >
            {unit}
          </Text>
        </View>
      ) : (
        <Text style={{ color: colors["bg-text"], fontWeight: "600" }}>
          {value}
          {unit}
        </Text>
      )}
    </View>
  );
}

interface MacroRowProps {
  label: string;
  value: number;
  unit: string;
  isPrimary?: boolean;
  editable?: boolean;
  onValueChange?: (value: string) => void;
}

function MacroRow({
  label,
  value,
  unit,
  isPrimary,
  editable,
  onValueChange,
}: MacroRowProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={`flex-row justify-between items-center py-2 ${
        isPrimary ? "border-b-2" : "border-b"
      } border-gray-700`}
    >
      <Text
        className={`${isPrimary ? "font-semibold text-base" : ""}`}
        style={{ color: colors["bg-text"] }}
      >
        {label}
      </Text>
      {editable && onValueChange ? (
        <View className="flex-row items-center">
          <TextInput
            value={value.toString()}
            onChangeText={onValueChange}
            keyboardType="numeric"
            className="px-3 py-1 rounded w-20 text-right"
            style={{
              backgroundColor: colors["bg-200"],
              color: isPrimary ? colors.primary : colors["bg-text"],
              fontWeight: isPrimary ? "bold" : "600",
            }}
            placeholder="0"
            accessibilityLabel={`${label} input`}
          />
          <Text
            className={`ml-1 ${isPrimary ? "font-bold" : ""}`}
            style={{ color: isPrimary ? colors.primary : colors["bg-text"] }}
          >
            {unit}
          </Text>
        </View>
      ) : (
        <Text
          className={`${isPrimary ? "font-bold text-base" : ""}`}
          style={{ color: isPrimary ? colors.primary : colors["bg-text"] }}
        >
          {value}
          {unit}
        </Text>
      )}
    </View>
  );
}

interface NutrientsCardProps {
  title?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  saturatedFat?: number;
  cholesterol?: number;
  editable?: boolean;
  onCaloriesChange?: (value: string) => void;
  onProteinChange?: (value: string) => void;
  onCarbsChange?: (value: string) => void;
  onFatChange?: (value: string) => void;
  warningMessage?: string;
  previewMessage?: string;
}

export function NutrientsCard({
  title = "Nutrition Facts",
  calories,
  protein,
  carbs,
  fat,
  fiber,
  sugar,
  sodium,
  saturatedFat,
  cholesterol,
  editable = false,
  onCaloriesChange,
  onProteinChange,
  onCarbsChange,
  onFatChange,
  warningMessage,
  previewMessage,
}: NutrientsCardProps) {
  const { colors } = useAppTheme();

  const hasAdditionalNutrients =
    fiber !== undefined ||
    sugar !== undefined ||
    sodium !== undefined ||
    saturatedFat !== undefined ||
    cholesterol !== undefined;

  return (
    <>
      {/* Main Macros Card */}
      <Card className="mb-4">
        <Text
          className="text-lg font-bold mb-3"
          style={{ color: colors["bg-text"] }}
        >
          {title}
        </Text>

        {warningMessage && (
          <View
            className="p-2 mb-3 rounded-lg"
            style={{ backgroundColor: colors["bg-300"] }}
          >
            <Text
              className="text-xs"
              style={{ color: colors["bg-text-muted"] }}
            >
              {warningMessage}
            </Text>
          </View>
        )}

        <MacroRow
          label="Calories"
          value={Math.round(calories)}
          unit=" kcal"
          isPrimary
          editable={editable}
          onValueChange={onCaloriesChange}
        />
        <MacroRow
          label="Protein"
          value={Math.round(protein)}
          unit="g"
          editable={editable}
          onValueChange={onProteinChange}
        />
        <MacroRow
          label="Carbohydrates"
          value={Math.round(carbs)}
          unit="g"
          editable={editable}
          onValueChange={onCarbsChange}
        />
        <MacroRow
          label="Fat"
          value={Math.round(fat)}
          unit="g"
          editable={editable}
          onValueChange={onFatChange}
        />

        {previewMessage && (
          <View
            className="mt-3 p-2 rounded-lg"
            style={{ backgroundColor: colors["bg-300"] }}
          >
            <Text
              className="text-xs mb-1"
              style={{ color: colors["bg-text-muted"] }}
            >
              {previewMessage}
            </Text>
          </View>
        )}
      </Card>

      {/* Additional Nutrients Card */}
      {hasAdditionalNutrients && (
        <Card className="mb-4">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors["bg-text"] }}
          >
            Additional Info
          </Text>
          <NutrientRow label="Fiber" value={fiber} unit="g" />
          <NutrientRow label="Sugar" value={sugar} unit="g" />
          <NutrientRow label="Saturated Fat" value={saturatedFat} unit="g" />
          <NutrientRow label="Sodium" value={sodium} unit="mg" />
          <NutrientRow label="Cholesterol" value={cholesterol} unit="mg" />
        </Card>
      )}
    </>
  );
}
