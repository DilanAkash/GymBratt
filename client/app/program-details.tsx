import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

const SUMMARY_CARDS = [
  {
    icon: "calendar-outline" as const,
    value: "8 Weeks",
    label: "Duration",
  },
  {
    icon: "repeat-outline" as const,
    value: "4 Days/Week",
    label: "Frequency",
  },
  {
    icon: "barbell" as const,
    value: "Strength & Hypertrophy",
    label: "Goal",
  },
  {
    icon: "person-circle-outline" as const,
    value: "Alex Ray",
    label: "Trainer",
  },
];

const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8];

type DayStatus = "completed" | "inProgress" | "notStarted";

const DAYS: {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusType: DayStatus;
}[] = [
  {
    id: "day1",
    title: "Day 1",
    subtitle: "Chest, Triceps",
    status: "Completed",
    statusType: "completed",
  },
  {
    id: "day2",
    title: "Day 2",
    subtitle: "Back, Biceps",
    status: "In Progress",
    statusType: "inProgress",
  },
  {
    id: "day3",
    title: "Day 3",
    subtitle: "Legs, Core",
    status: "Not Started",
    statusType: "notStarted",
  },
  {
    id: "day4",
    title: "Day 4",
    subtitle: "Shoulders, Abs",
    status: "Not Started",
    statusType: "notStarted",
  },
];

export default function ProgramDetailsScreen() {
  const router = useRouter();
  const activeWeek = 1; // later this will be state/dynamic

  const handleDayPress = (dayId: string) => {
    // Later: pass program + week + day
    router.push("/workout-day");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/90 px-4 pb-3 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 text-center text-lg font-bold text-white">
            Ultimate Strength Builder
          </Text>

          {/* Spacer to keep title centered */}
          <View className="w-10" />
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 24,
          }}
        >
          {/* ===== Program summary grid ===== */}
          <View className="mb-6">
            <View className="flex-row gap-4 mb-4">
              {SUMMARY_CARDS.slice(0, 2).map((card) => (
                <View
                  key={card.label}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <Ionicons name={card.icon} size={20} color={PRIMARY} />
                  <View className="mt-3">
                    <Text className="text-base font-bold text-white">
                      {card.value}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-400">
                      {card.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="flex-row gap-4">
              {SUMMARY_CARDS.slice(2, 4).map((card) => (
                <View
                  key={card.label}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <Ionicons name={card.icon} size={20} color={PRIMARY} />
                  <View className="mt-3">
                    <Text className="text-base font-bold text-white">
                      {card.value}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-400">
                      {card.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ===== Week selector ===== */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              <View className="flex-row gap-2">
                {WEEKS.map((week) => {
                  const selected = week === activeWeek;
                  return (
                    <TouchableOpacity
                      key={week}
                      className={`h-10 items-center justify-center rounded-lg px-4 ${
                        selected ? "bg-[#0df20d]" : "bg-white/10"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selected ? "text-[#050816]" : "text-white"
                        }`}
                      >
                        Week {week}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* ===== Week overview title ===== */}
          <View className="mb-3">
            <Text className="text-base font-semibold text-white">
              Week {activeWeek} Overview
            </Text>
            <Text className="mt-1 text-sm text-gray-400">
              Tap a day to view or start the workout.
            </Text>
          </View>

          {/* ===== Day cards ===== */}
          <View>
            {DAYS.map((day) => {
              let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";
              let iconBg = "bg-white/10";
              let statusColor = "text-gray-400";

              if (day.statusType === "completed") {
                iconName = "checkmark-circle";
                iconBg = "bg-[#0df20d]/20";
                statusColor = "text-[#0df20d]";
              } else if (day.statusType === "inProgress") {
                iconName = "play-circle";
                iconBg = "bg-[#0df20d]/20";
                statusColor = "text-[#0df20d]";
              }

              return (
                <TouchableOpacity
                  key={day.id}
                  className="mb-3 flex-row items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                  activeOpacity={0.85}
                  onPress={() => handleDayPress(day.id)}
                >
                  <View className={`flex size-12 items-center justify-center rounded-lg ${iconBg}`}>
                    <Ionicons name={iconName} size={24} color={day.statusType === "notStarted" ? "#ffffff" : PRIMARY} />
                  </View>

                  <View className="flex-1 flex-col gap-1">
                    <Text className="font-medium text-white">{day.title}</Text>
                    <Text className="text-sm text-gray-400">
                      {day.subtitle}
                    </Text>
                    <Text className={`text-sm font-medium ${statusColor}`}>
                      {day.status}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
