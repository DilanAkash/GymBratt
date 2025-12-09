import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function EditProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [goal, setGoal] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Template mode: pretend to save, then go to tabs
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.replace("/(tabs)");
    }, 600); // small delay just to feel responsive
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 px-2 text-center text-lg font-bold text-white">
            Edit profile
          </Text>

          <View className="h-10 w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
        }}
      >
        {/* Avatar */}
        <View className="mb-6 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-[rgba(13,242,13,0.7)] bg-black/80">
            <Text className="text-2xl font-bold text-white">
              {fullName ? fullName.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
          <TouchableOpacity className="mt-3 flex-row items-center gap-1.5">
            <Ionicons name="camera-outline" size={16} color={PRIMARY} />
            <Text className="text-xs font-semibold text-[#0df20d]">
              Change photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form fields */}
        <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          {/* Name */}
          <View className="mb-3">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Full name
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor="#6b7280"
              className="mt-1 h-11 rounded-xl bg-slate-900/80 px-3 text-sm text-slate-100"
            />
          </View>

          {/* Email */}
          <View className="mb-3">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="mt-1 h-11 rounded-xl bg-slate-900/80 px-3 text-sm text-slate-100"
            />
          </View>

          {/* Phone */}
          <View className="mb-3">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Phone
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+94 77 123 4567"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              className="mt-1 h-11 rounded-xl bg-slate-900/80 px-3 text-sm text-slate-100"
            />
          </View>

          {/* Date of birth */}
          <View className="mb-3">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Date of birth
            </Text>
            <TouchableOpacity className="mt-1 h-11 flex-row items-center justify-between rounded-xl bg-slate-900/80 px-3">
              <Text className="text-sm text-slate-100">
                {dob || "YYYY-MM-DD"}
              </Text>
              <Ionicons name="calendar-outline" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Goal */}
          <View>
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Main goal
            </Text>
            <TouchableOpacity className="mt-1 h-11 flex-row items-center justify-between rounded-xl bg-slate-900/80 px-3">
              <Text className="text-sm text-slate-100">
                {goal || "Build muscle & strength"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gym info (placeholder) */}
        <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Gym
          </Text>
          <Text className="text-sm font-semibold text-slate-100">
            Not linked yet
          </Text>
          <Text className="mt-1 text-xs text-slate-400">
            Your gym will appear here when an admin links your membership.
          </Text>
        </View>
      </ScrollView>

      {/* Save button */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#050816]/95 px-4 pb-6 pt-3">
        <TouchableOpacity
          className="h-14 w-full flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)]"
          activeOpacity={0.9}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Text className="text-base font-bold text-[#050816]">
              Saving...
            </Text>
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#050816" />
              <Text className="ml-2 text-base font-bold text-[#050816]">
                Save changes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
