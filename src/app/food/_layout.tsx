import { Stack } from "expo-router";

export default function FoodLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="create-custom" options={{ headerShown: false }} />
      <Stack.Screen name="my-foods" options={{ headerShown: false }} />
    </Stack>
  );
}
