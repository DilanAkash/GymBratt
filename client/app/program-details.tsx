import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MOCK_PROGRAMS,
  type Program,
  type ProgramDay,
} from "../lib/mockPrograms";

const PRIMARY = "#0df20d";

type ProgramDetailsParams = {
  programId?: string;
};

function findProgram(programId?: string): Program {
  if (programId) {
    const fromId = MOCK_PROGRAMS.find((p) => p.id === programId);
    if (fromId) return fromId;
  }
  return MOCK_PROGRAMS[0];
}

function groupDaysByWeek(program: Program): [number, ProgramDay[]][] {
  const map = new Map<number, ProgramDay[]>();
  for (const day of program.days) {
    const arr = map.get(day.weekIndex) ?? [];
    arr.push(day);
    map.set(day.weekIndex, arr);
  }
  return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
}

export default function ProgramDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ProgramDetailsParams>();

  const program = findProgram(params.programId);
  const weeks = groupDaysByWeek(program);

  const completion =
    program.progress.totalWorkouts > 0
      ? program.progress.completedWorkouts / program.progress.totalWorkouts
      : 0;

  const completionPercent = Math.round(completion * 100);

  const summaryCards = [
    {
      icon: "calendar-outline" as const,
      value: `${program.durationWeeks} Weeks`,
      label: "Duration",
    },
    {
      icon: "repeat-outline" as const,
      value: `${program.daysPerWeek} Days/Week`,
      label: "Frequency",
    },
    {
      icon: "barbell-outline" as const,
      value: program.level,
      label: "Level",
    },
    {
      icon: "trending-up-outline" as const,
      value: `${completionPercent}%`,
      label: "Completed",
    },
  ];

  const sourceLabel =
    program.source === "coach" ? "Coach program" : "My program";

  const startDay =
    program.days.find((d) => d.status === "today") ?? program.days[0];

  const handleStartToday = () => {
    if (!startDay) return;
    router.push({
      pathname: "/workout-day",
      params: { programId: program.id, dayId: startDay.id },
    });
  };

  const handleDayPress = (day: ProgramDay) => {
    router.push({
      pathname: "/workout-day",
      params: { programId: program.id, dayId: day.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 px-2 text-center text-base font-semibold text-slate-100">
            Program details
          </Text>

          <View className="h-9 w-9" />
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 120,
          }}
        >
          {/* Program header */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="rounded-full bg-white/10 px-3 py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {sourceLabel}
                </Text>
              </View>
              {program.coachName && (
                <View className="rounded-full bg-white/10 px-3 py-1">
                  <Text className="text-[11px] text-zinc-300">
                    {program.coachName}
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-xl font-bold text-slate-50">
              {program.name}
            </Text>
            <Text className="mt-1 text-sm text-zinc-400">
              {program.goal}
            </Text>

            <View className="mt-3 flex-row flex-wrap gap-2">
              {program.tags.map((tag) => (
                <View
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1"
                >
                  <Text className="text-[11px] text-zinc-300">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Summary cards */}
          <View className="mb-5 flex-row flex-wrap gap-3">
            {summaryCards.map((card) => (
              <View
                key={card.label}
                className="flex-1 min-w-[46%] rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <View className="mb-2 flex-row items-center gap-2">
                  <Ionicons
                    name={card.icon}
                    size={16}
                    color="#9ca3af"
                  />
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {card.label}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-slate-50">
                  {card.value}
                </Text>
              </View>
            ))}
          </View>

          {/* About */}
          <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              About this program
            </Text>
            <Text className="mt-2 text-sm leading-relaxed text-zinc-300">
              {program.summary}
            </Text>
          </View>

          {/* Weekly plan */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-50">
              Weekly structure
            </Text>
            <Text className="text-xs text-zinc-500">
              {program.daysPerWeek} sessions / week
            </Text>
          </View>

          <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            {weeks.map(([weekNumber, days], index) => (
              <View key={weekNumber}>
                {index > 0 && (
                  <View className="my-3 h-[1px] w-full bg-white/10" />
                )}

                <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Week {weekNumber}
                </Text>

                {days
                  .slice()
                  .sort((a, b) => a.dayIndex - b.dayIndex)
                  .map((day) => {
                    let statusLabel = "";
                    let statusColor = "";

                    if (day.status === "today") {
                      statusLabel = "Today";
                      statusColor = "text-[#0df20d]";
                    } else if (day.status === "completed") {
                      statusLabel = "Done";
                      statusColor = "text-emerald-300";
                    } else {
                      statusLabel = "Upcoming";
                      statusColor = "text-zinc-400";
                    }

                    return (
                      <TouchableOpacity
                        key={day.id}
                        className="mb-2 flex-row items-center justify-between rounded-2xl bg-black/40 px-3 py-3"
                        activeOpacity={0.9}
                        onPress={() => handleDayPress(day)}
                      >
                        <View className="flex-1 pr-2">
                          <Text className="text-sm font-semibold text-slate-50">
                            {day.title}
                          </Text>
                          <Text className="mt-1 text-xs text-zinc-400">
                            {day.subtitle}
                          </Text>
                          <Text className="mt-1 text-[11px] text-zinc-500">
                            {day.focus}
                          </Text>
                        </View>

                        <View className="items-end">
                          <Text
                            className={`text-xs font-semibold ${statusColor}`}
                          >
                            {statusLabel}
                          </Text>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#6b7280"
                            style={{ marginTop: 6 }}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Sticky footer button */}
        <View className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent px-4 pb-6 pt-4">
          <TouchableOpacity
            className="pointer-events-auto h-12 flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)] shadow-[0_0_20px_rgba(13,242,13,0.5)]"
            activeOpacity={0.9}
            onPress={handleStartToday}
          >
            <Ionicons name="play" size={18} color="#050816" />
            <Text className="ml-2 text-sm font-bold text-[#050816]">
              Start today&apos;s workout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
