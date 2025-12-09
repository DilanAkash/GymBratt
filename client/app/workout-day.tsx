import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MOCK_PROGRAMS,
  type Program,
  type ProgramDay,
  type ProgramExercise,
} from "../lib/mockPrograms";

type WorkoutDayParams = {
  programId?: string;
  dayId?: string;
};

type CompletedMap = Record<string, boolean>;

function findProgramAndDay(
  programId?: string,
  dayId?: string
): { program: Program; day: ProgramDay } {
  const program =
    (programId && MOCK_PROGRAMS.find((p) => p.id === programId)) ||
    MOCK_PROGRAMS[0];

  const day =
    (dayId && program.days.find((d) => d.id === dayId)) ||
    program.days[0];

  return { program, day };
}

export default function WorkoutDayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<WorkoutDayParams>();

  const { program, day } = findProgramAndDay(
    params.programId,
    params.dayId
  );

  const [completedSets, setCompletedSets] = useState<CompletedMap>({});

  const allSets = day.exercises.flatMap((ex) =>
    ex.sets.map((set, index) => ({
      key: `${ex.id}-${set.id}-${index}`,
      exercise: ex,
      set,
      index,
    }))
  );

  const totalSets = allSets.length;
  const completedCount = allSets.filter(
    (s) => completedSets[s.key]
  ).length;
  const progress =
    totalSets > 0 ? completedCount / totalSets : 0;

  const toggleSet = (key: string) => {
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const markAllCompleted = () => {
    const next: CompletedMap = {};
    for (const s of allSets) {
      next[s.key] = true;
    }
    setCompletedSets(next);
  };

  const handleExercisePress = (exercise: ProgramExercise) => {
    router.push({
      pathname: "/exercise-details",
      params: {
        programId: program.id,
        dayId: day.id,
        exerciseId: exercise.id,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 px-2 text-center text-base font-semibold text-slate-100">
            Workout
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
          {/* Session info */}
          <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              {program.name}
            </Text>
            <Text className="mt-2 text-lg font-bold text-slate-50">
              {day.title}
            </Text>
            <Text className="mt-1 text-sm text-zinc-400">
              {day.subtitle}
            </Text>

            {/* Progress */}
            <View className="mt-4">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-xs text-zinc-400">
                  Session progress
                </Text>
                <Text className="text-xs font-medium text-[#0df20d]">
                  {Math.round(progress * 100)}% complete
                </Text>
              </View>
              <View className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <View
                  className="h-1.5 rounded-full bg-[#0df20d]"
                  style={{ width: `${progress * 100}%` }}
                />
              </View>
            </View>
          </View>

          {/* Exercises list */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-50">
              Exercises
            </Text>
            <Text className="mt-1 text-xs text-zinc-500">
              Tap an exercise to view technique details.
            </Text>
          </View>

          {day.exercises.map((exercise) => (
            <View
              key={exercise.id}
              className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleExercisePress(exercise)}
                className="flex-row items-center justify-between"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-semibold text-slate-50">
                    {exercise.name}
                  </Text>
                  <Text className="mt-1 text-xs text-zinc-400">
                    {exercise.muscleGroup} · {exercise.equipment}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#6b7280"
                />
              </TouchableOpacity>

              {/* Sets */}
              <View className="mt-3 rounded-2xl bg-black/40 p-3">
                {exercise.sets.map((set, index) => {
                  const key = `${exercise.id}-${set.id}-${index}`;
                  const isDone = !!completedSets[key];

                  return (
                    <View
                      key={set.id}
                      className="mb-2 flex-row items-center justify-between"
                    >
                      <View className="flex-row items-center gap-3">
                        <Text className="text-xs font-semibold text-zinc-500">
                          {index + 1}
                        </Text>
                        <View>
                          <Text className="text-sm text-slate-50">
                            {set.targetReps}
                          </Text>
                          <View className="mt-0.5 flex-row flex-wrap gap-2">
                            {set.rpe && (
                              <Text className="text-[11px] text-zinc-400">
                                {set.rpe}
                              </Text>
                            )}
                            {set.rest && (
                              <Text className="text-[11px] text-zinc-500">
                                {set.rest}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        className={`h-7 min-w-[72px] items-center justify-center rounded-full border ${
                          isDone
                            ? "border-[#0df20d] bg-[#0df20d]"
                            : "border-white/30 bg-transparent"
                        }`}
                        activeOpacity={0.85}
                        onPress={() => toggleSet(key)}
                      >
                        <Text
                          className={`text-[11px] font-semibold ${
                            isDone ? "text-[#050816]" : "text-slate-100"
                          }`}
                        >
                          {isDone ? "Done" : "Mark done"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Sticky footer button */}
        <View className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent px-4 pb-6 pt-4">
          <TouchableOpacity
            className="pointer-events-auto h-12 flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)] shadow-[0_0_20px_rgba(13,242,13,0.5)]"
            activeOpacity={0.9}
            onPress={markAllCompleted}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#050816"
            />
            <Text className="ml-2 text-sm font-bold text-[#050816]">
              Mark workout completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
