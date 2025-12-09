import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout-day" options={{ headerShown: false }} />
      <Stack.Screen name="new-program" options={{ headerShown: false }} />
      <Stack.Screen name="new-program-builder" options={{ headerShown: false }} />
      <Stack.Screen name="program-details" options={{ headerShown: false }} />
      <Stack.Screen name="exercise-details" options={{ headerShown: false }} />
      <Stack.Screen name="meal-details" options={{ headerShown: false }} />
      <Stack.Screen name="add-progress-entry" options={{ headerShown: false }} />
      <Stack.Screen name="progress-photos" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="membership-details" options={{ headerShown: false }} />
      <Stack.Screen name="attendance" options={{ headerShown: false }} />
      <Stack.Screen name="payments" options={{ headerShown: false }} />
      <Stack.Screen name="requests-messages" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
