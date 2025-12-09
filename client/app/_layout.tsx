import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "../lib/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="welcome"
      >
        {/* Auth / Entry flow */}
        <Stack.Screen name="splash" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="request-membership" />

        {/* Main app */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout-day" />
        <Stack.Screen name="new-program" />
        <Stack.Screen name="new-program-builder" />
        <Stack.Screen name="program-details" />
        <Stack.Screen name="exercise-details" />
        <Stack.Screen name="meal-details" />
        <Stack.Screen name="add-progress-entry" />
        <Stack.Screen name="progress-photos" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="membership-details" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="payments" />
        <Stack.Screen name="requests-messages" />
        <Stack.Screen name="modal" />
        <Stack.Screen name="scan-qr" />
      </Stack>
    </UserProvider>
  );
}
