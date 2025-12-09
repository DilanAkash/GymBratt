import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

const invoices = [
  { id: "INV-2043", date: "Feb 01, 2025", amount: "Rs 8,000", status: "Paid" },
  { id: "INV-2032", date: "Jan 01, 2025", amount: "Rs 8,000", status: "Paid" },
  { id: "INV-2021", date: "Dec 01, 2024", amount: "Rs 8,000", status: "Paid" },
];

export default function PaymentsScreen() {
  const router = useRouter();

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
            Payments
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
        {/* Status card */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Current status
          </Text>
          <View className="mt-3 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-slate-50">
                No pending payments
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Your membership is fully paid.
              </Text>
            </View>
            <View className="rounded-full bg-[rgba(13,242,13,0.16)] px-3 py-1">
              <Text className="text-[11px] font-semibold text-[#0df20d]">
                Up to date
              </Text>
            </View>
          </View>
        </View>

        {/* History */}
        <Text className="mb-2 text-sm font-semibold text-slate-100">
          Payment history
        </Text>

        <View className="rounded-3xl border border-white/10 bg-white/5">
          {invoices.map((inv, idx) => (
            <View key={inv.id}>
              {idx > 0 && <View className="h-[1px] w-full bg-white/10" />}
              <View className="flex-row items-center px-4 py-3">
                <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Ionicons name="receipt-outline" size={18} color="#e5e7eb" />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-50">
                    {inv.id}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-400">
                    {inv.date}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-sm font-semibold text-slate-50">
                    {inv.amount}
                  </Text>
                  <Text className="mt-1 text-xs font-medium text-[rgb(13,242,13)]">
                    {inv.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
