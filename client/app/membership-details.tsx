import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function MembershipDetailsScreen() {
  const router = useRouter();

  const membership = {
    gymName: "Fitness First Gym",
    planName: "Standard Membership",
    status: "Active",
    startedAt: "2025-01-01",
    expiresAt: "2025-12-31",
    billingCycle: "Monthly",
    nextPayment: "2025-03-01",
    trainer: "Alex Johnson",
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
            Membership
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
        {/* Main card */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Current membership
          </Text>
          <Text className="mt-2 text-lg font-bold text-slate-50">
            {membership.planName}
          </Text>
          <Text className="mt-1 text-xs text-slate-400">
            {membership.gymName}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-[rgba(13,242,13,0.16)] px-3 py-1">
              <Text className="text-[11px] font-semibold text-[#0df20d]">
                {membership.status}
              </Text>
            </View>
            <View className="rounded-full bg-white/10 px-3 py-1">
              <Text className="text-[11px] font-medium text-slate-200">
                {membership.billingCycle} billing
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between">
            <View>
              <Text className="text-[11px] uppercase tracking-wide text-slate-500">
                Start date
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {membership.startedAt}
              </Text>
            </View>
            <View>
              <Text className="text-[11px] uppercase tracking-wide text-slate-500">
                Expires
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {membership.expiresAt}
              </Text>
            </View>
          </View>
        </View>

        {/* Trainer */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Assigned trainer
          </Text>
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="person-outline" size={20} color="#e5e7eb" />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-50">
                {membership.trainer}
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Contact them via Requests & messages
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.85}
            onPress={() => router.push("/payments")}
          >
            <View className="flex-row items-center">
              <Ionicons name="wallet-outline" size={18} color="#e5e7eb" />
              <Text className="ml-2 text-sm text-slate-50">
                View payment history
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          <View className="h-[1px] w-full bg-white/10" />

          <TouchableOpacity className="flex-row items-center justify-between py-2" activeOpacity={0.85}>
            <View className="flex-row items-center">
              <Ionicons name="swap-horizontal-outline" size={18} color="#e5e7eb" />
              <Text className="ml-2 text-sm text-slate-50">
                Request plan change
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
