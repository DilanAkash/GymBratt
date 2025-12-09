import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // ✅ Real Firebase Auth login, but NO Firestore calls here
      await signInWithEmailAndPassword(auth, trimmedEmail, password);

      // After login: go straight to Edit Profile (first-time setup style)
      router.replace("/edit-profile");
    } catch (err: any) {
      console.log("Login error:", err);

      let friendlyMessage = "Something went wrong. Please try again.";

      if (err?.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      } else if (
        err?.code === "auth/invalid-credential" ||
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
      ) {
        friendlyMessage = "Incorrect email or password.";
      } else if (err?.code === "auth/too-many-requests") {
        friendlyMessage =
          "Too many attempts. Please wait a moment and try again.";
      }

      setErrorMessage(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 72,
            paddingBottom: 32,
          }}
        >
          {/* Header */}
          <View className="items-center">
            <Text className="pb-2 text-center text-[32px] font-bold leading-tight text-white">
              Welcome back
            </Text>
            <Text className="text-center text-base text-slate-400">
              Log in to access your plans.
            </Text>
          </View>

          {/* Error banner */}
          {errorMessage && (
            <View className="mt-6 mb-2 flex-row items-start gap-3 rounded-2xl border border-rose-500/60 bg-rose-500/10 p-3">
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#fb7185"
                style={{ marginTop: 2 }}
              />
              <Text className="flex-1 text-sm text-slate-100">
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Form */}
          <View className="mt-6 flex w-full flex-col gap-4">
            {/* Email */}
            <View className="flex w-full flex-col">
              <Text className="pb-2 text-base font-medium text-white">
                Email
              </Text>
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                className="h-14 rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-base text-white focus:border-[rgb(13,242,13)]"
              />
            </View>

            {/* Password */}
            <View className="flex w-full flex-col">
              <Text className="pb-2 text-base font-medium text-white">
                Password
              </Text>
              <View className="flex w-full flex-row items-stretch rounded-xl">
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                  className="h-14 flex-1 rounded-xl rounded-r-none border border-slate-700 bg-slate-900/60 px-4 pr-2 text-base text-white focus:border-[rgb(13,242,13)]"
                />
                <TouchableOpacity
                  className="h-14 items-center justify-center rounded-r-xl border border-l-0 border-slate-700 bg-slate-900/60 px-4"
                  activeOpacity={0.8}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <View className="w-full items-end py-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/forgot-password")}
              >
                <Text className="text-sm font-medium text-[rgb(13,242,13)]">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Log In button */}
            <View className="w-full pt-2">
              <TouchableOpacity
                className={`h-14 w-full items-center justify-center rounded-xl ${
                  loading
                    ? "bg-[rgb(13,242,13)]/70"
                    : "bg-[rgb(13,242,13)]"
                }`}
                activeOpacity={0.9}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#050816" />
                ) : (
                  <Text className="text-base font-bold text-[#050816]">
                    Log In
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View className="mt-8 flex w-full flex-row items-center">
            <View className="flex-1 border-t border-slate-700" />
            <Text className="px-4 text-sm text-slate-500">
              Don&apos;t have an account?
            </Text>
            <View className="flex-1 border-t border-slate-700" />
          </View>

          {/* Request membership */}
          <View className="mt-6 w-full">
            <TouchableOpacity
              className="h-14 w-full items-center justify-center rounded-xl border border-[rgb(13,242,13)] bg-transparent"
              activeOpacity={0.9}
              onPress={() => router.push("/request-membership")}
            >
              <Text className="text-base font-bold text-[rgb(13,242,13)]">
                Request Membership
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
