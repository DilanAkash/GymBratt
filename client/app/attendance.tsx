import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAttendance, type AttendanceEntry } from "../lib/AttendanceContext";

const PRIMARY = "#0df20d";

// Weekday labels (Mon–Sun)
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateLabel(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const monthShort = MONTH_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${monthShort} ${day}, ${year}`;
}

function formatTimeLabel(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isAM = hours < 12;
  const hour12 = hours % 12 || 12;
  const h = hour12.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  return `${h}:${m} ${isAM ? "AM" : "PM"}`;
}

function computeStreakDays(entries: AttendanceEntry[]): number {
  if (entries.length === 0) return 0;

  const keyForDate = (d: Date) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}-${m}-${day}`;
  };

  const dateSet = new Set(
    entries.map((e) => keyForDate(new Date(e.timestamp)))
  );

  let streak = 0;
  const current = new Date();
  while (true) {
    const key = keyForDate(current);
    if (!dateSet.has(key)) break;
    streak++;
    current.setDate(current.getDate() - 1);
  }
  return streak;
}

export default function AttendanceScreen() {
  const router = useRouter();
  const { entries } = useAttendance();

  // Sort newest first
  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  // Convert JS weekday (0=Sun) → our system (0=Mon, 6=Sun)
  const firstWeekdayOffset = (firstDay.getDay() + 6) % 7;

  const entriesThisMonth = sortedEntries.filter((entry) => {
    const d = new Date(entry.timestamp);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const checkInsThisMonth = entriesThisMonth.length;

  const lastVisit =
    sortedEntries.length > 0
      ? formatDateLabel(new Date(sortedEntries[0].timestamp))
      : "—";

  const visitedDaySet = new Set(
    entriesThisMonth.map((entry) => new Date(entry.timestamp).getDate())
  );

  const streakDays = computeStreakDays(sortedEntries);

  const monthLabel = `${MONTH_FULL[month]} ${year}`;

  const recentCheckIns = sortedEntries.slice(0, 10).map((entry) => {
    const d = new Date(entry.timestamp);
    return {
      id: entry.id,
      date: formatDateLabel(d),
      time: formatTimeLabel(d),
      status: "Checked in",
    };
  });

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
                {checkInsThisMonth}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400">Last visit</Text>
              <Text className="mt-1 text-sm font-semibold text-white">
                {lastVisit}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400">Streak</Text>
              <Text className="mt-1 text-2xl font-bold text-white">
                {streakDays}
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
              {monthLabel}
            </Text>

            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full">
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#9ca3af"
              />
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
              <Text className="text-[11px] text-slate-400">
                No visit
              </Text>
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
              ...Array(firstWeekdayOffset).fill(null),
              // Actual days
              ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
            ].map((value, idx) => {
              if (value === null) {
                return (
                  <View
                    key={`blank-${idx}`}
                    style={{ width: "14.28%" }}
                    className="mb-3"
                  />
                );
              }

              const isVisited = visitedDaySet.has(value);

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
                        isVisited
                          ? "text-[#050816]"
                          : "text-slate-200"
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
          {recentCheckIns.length === 0 ? (
            <View className="px-4 py-4">
              <Text className="text-xs text-slate-400">
                No check-ins yet. Scan your gym&apos;s QR code to mark
                your first visit.
              </Text>
            </View>
          ) : (
            recentCheckIns.map((entry, idx) => (
              <View key={entry.id}>
                {idx > 0 && (
                  <View className="h-[1px] w-full bg-white/10" />
                )}
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
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
