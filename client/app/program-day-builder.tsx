import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";
import type {
    Program,
    ProgramDay,
    ProgramExercise,
    ProgramSetSchema,
} from "../lib/mockPrograms";

type Params = {
  programId?: string;
  dayId?: string;
};

const EXERCISE_LIBRARY: Pick<ProgramExercise, "name" | "muscleGroup" | "equipment">[] = [
  {
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest / Shoulders",
    equipment: "Dumbbells",
  },
  {
    name: "Lat Pulldown",
    muscleGroup: "Back",
    equipment: "Cable",
  },
  {
    name: "Seated Row",
    muscleGroup: "Back",
    equipment: "Machine",
  },
  {
    name: "Back Squat",
    muscleGroup: "Legs",
    equipment: "Barbell",
  },
  {
    name: "Romanian Deadlift",
    muscleGroup: "Hamstrings / Glutes",
    equipment: "Barbell / Dumbbells",
  },
  {
    name: "Shoulder Press",
    muscleGroup: "Shoulders",
    equipment: "Dumbbells / Machine",
  },
];

const REP_PRESETS = [
  "5 reps",
  "6–8 reps",
  "8–10 reps",
  "10–12 reps",
  "12–15 reps",
];

const RPE_PRESETS = ["RPE 6", "RPE 7", "RPE 8", "RPE 9"];

const REST_PRESETS = [30, 60, 90, 120];

function cloneDay(day: ProgramDay): ProgramDay {
  return {
    ...day,
    exercises: day.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({ ...s })),
    })),
  };
}

function parseRestStringToSeconds(rest?: string): number | null {
  if (!rest) return null;
  const match = rest.match(
    /(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes)?/i
  );
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = (match[2] || "s").toLowerCase();

  if (unit.startsWith("m")) {
    return value * 60;
  }
  return value;
}

export default function ProgramDayBuilderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const { programs, updateProgramDays } = useProgramStore();

  const program: Program =
    (params.programId &&
      programs.find((p) => p.id === params.programId)) ||
    programs[programs.length - 1] ||
    programs[0];

  const baseDay =
    (params.dayId &&
      program.days.find((d) => d.id === params.dayId)) ||
    program.days[0];

  const [draftDay, setDraftDay] = useState<ProgramDay>(() =>
    cloneDay(baseDay)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftDay(cloneDay(baseDay));
  }, [baseDay.id]);

  const weekLabel = useMemo(
    () => `Week ${draftDay.weekIndex}, Day ${draftDay.dayIndex}`,
    [draftDay.weekIndex, draftDay.dayIndex]
  );

  const handleChangeTitle = (value: string) => {
    setDraftDay((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleChangeSubtitle = (value: string) => {
    setDraftDay((prev) => ({
      ...prev,
      subtitle: value,
    }));
  };

  const handleChangeFocus = (value: string) => {
    setDraftDay((prev) => ({
      ...prev,
      focus: value,
    }));
  };

  const handleAddExercise = (
    preset?: (typeof EXERCISE_LIBRARY)[number]
  ) => {
    const newExercise: ProgramExercise = {
      id: `${draftDay.id}-ex-${Date.now()}`,
      name: preset?.name ?? "New exercise",
      muscleGroup: preset?.muscleGroup ?? "Custom",
      equipment: preset?.equipment ?? "Any",
      notes: "",
      sets: [
        {
          id: "s1",
          label: "Set 1",
          targetReps: "8–12 reps",
          rpe: "RPE 7–8",
          rest: "Rest 90s",
          restSeconds: 90,
        },
      ],
    };

    setDraftDay((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setDraftDay((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const handleMoveExercise = (
    exerciseId: string,
    direction: "up" | "down"
  ) => {
    setDraftDay((prev) => {
      const idx = prev.exercises.findIndex((ex) => ex.id === exerciseId);
      if (idx === -1) return prev;

      const targetIndex =
        direction === "up" ? idx - 1 : idx + 1;

      if (targetIndex < 0 || targetIndex >= prev.exercises.length) {
        return prev;
      }

      const arr = [...prev.exercises];
      const temp = arr[idx];
      arr[idx] = arr[targetIndex];
      arr[targetIndex] = temp;

      return { ...prev, exercises: arr };
    });
  };

  const handleUpdateExercise = (
    exerciseId: string,
    patch: Partial<ProgramExercise>
  ) => {
    setDraftDay((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...patch } : ex
      ),
    }));
  };

  const handleUpdateSet = (
    exerciseId: string,
    setIndex: number,
    patch: Partial<ProgramSetSchema>
  ) => {
    setDraftDay((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const sets = ex.sets.map((s, idx) =>
          idx === setIndex ? { ...s, ...patch } : s
        );
        return { ...ex, sets };
      }),
    }));
  };

  const handleAddSet = (exerciseId: string) => {
    setDraftDay((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const last = ex.sets[ex.sets.length - 1];
        const newIndex = ex.sets.length + 1;

        const newSet: ProgramSetSchema = last
          ? {
              ...last,
              id: `s${newIndex}`,
              label: `Set ${newIndex}`,
            }
          : {
              id: `s${newIndex}`,
              label: `Set ${newIndex}`,
              targetReps: "8–12 reps",
              rpe: "RPE 7–8",
              rest: "Rest 90s",
              restSeconds: 90,
            };

        return {
          ...ex,
          sets: [...ex.sets, newSet],
        };
      }),
    }));
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setDraftDay((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        if (ex.sets.length <= 1) return ex; // keep at least 1
        const sets = ex.sets.filter((_, idx) => idx !== setIndex);
        return { ...ex, sets };
      }),
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      const updatedDays = program.days.map((day) =>
        day.id === draftDay.id
          ? {
              ...draftDay,
              exercises: draftDay.exercises.map((ex) => ({
                ...ex,
                sets: ex.sets.map((s) => ({
                  ...s,
                  restSeconds:
                    s.restSeconds ??
                    parseRestStringToSeconds(s.rest ?? undefined) ??
                    60,
                })),
              })),
            }
          : day
      );

      updateProgramDays(program.id, updatedDays);

      router.replace({
        pathname: "/new-program-builder",
        params: { programId: program.id },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full bg.white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text className="flex-1 px-2 text-center text-base font-semibold text-slate-100">
            Edit day
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
          {/* Day header / meta */}
          <View className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {weekLabel}
            </Text>
            <TextInput
              value={draftDay.title}
              onChangeText={handleChangeTitle}
              placeholder="Day title"
              placeholderTextColor="#6b7280"
              className="mt-2 text-lg font-bold text-slate-50"
            />
            <TextInput
              value={draftDay.subtitle}
              onChangeText={handleChangeSubtitle}
              placeholder="Subtitle (e.g. Push focus, Heavy compounds)"
              placeholderTextColor="#6b7280"
              className="mt-1 text-sm text-zinc-300"
            />
            <TextInput
              value={draftDay.focus}
              onChangeText={handleChangeFocus}
              placeholder="Focus (e.g. Chest & triceps, Strength, Volume)"
              placeholderTextColor="#6b7280"
              className="mt-2 rounded-xl bg-black/30 px-3 py-2 text-xs text-zinc-300"
            />
          </View>

          {/* Exercises list */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-50">
              Exercises
            </Text>
            <Text className="mt-1 text-xs text-zinc-500">
              Reorder, tweak sets or add new movements.
            </Text>
          </View>

          {draftDay.exercises.length === 0 ? (
            <View className="mb-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4">
              <Text className="text-sm text-zinc-300">
                No exercises yet. Add one from the quick picks below or create a
                custom exercise.
              </Text>
            </View>
          ) : (
            draftDay.exercises.map((exercise, exIndex) => (
              <View
                key={exercise.id}
                className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                {/* Exercise header */}
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Exercise {exIndex + 1}
                    </Text>
                    <TextInput
                      value={exercise.name}
                      onChangeText={(value) =>
                        handleUpdateExercise(exercise.id, {
                          name: value,
                        })
                      }
                      placeholder="Exercise name"
                      placeholderTextColor="#6b7280"
                      className="mt-1 text-sm font-semibold text-slate-50"
                    />
                    <View className="mt-1 flex-row gap-2">
                      <View className="flex-1">
                        <Text className="pb-1 text-[11px] text-zinc-400">
                          Muscle group
                        </Text>
                        <TextInput
                          value={exercise.muscleGroup}
                          onChangeText={(value) =>
                            handleUpdateExercise(exercise.id, {
                              muscleGroup: value,
                            })
                          }
                          placeholder="e.g. Chest, Back, Legs"
                          placeholderTextColor="#6b7280"
                          className="h-9 rounded-lg bg-black/30 px-3 text-xs text-slate-100"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="pb-1 text-[11px] text-zinc-400">
                          Equipment
                        </Text>
                        <TextInput
                          value={exercise.equipment}
                          onChangeText={(value) =>
                            handleUpdateExercise(exercise.id, {
                              equipment: value,
                            })
                          }
                          placeholder="e.g. Barbell, Dumbbells, Machine"
                          placeholderTextColor="#6b7280"
                          className="h-9 rounded-lg bg-black/30 px-3 text-xs text-slate-100"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="items-end gap-1">
                    <View className="flex-row gap-1">
                      <TouchableOpacity
                        onPress={() =>
                          handleMoveExercise(exercise.id, "up")
                        }
                        className="h-7 w-7 items-center justify-center rounded-full bg-white/10"
                      >
                        <Ionicons
                          name="chevron-up"
                          size={16}
                          color="#e5e7eb"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleMoveExercise(exercise.id, "down")
                        }
                        className="h-7 w-7 items-center justify-center rounded-full bg-white/10"
                      >
                        <Ionicons
                          name="chevron-down"
                          size={16}
                          color="#e5e7eb"
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(exercise.id)}
                      className="mt-1 h-7 w-7 items-center justify-center rounded-full bg-white/5"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#fca5a5"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Sets editor */}
                <View className="mt-2 rounded-2xl bg-black/40 p-3">
                  {exercise.sets.map((set, setIndex) => (
                    <View
                      key={`${exercise.id}-${set.id}-${setIndex}`}
                      className="mb-3 rounded-2xl border border-white/10 bg-black/40 p-3"
                    >
                      <View className="mb-2 flex-row items-center justify-between">
                        <Text className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          {set.label || `Set ${setIndex + 1}`}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveSet(exercise.id, setIndex)
                          }
                          disabled={exercise.sets.length <= 1}
                          className={`h-7 w-7 items-center justify-center rounded-full ${
                            exercise.sets.length <= 1
                              ? "bg-white/5"
                              : "bg-white/10"
                          }`}
                        >
                          <Ionicons
                            name="remove"
                            size={14}
                            color={
                              exercise.sets.length <= 1
                                ? "#4b5563"
                                : "#fca5a5"
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Target reps */}
                      <View className="mb-2">
                        <Text className="pb-1 text-[11px] text-zinc-400">
                          Target reps
                        </Text>
                        <View className="mb-1 flex-row flex-wrap gap-1">
                          {REP_PRESETS.map((preset) => (
                            <TouchableOpacity
                              key={preset}
                              onPress={() =>
                                handleUpdateSet(
                                  exercise.id,
                                  setIndex,
                                  { targetReps: preset }
                                )
                              }
                              className={`rounded-full border px-2 py-1 ${
                                set.targetReps === preset
                                  ? "border-lime-400 bg-lime-400/20"
                                  : "border-white/10 bg-black/40"
                              }`}
                            >
                              <Text className="text-[10px] text-slate-100">
                                {preset}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TextInput
                          value={set.targetReps}
                          onChangeText={(value) =>
                            handleUpdateSet(exercise.id, setIndex, {
                              targetReps: value,
                            })
                          }
                          placeholder="e.g. 8–10 reps"
                          placeholderTextColor="#6b7280"
                          className="h-9 rounded-lg border border-white/15 bg-black/40 px-3 text-xs text-slate-100"
                        />
                      </View>

                      {/* RPE + Rest */}
                      <View className="flex-row gap-2">
                        <View className="flex-1">
                          <Text className="pb-1 text-[11px] text-zinc-400">
                            RPE
                          </Text>
                          <View className="mb-1 flex-row flex-wrap gap-1">
                            {RPE_PRESETS.map((preset) => (
                              <TouchableOpacity
                                key={preset}
                                onPress={() =>
                                  handleUpdateSet(
                                    exercise.id,
                                    setIndex,
                                    { rpe: preset }
                                  )
                                }
                                className={`rounded-full border px-2 py-1 ${
                                  set.rpe === preset
                                    ? "border-lime-400 bg-lime-400/20"
                                    : "border-white/10 bg-black/40"
                                }`}
                              >
                                <Text className="text-[10px] text-slate-100">
                                  {preset}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                          <TextInput
                            value={set.rpe ?? ""}
                            onChangeText={(value) =>
                              handleUpdateSet(exercise.id, setIndex, {
                                rpe: value,
                              })
                            }
                            placeholder="e.g. RPE 8"
                            placeholderTextColor="#6b7280"
                            className="h-9 rounded-lg border border-white/15 bg-black/40 px-3 text-xs text-slate-100"
                          />
                        </View>

                        <View className="flex-1">
                          <Text className="pb-1 text-[11px] text-zinc-400">
                            Rest
                          </Text>
                          <View className="mb-1 flex-row flex-wrap gap-1">
                            {REST_PRESETS.map((secs) => {
                              const label = `${secs}s`;
                              const currentSeconds =
                                set.restSeconds ??
                                parseRestStringToSeconds(set.rest ?? undefined);

                              const selected = currentSeconds === secs;

                              return (
                                <TouchableOpacity
                                  key={secs}
                                  onPress={() =>
                                    handleUpdateSet(
                                      exercise.id,
                                      setIndex,
                                      {
                                        rest: `Rest ${label}`,
                                        restSeconds: secs,
                                      }
                                    )
                                  }
                                  className={`rounded-full border px-2 py-1 ${
                                    selected
                                      ? "border-lime-400 bg-lime-400/20"
                                      : "border-white/10 bg-black/40"
                                  }`}
                                >
                                  <Text className="text-[10px] text-slate-100">
                                    {label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <TextInput
                            value={set.rest ?? ""}
                            onChangeText={(value) =>
                              handleUpdateSet(exercise.id, setIndex, {
                                rest: value,
                                restSeconds:
                                  parseRestStringToSeconds(value) ??
                                  set.restSeconds,
                              })
                            }
                            placeholder="e.g. Rest 90s"
                            placeholderTextColor="#6b7280"
                            className="h-9 rounded-lg border border-white/15 bg-black/40 px-3 text-xs text-slate-100"
                          />
                        </View>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => handleAddSet(exercise.id)}
                    className="mt-1 flex-row items-center gap-2 rounded-xl border border-dashed border-lime-500/60 bg-lime-500/10 px-3 py-2"
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={18}
                      color="#a3e635"
                    />
                    <Text className="text-xs font-semibold text-lime-300">
                      Add set
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Quick add exercises */}
          <View className="mb-2">
            <Text className="mb-2 text-sm font-semibold text-slate-50">
              Quick add
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row gap-2">
                {EXERCISE_LIBRARY.map((preset) => (
                  <TouchableOpacity
                    key={preset.name}
                    onPress={() => handleAddExercise(preset)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
                    activeOpacity={0.9}
                  >
                    <Text className="text-xs text-slate-100">
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={() => handleAddExercise()}
            className="mt-2 mb-4 flex-row items-center gap-2 rounded-xl border-2 border-dashed border-slate-700 p-4"
            activeOpacity={0.9}
          >
            <Ionicons name="add-circle" size={24} color="#0df20d" />
            <Text className="text-base font-semibold text-[#0df20d]">
              Add custom exercise
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom actions */}
        <View className="border-t border-white/10 bg-[#050816]/95 px-4 pb-6 pt-4">
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={isSaving}
            className={`h-12 flex-row items-center justify-center rounded-xl ${
              isSaving
                ? "bg-lime-500/60"
                : "bg-[rgb(13,242,13)] shadow-[0_0_20px_rgba(13,242,13,0.5)]"
            }`}
            onPress={handleSave}
          >
            <Text className="text-sm font-bold text-[#050816]">
              {isSaving ? "Saving..." : "Save day & back to builder"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
