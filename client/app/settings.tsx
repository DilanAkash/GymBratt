import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

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
            Settings
          </Text>

          <View className="h-10 w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* App appearance */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="mb-3 text-sm font-semibold text-slate-100">
            Appearance
          </Text>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-medium text-slate-50">
                Dark mode
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                We&apos;re already using the dark gym theme.
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? "#0df20d" : "#f9fafb"}
              trackColor={{ false: "#4b5563", true: "#15803d" }}
            />
          </View>
        </View>

        {/* Notifications */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="mb-3 text-sm font-semibold text-slate-100">
            Notifications
          </Text>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-medium text-slate-50">
                Workout & meal reminders
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Push notifications for today&apos;s plan and check-ins.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#0df20d" : "#f9fafb"}
              trackColor={{ false: "#4b5563", true: "#15803d" }}
            />
          </View>
        </View>

        {/* Units & language */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5">
          <TouchableOpacity className="flex-row items-center px-4 py-4">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="scale-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">Units</Text>
              <Text className="mt-1 text-xs text-slate-400">
                kg, cm, kcal (tap to change later)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          <View className="h-[1px] w-full bg-white/10" />

          <TouchableOpacity className="flex-row items-center px-4 py-4">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="language-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">
                Language
              </Text>
              <Text className="mt-1 text-xs text-slate-400">English</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Danger zone */}
        <View className="rounded-3xl border border-red-500/40 bg-red-500/5 p-4">
          <Text className="mb-2 text-sm font-semibold text-red-400">
            Account
          </Text>

          <TouchableOpacity className="py-2">
            <Text className="text-xs font-medium text-red-300">
              Delete account (coming later)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
