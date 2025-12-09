import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MOCK_PROGRAMS,
  type ProgramExercise,
} from "../lib/mockPrograms";

const PRIMARY = "#0df20d";

type ExerciseDetailParams = {
  name?: string;
  programId?: string;
  dayId?: string;
  exerciseId?: string;
};

function findExerciseFromProgram(
  programId?: string,
  exerciseId?: string
): ProgramExercise | null {
  if (!programId || !exerciseId) return null;

  const program = MOCK_PROGRAMS.find((p) => p.id === programId);
  if (!program) return null;

  for (const day of program.days) {
    const found = day.exercises.find((e) => e.id === exerciseId);
    if (found) return found;
  }

  return null;
}

export default function ExerciseDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ExerciseDetailParams>();

  const fromProgram = findExerciseFromProgram(
    params.programId,
    params.exerciseId
  );

  const fallbackSets = [
    {
      id: "s1",
      label: "Set 1",
      targetReps: "8–10 reps",
      rpe: "RPE 7–8",
      rest: "Rest 90s",
    },
    {
      id: "s2",
      label: "Set 2",
      targetReps: "8–10 reps",
      rpe: "RPE 8",
      rest: "Rest 90s",
    },
  ];

  const exercise: ProgramExercise = fromProgram || {
    id: "fallback",
    name: params.name || "Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    notes:
      "Focus on a stable setup, controlled descent, and powerful press without losing tension.",
    videoUrl: "",
    sets: fallbackSets,
  };

  const primaryMuscle = exercise.muscleGroup;
  const equipment = exercise.equipment;

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
            Exercise details
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
            paddingBottom: 32,
          }}
        >
          {/* Title & tags */}
          <View className="mb-4">
            <Text className="text-xl font-bold text-slate-50">
              {exercise.name}
            </Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-white/10 px-3 py-1">
                <Text className="text-[11px] text-zinc-300">
                  {primaryMuscle}
                </Text>
              </View>
              <View className="rounded-full bg-white/10 px-3 py-1">
                <Text className="text-[11px] text-zinc-300">
                  {equipment}
                </Text>
              </View>
            </View>
          </View>

          {/* Hero / thumbnail placeholder */}
          <View className="mb-5 h-40 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/0 to-emerald-500/20">
            <View className="flex-1 items-center justify-center">
              <Ionicons
                name="barbell-outline"
                size={40}
                color="#e5e7eb"
              />
              <Text className="mt-2 text-xs text-slate-200">
                Video / demo preview (coming soon)
              </Text>
            </View>
          </View>

          {/* Technique card */}
          <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Technique focus
            </Text>
            <Text className="mt-2 text-sm leading-relaxed text-zinc-300">
              {exercise.notes ||
                "Focus on full range of motion, stable setup, and control on both concentric and eccentric portions of the lift."}
            </Text>
          </View>

          {/* Sets overview */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-50">
              Prescribed sets
            </Text>
            <Text className="text-xs text-zinc-500">
              {exercise.sets.length} set
              {exercise.sets.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-3">
            {exercise.sets.map((set, index) => (
              <View key={set.id}>
                {index > 0 && (
                  <View className="my-2 h-[1px] w-full bg-white/10" />
                )}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-black/60">
                      <Text className="text-xs font-semibold text-slate-50">
                        {index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-sm font-medium text-slate-50">
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
                </View>
              </View>
            ))}
          </View>

          {/* Coaching cues */}
          <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Coaching cues
            </Text>
            <View className="mt-2 space-y-2">
              <View className="flex-row gap-2">
                <Text className="mt-[2px] text-base text-[#0df20d]">
                  •
                </Text>
                <Text className="flex-1 text-sm text-zinc-300">
                  Control the lowering phase; don&apos;t let the weight
                  drop.
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="mt-[2px] text-base text-[#0df20d]">
                  •
                </Text>
                <Text className="flex-1 text-sm text-zinc-300">
                  Keep your setup consistent on every rep and every set.
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="mt-[2px] text-base text-[#0df20d]">
                  •
                </Text>
                <Text className="flex-1 text-sm text-zinc-300">
                  Stop 1–2 reps before failure unless otherwise noted.
                </Text>
              </View>
            </View>
          </View>

          {/* Video button */}
          <TouchableOpacity
            className="mb-4 h-11 flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)]"
            activeOpacity={0.9}
            onPress={() => {
              // Later: open exercise.videoUrl when available
            }}
          >
            <Ionicons
              name="play-circle"
              size={20}
              color="#050816"
            />
            <Text className="ml-2 text-sm font-bold text-[#050816]">
              View demo video
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
