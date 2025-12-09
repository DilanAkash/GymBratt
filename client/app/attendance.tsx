import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

// Recent check-ins
const checkIns = [
  { id: "1", date: "Feb 23, 2025", time: "07:34 AM", status: "Checked in" },
  { id: "2", date: "Feb 21, 2025", time: "06:58 AM", status: "Checked in" },
  { id: "3", date: "Feb 19, 2025", time: "07:12 AM", status: "Checked in" },
];

// Template attendance summary + calendar data
const summary = {
  checkInsThisMonth: 12,
  lastVisit: "Feb 23, 2025",
  streakDays: 4,
  monthLabel: "February 2025",
  daysInMonth: 28, // adjust for different months later
  firstWeekdayOffset: 5, // 0 = Mon, 6 = Sun → 5 means month starts on Saturday
  visitedDays: [2, 4, 6, 9, 12, 15, 18, 21, 23],
};

// Weekday labels
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AttendanceScreen() {
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
            Attendance
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
        {/* ===== Summary card ===== */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            This month
          </Text>
          <View className="mt-3 flex-row justify-between">
            <View>
              <Text className="text-xs text-slate-400">Check-ins</Text>
              <Text className="mt-1 text-2xl font-bold text-white">
                {summary.checkInsThisMonth}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400">Last visit</Text>
              <Text className="mt-1 text-sm font-semibold text-white">
                {summary.lastVisit}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400">Streak</Text>
              <Text className="mt-1 text-2xl font-bold text-white">
                {summary.streakDays}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== Calendar card ===== */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          {/* Month header */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full">
              <Ionicons name="chevron-back" size={18} color="#9ca3af" />
            </TouchableOpacity>

            <Text className="text-sm font-semibold text-slate-100">
              {summary.monthLabel}
            </Text>

            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full">
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Legend */}
          <View className="mt-3 flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-[rgb(13,242,13)]" />
              <Text className="text-[11px] text-slate-400">Visited</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full border border-white/40" />
              <Text className="text-[11px] text-slate-400">No visit</Text>
            </View>
          </View>

          {/* Weekday labels */}
          <View className="mt-5 flex-row justify-between px-1">
            {WEEKDAYS.map((day) => (
              <Text
                key={day}
                className="w-[14.28%] text-center text-[11px] font-semibold text-slate-400"
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="mt-3 flex-row flex-wrap">
            {[
              // Empty slots before month starts
              ...Array(summary.firstWeekdayOffset).fill(null),
              // Actual days
              ...Array.from({ length: summary.daysInMonth }, (_, i) => i + 1),
            ].map((value, idx) => {
              if (value === null) {
                // Render blank space for empty starting days
                return (
                  <View
                    key={`blank-${idx}`}
                    style={{ width: "14.28%" }}
                    className="mb-3"
                  />
                );
              }

              const isVisited = summary.visitedDays.includes(value);

              return (
                <View
                  key={value}
                  style={{ width: "14.28%" }}
                  className="mb-4 items-center"
                >
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-full ${
                      isVisited
                        ? "bg-[rgb(13,242,13)]"
                        : "border border-white/30 bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-semibold ${
                        isVisited ? "text-[#050816]" : "text-slate-200"
                      }`}
                    >
                      {value}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ===== Recent check-ins list ===== */}
        <Text className="mb-2 text-sm font-semibold text-slate-100">
          Recent check-ins
        </Text>

        <View className="rounded-3xl border border-white/10 bg-white/5">
          {checkIns.map((entry, idx) => (
            <View key={entry.id}>
              {idx > 0 && <View className="h-[1px] w-full bg-white/10" />}
              <View className="flex-row items-center px-4 py-3">
                <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={PRIMARY}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-50">
                    {entry.date}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-400">
                    {entry.time}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-[rgb(13,242,13)]">
                  {entry.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
