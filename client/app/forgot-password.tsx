import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // later: state for messages
  const showSuccess = false;
  const showError = false;

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* header with back */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View className="h-12 w-12" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
        }}
      >
        <Text className="pb-2 text-[32px] font-bold leading-tight text-white">
          Reset Password
        </Text>
        <Text className="pb-8 text-base text-slate-400">
          Enter your email to receive a reset link.
        </Text>

        {/* email field */}
        <View className="mb-6 flex flex-col">
          <Text className="pb-2 text-sm font-medium text-slate-200">
            Email Address
          </Text>
          <View className="relative">
            <Ionicons
              name="mail-outline"
              size={18}
              color="#9ca3af"
              style={{ position: "absolute", left: 16, top: 20 }}
            />
            <TextInput
              placeholder="yourname@email.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-14 w-full rounded-lg border border-white/20 bg-white/5 pl-12 pr-4 text-base text-white focus:border-[rgb(13,242,13)]"
            />
          </View>
        </View>

        {/* success message */}
        {showSuccess && (
          <View className="mb-4 flex flex-row items-start gap-3 rounded-lg border border-[rgb(13,242,13)]/60 bg-[rgb(13,242,13)]/10 p-4">
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={PRIMARY}
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-sm text-slate-200">
              If an account exists with that email, we&apos;ve sent a reset
              link.
            </Text>
          </View>
        )}

        {/* error message */}
        {showError && (
          <View className="mb-4 flex flex-row items-start gap-3 rounded-lg border border-rose-500/60 bg-rose-500/10 p-4">
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#f97373"
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-sm text-slate-200">
              Please enter a valid email address.
            </Text>
          </View>
        )}

        {/* spacer */}
        <View className="flex-1" />

        {/* button */}
        <View className="mt-8">
          <TouchableOpacity
            className="h-14 w-full items-center justify-center rounded-xl bg-[rgb(13,242,13)]"
            activeOpacity={0.9}
            onPress={() => {
              // later: sendPasswordResetEmail(auth, email)
            }}
          >
            <Text className="text-base font-bold text-[#050816]">
              Send Reset Link
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
