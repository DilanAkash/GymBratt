import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";
import type { Program, ProgramDay } from "../lib/mockPrograms";

type BuilderParams = {
  programId?: string;
};

export default function NewProgramBuilderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<BuilderParams>();
  const { programs, updateProgramDays, isLoading } = useProgramStore();

  const program: Program | undefined =
    (params.programId &&
      programs.find((p) => p.id === params.programId)) ||
    programs[programs.length - 1] ||
    programs[0];

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isUpdating, setIsUpdating] = useState(false);

  // Derive state directly from program
  const days = program?.days || [];

  const weeksList = useMemo(() => {
    const set = new Set(days.map((d) => d.weekIndex));
    const arr = Array.from(set);
    if (arr.length === 0) return [1];
    return arr.sort((a, b) => a - b);
  }, [days]);

  const weekDays = useMemo(
    () =>
      days
        .filter((d) => d.weekIndex === selectedWeek)
        .slice()
        .sort((a, b) => a.dayIndex - b.dayIndex),
    [days, selectedWeek]
  );

  const persistDays = async (newDays: ProgramDay[]) => {
    if (!program) return;
    setIsUpdating(true);
    try {
      // Normalize logic
      const byWeek = new Map<number, ProgramDay[]>();
      for (const day of newDays) {
        const arr = byWeek.get(day.weekIndex) ?? [];
        arr.push(day);
        byWeek.set(day.weekIndex, arr);
      }

      const normalized: ProgramDay[] = [];
      for (const [week, daysArr] of byWeek.entries()) {
        const sorted = daysArr.slice().sort((a, b) => a.dayIndex - b.dayIndex);
        sorted.forEach((d, i) => {
          normalized.push({
            ...d,
            weekIndex: week,
            dayIndex: i + 1,
          });
        });
      }

      await updateProgramDays(program.id, normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddWeek = () => {
    const maxWeek = weeksList.length
      ? Math.max(...weeksList)
      : 0;
    const newWeek = maxWeek + 1;
    setSelectedWeek(newWeek);
  };

  const handleAddDay = async () => {
    if (!program) return;
    const existing = days.filter(
      (d) => d.weekIndex === selectedWeek
    );
    const nextDayIndex =
      existing.length > 0
        ? Math.max(...existing.map((d) => d.dayIndex)) + 1
        : 1;

    const newDay: ProgramDay = {
      id: `${program.id}-w${selectedWeek}-d${Date.now()}`,
      title: `Day ${nextDayIndex} — Custom session`,
      subtitle: program.goal,
      focus: program.goal,
      weekIndex: selectedWeek,
      dayIndex: nextDayIndex,
      status: "upcoming",
      exercises: [],
    };

    await persistDays([...days, newDay]);
  };

  const handleRemoveDay = async (dayId: string) => {
    await persistDays(days.filter((d) => d.id !== dayId));
  };

  const handleEditDay = (dayId: string) => {
    if (!program) return;
    router.push({
      pathname: "/program-day-builder",
      params: { programId: program.id, dayId },
    });
  };

  const handleFinish = () => {
    if (!program) return;
    router.replace({
      pathname: "/program-details",
      params: { programId: program.id },
    });
  };

  if (isLoading && !program) {
    return (
      <SafeAreaView className="flex-1 bg-[#050816] items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView className="flex-1 bg-[#050816] items-center justify-center">
        <Text className="text-white">Program not found</Text>
      </SafeAreaView>
    );
  }

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
            Build program
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
          {/* Title / summary */}
          <View className="mb-6">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Structure
            </Text>
            <Text className="mt-2 text-xl font-bold text-slate-50">
              {program.name}
            </Text>
            <Text className="mt-1 text-sm text-zinc-400">
              {program.goal} · {program.daysPerWeek} days/week
            </Text>
          </View>

          {/* Week selector */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-slate-50">
                Weeks
              </Text>
              <TouchableOpacity
                onPress={handleAddWeek}
                className="flex-row items-center gap-1 rounded-full bg-white/10 px-3 py-1.5"
              >
                <Ionicons name="add" size={14} color="#a3e635" />
                <Text className="text-xs font-semibold text-lime-300">
                  Add week
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              <View className="flex-row gap-2">
                {weeksList.map((week) => {
                  const selected = week === selectedWeek;
                  return (
                    <TouchableOpacity
                      key={week}
                      onPress={() => setSelectedWeek(week)}
                      className={`h-8 min-w-[72px] items-center justify-center rounded-full border px-3 ${selected
                        ? "border-lime-400 bg-lime-400/20"
                        : "border-white/10 bg-white/5"
                        }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${selected ? "text-lime-300" : "text-neutral-200"
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

          {/* Days list for selected week */}
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-slate-50">
                Week {selectedWeek} — workout days
              </Text>
              <Text className="mt-1 text-xs text-zinc-500">
                Tap a day to edit exercises & sets.
              </Text>
            </View>
          </View>

          {weekDays.length === 0 ? (
            <View className="mb-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4">
              <Text className="text-sm text-zinc-300">
                No workout days in this week yet. Add your first day below.
              </Text>
            </View>
          ) : (
            weekDays.map((day) => (
              <View
                key={day.id}
                className="mb-3 flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <TouchableOpacity
                  className="flex-1 flex-row items-center gap-3"
                  activeOpacity={0.9}
                  onPress={() => handleEditDay(day.id)}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-black/50">
                    <Text className="text-sm font-semibold text-slate-50">
                      {day.dayIndex}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-100">
                      {day.title}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-400">
                      {day.subtitle}
                    </Text>
                    <View className="mt-2 inline-flex items-center rounded-full bg-black/40 px-3 py-1">
                      <Text className="text-[11px] text-slate-200">
                        {day.exercises.length} exercise
                        {day.exercises.length === 1 ? "" : "s"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRemoveDay(day.id)}
                  className="h-8 w-8 items-center justify-center rounded-full bg-white/5"
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#fca5a5"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}

          {/* Add workout day */}
          <TouchableOpacity
            className="mt-2 mb-4 flex-row items-center gap-2 rounded-xl border-2 border-dashed border-slate-700 p-4"
            onPress={handleAddDay}
            activeOpacity={0.9}
          >
            <Ionicons name="add-circle" size={24} color="#0df20d" />
            <Text className="text-base font-semibold text-[#0df20d]">
              Add a workout day
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom actions */}
        <View className="border-t border-white/10 bg-[#050816]/95 px-4 pb-6 pt-4">
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={isUpdating}
            className={`h-12 flex-row items-center justify-center rounded-xl ${isUpdating
              ? "bg-lime-500/60"
              : "bg-[rgb(13,242,13)] shadow-[0_0_20px_rgba(13,242,13,0.5)]"
              }`}
            onPress={handleFinish}
          >
            <Text className="text-sm font-bold text-[#050816]">
              {isUpdating ? "Saving..." : "Done & View Program"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
