import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { AttendanceProvider } from "../lib/AttendanceContext";
import { ProgramStoreProvider } from "../lib/ProgramStoreContext";
import { UserProvider, useAppUser } from "../lib/UserContext";

function RootLayoutNav() {
  const { user, loading } = useAppUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Redirect logic to enforce initial state if deep linking or refresh happens
    const inAuthGroup = segments[0] === "welcome" || segments[0] === "login";

    if (user && user.uid && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!user?.uid && segments[0] === "(tabs)") {
      router.replace("/welcome");
    }
  }, [user, loading, segments]);

  if (loading) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  const isLogged = !!user?.uid;

  // KEY TRICK: Changing the key forces the Stack to unmount and remount, clearing history.
  return (
    <Stack screenOptions={{ headerShown: false }} key={isLogged ? "auth" : "guest"}>
      {/* 
        IMPORTANT: No Fragments (<>...</>) allowed inside Stack!
        We list ALL screens and use 'redirect' to control access.
      */}

      {/* Public / Global */}
      <Stack.Screen name="splash" />
      <Stack.Screen name="modal" />

      {/* Auth Screens - Redirect to Tabs if logged in */}
      <Stack.Screen name="welcome" redirect={isLogged} />
      <Stack.Screen name="login" redirect={isLogged} />
      <Stack.Screen name="forgot-password" redirect={isLogged} />
      <Stack.Screen name="request-membership" redirect={isLogged} />

      {/* Protected App Screens - Redirect to Welcome if NOT logged in */}
      <Stack.Screen name="(tabs)" redirect={!isLogged} options={{ gestureEnabled: false }} />
      <Stack.Screen name="edit-profile" redirect={!isLogged} options={{ gestureEnabled: false }} />

      <Stack.Screen name="workout-day" redirect={!isLogged} />
      <Stack.Screen name="program-day-builder" redirect={!isLogged} />
      <Stack.Screen name="new-program" redirect={!isLogged} />
      <Stack.Screen name="new-program-builder" redirect={!isLogged} />
      <Stack.Screen name="program-details" redirect={!isLogged} />
      <Stack.Screen name="exercise-details" redirect={!isLogged} />
      <Stack.Screen name="meal-details" redirect={!isLogged} />
      <Stack.Screen name="add-progress-entry" redirect={!isLogged} />
      <Stack.Screen name="progress-photos" redirect={!isLogged} />
      <Stack.Screen name="settings" redirect={!isLogged} />
      <Stack.Screen name="membership-details" redirect={!isLogged} />
      <Stack.Screen name="attendance" redirect={!isLogged} />
      <Stack.Screen name="payments" redirect={!isLogged} />
      <Stack.Screen name="requests-messages" redirect={!isLogged} />
      <Stack.Screen name="scan-qr" redirect={!isLogged} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ProgramStoreProvider>
        <AttendanceProvider>
          <RootLayoutNav />
        </AttendanceProvider>
      </ProgramStoreProvider>
    </UserProvider>
  );
}
