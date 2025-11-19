import { useColorScheme } from "react-native";
import { appColors } from "../config/colors";
import { useCommonStore } from "../stores/common.store";

export const useAppTheme = () => {
  // Always call hooks in the same order
  const storeState = useCommonStore((state) => state);
  const systemTheme = useColorScheme();

  const { theme: storedTheme, setTheme } = storeState;
  const theme = storedTheme === "system" ? systemTheme : storedTheme;
  const effectiveTheme = (theme as "light" | "dark") || "light"; // Use 'light' as fallback when theme is null/undefined
  const colors = { ...appColors[effectiveTheme], ...appColors.global };

  return { colors, theme, setTheme };
};