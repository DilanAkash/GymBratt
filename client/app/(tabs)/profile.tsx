import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function ProfileScreen() {
  const router = useRouter();

  const user = {
    name: "Dilan Akash",
    email: "dilan@example.com",
    gymName: "Fitness First Gym",
    membershipStatus: "Active",
    membershipLevel: "Standard · 3 days / week",
  };

  const stats = {
    streakDays: 7,
    checkInsThisMonth: 12,
    programsCompleted: 2,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* Header: title */}
        <Text className="mb-4 text-[28px] font-bold leading-tight text-white">
          Profile
        </Text>

        {/* User card */}
        <View className="mb-5 flex-row items-center rounded-3xl border border-white/10 bg-white/5 p-4">
          {/* Avatar */}
          <View className="mr-4 h-14 w-14 items-center justify-center rounded-full border-2 border-[rgba(13,242,13,0.7)] bg-black/70">
            <Text className="text-lg font-semibold text-white">
              {user.name.charAt(0)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-50">
              {user.name}
            </Text>
            <Text className="mt-1 text-xs text-slate-400">
              {user.email}
            </Text>
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-white/10 px-3 py-1">
                <Text className="text-[11px] font-medium text-slate-200">
                  {user.gymName}
                </Text>
              </View>
              <View className="rounded-full bg-[rgba(13,242,13,0.16)] px-3 py-1">
                <Text className="text-[11px] font-semibold text-[#0df20d]">
                  {user.membershipStatus}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons name="create-outline" size={18} color="#e5e7eb" />
          </TouchableOpacity>
        </View>

        {/* Quick stats card */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Overview
          </Text>

          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-xs text-slate-400">Streak</Text>
              <Text className="mt-1 text-xl font-bold text-white">
                {stats.streakDays} days
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400">
                Check-ins (this month)
              </Text>
              <Text className="mt-1 text-xl font-bold text-white">
                {stats.checkInsThisMonth}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-400">Programs done</Text>
              <Text className="mt-1 text-xl font-bold text-white">
                {stats.programsCompleted}
              </Text>
            </View>
          </View>
        </View>

        {/* Sections list */}
        <View className="mb-3">
          <Text className="text-sm font-semibold text-slate-100">
            Account & gym
          </Text>
        </View>

        {/* Each row = navigation item */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5">
          {/* Membership details */}
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            activeOpacity={0.85}
            onPress={() => router.push("/membership-details")}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="card-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">
                Membership
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                {user.membershipLevel}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          {/* Attendance */}
          <View className="h-[1px] w-full bg-white/10" />
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            activeOpacity={0.85}
            onPress={() => router.push("/attendance")}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="calendar-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">
                Attendance
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                View your check-in history
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          {/* Payments */}
          <View className="h-[1px] w-full bg-white/10" />
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            activeOpacity={0.85}
            onPress={() => router.push("/payments")}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="wallet-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">
                Payments
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Invoices, renewals and receipts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          {/* Requests & messages */}
          <View className="h-[1px] w-full bg-white/10" />
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            activeOpacity={0.85}
            onPress={() => router.push("/requests-messages")}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">
                Requests & messages
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Talk to your gym or trainer
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Settings section */}
        <View className="mb-3">
          <Text className="text-sm font-semibold text-slate-100">
            App & account
          </Text>
        </View>

        <View className="mb-4 rounded-3xl border border-white/10 bg-white/5">
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            activeOpacity={0.85}
            onPress={() => router.push("/settings")}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="settings-outline" size={18} color="#e5e7eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-50">
                Settings
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Units, notifications, appearance
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Log out (visual only for now) */}
        <TouchableOpacity
          className="mt-2 h-12 items-center justify-center rounded-full border border-red-500/60 bg-red-500/10"
          activeOpacity={0.85}
          onPress={() => {
            // Later: signOut()
          }}
        >
          <Text className="text-sm font-semibold text-red-400">
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
