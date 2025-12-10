import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  type Program,
  type ProgramDay,
  type ProgramExercise,
  type ProgramSetSchema,
} from "../lib/mockPrograms";
import { useProgramStore } from "../lib/ProgramStoreContext";

type WorkoutDayParams = {
  programId?: string;
  dayId?: string;
};

type CompletedMap = Record<string, boolean>;

type UpNextInfo = {
  exerciseName: string;
  setLabel: string;
  targetReps: string;
};

function findProgramAndDay(
  programs: Program[],
  programId?: string,
  dayId?: string
): { program: Program; day: ProgramDay } {
  const program =
    (programId && programs.find((p) => p.id === programId)) ||
    programs[0];

  const day =
    (dayId && program.days.find((d) => d.id === dayId)) ||
    program.days[0];

  return { program, day };
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

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m > 0) {
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return `0:${s.toString().padStart(2, "0")}`;
}

export default function WorkoutDayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<WorkoutDayParams>();
  const { programs, completeWorkoutDay } = useProgramStore();

  const { program, day } = findProgramAndDay(
    programs,
    params.programId,
    params.dayId
  );

  const [completedSets, setCompletedSets] = useState<CompletedMap>({});

  // Overall workout session status
  const [workoutStatus, setWorkoutStatus] = useState<
    "not-started" | "in-progress" | "paused" | "completed"
  >("not-started");

  // 🔥 Rest timer state
  const [activeRestKey, setActiveRestKey] = useState<string | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restPaused, setRestPaused] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const [restFinished, setRestFinished] = useState(false);
  const [restAcknowledged, setRestAcknowledged] = useState(false);  
  const [upNext, setUpNext] = useState<UpNextInfo | null>(null);
  const [nextSetKey, setNextSetKey] = useState<string | null>(null);

  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restAlertLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // For completion button state
  const [isCompleting, setIsCompleting] = useState(false);

  // Flatten all sets so we can figure out "up next" and progress easily
  const allSets = useMemo(
    () =>
      day.exercises.flatMap((ex) =>
        ex.sets.map((set, index) => ({
          key: `${ex.id}-${set.id}-${index}`,
          exercise: ex,
          set,
          index,
        }))
      ),
    [day]
  );

  const totalSets = allSets.length;
  const completedCount = allSets.filter((s) => completedSets[s.key]).length;
  const progress = totalSets > 0 ? completedCount / totalSets : 0;
  const allCompleted = totalSets > 0 && completedCount === totalSets;

  const stopRestNotifications = useCallback(async () => {
    if (restAlertLoopRef.current) {
      clearInterval(restAlertLoopRef.current);
      restAlertLoopRef.current = null;
    }
    Vibration.cancel();

    try {
      await soundRef.current?.stopAsync();
    } catch {
      // noop
    }
  }, []);

  const unloadRestSound = useCallback(async () => {
    try {
      await soundRef.current?.unloadAsync();
    } catch {
      // noop
    }
    soundRef.current = null;
  }, []);

  const triggerRestAlert = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );

    if (!soundRef.current) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/rest-complete.wav")
        );
        soundRef.current = sound;
    } catch {
        return;
      }
    }

    try {
      await soundRef.current.replayAsync();
    } catch {
      // noop
    }
  }, []);

  const startRestNotifications = useCallback(() => {
    triggerRestAlert();
    Vibration.vibrate([0, 500, 500], true);

    if (!restAlertLoopRef.current) {
      restAlertLoopRef.current = setInterval(() => {
        triggerRestAlert();
      }, 2500);
    }
  }, [triggerRestAlert]);

  // ⏱ Timer effect – counts down once per second when resting
  useEffect(() => {
    if (!isResting || restPaused || restFinished) return;

    const id = setInterval(() => {
      setRestRemaining((prev) => {
        if (prev <= 1) {
          setRestFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    restIntervalRef.current = id;

    return () => {
      clearInterval(id);
      if (restIntervalRef.current === id) {
        restIntervalRef.current = null;
      }
    };
  }, [isResting, restPaused, restFinished]);

  // Trigger repeating alerts when rest finishes until acknowledged
  useEffect(() => {
    if (
      isResting &&
      restFinished &&
      !restAcknowledged &&
      !restPaused &&
      workoutStatus !== "paused"
    ) {
      startRestNotifications();
    } else {
      stopRestNotifications();
    }

    return () => {
      stopRestNotifications();
    };
  }, [
    isResting,
    restFinished,
    restAcknowledged,
    restPaused,
    workoutStatus,
    startRestNotifications,
    stopRestNotifications,
  ]);

  const acknowledgeRest = () => {
    setRestAcknowledged(true);
    setIsResting(false);
    setRestPaused(false);
    stopRestNotifications();
  };

  const startRest = (
    key: string,
    exercise: ProgramExercise,
    set: ProgramSetSchema,
    index: number
  ) => {
    if (workoutStatus === "not-started" || workoutStatus === "paused") {
      setWorkoutStatus("in-progress");
    }

    // Prefer numeric restSeconds if available; otherwise parse string
    const fromNumeric = set.restSeconds;
    const parsed = parseRestStringToSeconds(set.rest);
    const seconds =
      (typeof fromNumeric === "number" && fromNumeric > 0
        ? fromNumeric
        : parsed) ?? 60;

    setActiveRestKey(key);
    setIsResting(true);
    setRestPaused(false);
    setRestFinished(false);
    setRestAcknowledged(false);    
    setRestRemaining(seconds);
    setRestTotal(seconds);

    // Figure out the "up next" set
    const flatIndex = allSets.findIndex((s) => s.key === key);
    const next = allSets[flatIndex + 1];

    if (next) {
      setUpNext({
        exerciseName: next.exercise.name,
        setLabel: next.set.label || `Set ${next.index + 1}`,
        targetReps: next.set.targetReps,
      });
      setNextSetKey(next.key);
    } else {
      setUpNext({
        exerciseName: exercise.name,
        setLabel: "Session almost done",
        targetReps: "No more sets after this",
      });
      setNextSetKey(null);
    }
  };

  const clearRest = useCallback(() => {
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    stopRestNotifications();
    setRestFinished(false);
    setRestPaused(false);
    setRestAcknowledged(true);    
    setIsResting(false);
    setRestRemaining(0);
    setRestTotal(0);
    setActiveRestKey(null);
    setUpNext(null);
    setNextSetKey(null);
  }, [stopRestNotifications]);

  useEffect(() => {
    return () => {
      clearRest();
      stopRestNotifications();
      unloadRestSound();
    };
  }, [clearRest, stopRestNotifications, unloadRestSound]);

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

  const handleSetPress = (
    key: string,
    exercise: ProgramExercise,
    set: ProgramSetSchema,
    index: number
  ) => {
    setCompletedSets((prev) => {
      const nextCompleted = !prev[key];
      const updated: CompletedMap = {
        ...prev,
        [key]: nextCompleted,
      };

      if (workoutStatus === "not-started") {
        setWorkoutStatus("in-progress");
      }

      // When we mark a set as done → start rest
      if (nextCompleted) {
        startRest(key, exercise, set, index);
      } else {
        // If we uncheck the set that is currently resting → stop rest
        if (activeRestKey === key) {
          clearRest();
        }
      }

      return updated;
    });
  };

  const restProgress =
    !isResting || restTotal <= 0
      ? 0
      : (restTotal - restRemaining) / restTotal;

  const startWorkout = () => setWorkoutStatus("in-progress");
  const pauseWorkout = () => {
    setWorkoutStatus("paused");
    setRestPaused(true);
    stopRestNotifications();
  };
  const resumeWorkout = () => {
    setWorkoutStatus("in-progress");
    if (!restFinished) {
      setRestPaused(false);
    }
  };

  const markAllCompleted = async () => {
    if (!allCompleted) {
      Alert.alert(
        "Finish your sets",
        "Log every set before marking the workout completed."
      );
      return;
    }

    try {
      setIsCompleting(true);
      clearRest();
      setWorkoutStatus("completed");

      // Vibrate a bit on completion
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});

      await Promise.resolve(
        completeWorkoutDay(program.id, day.id)
      );

      // Tiny UX feedback
      Alert.alert("Nice work 💪", "Workout marked as completed.");

      router.replace({
        pathname: "/program-details",
        params: { programId: program.id },
      });
    } catch (e) {
      console.error("Error completing workout", e);
      Alert.alert(
        "Something went wrong",
        "We couldn't mark the workout completed. Please try again."
      );      
      setIsCompleting(false);
    } finally {
      setIsCompleting(false);
      stopRestNotifications();
    }
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

            {/* Workout controls */}
            <View className="mt-4 flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Status
                </Text>
                <Text className="mt-1 text-sm font-semibold text-slate-50">
                  {workoutStatus === "not-started"
                    ? "Not started"
                    : workoutStatus === "paused"
                      ? "Paused"
                      : workoutStatus === "completed"
                        ? "Completed"
                        : "In progress"}
                </Text>
              </View>

              {workoutStatus !== "completed" && (
                <View className="flex-row gap-2">
                  {workoutStatus === "in-progress" ? (
                    <TouchableOpacity
                      className="h-9 items-center justify-center rounded-full bg-white/10 px-3"
                      activeOpacity={0.85}
                      onPress={pauseWorkout}
                    >
                      <Text className="text-[11px] font-semibold text-slate-100">
                        Pause
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="h-9 items-center justify-center rounded-full bg-[#0df20d]/10 px-3"
                      activeOpacity={0.85}
                      onPress={
                        workoutStatus === "paused" ? resumeWorkout : startWorkout
                      }
                    >
                      <Text className="text-[11px] font-semibold text-[#0df20d]">
                        {workoutStatus === "paused"
                          ? "Resume"
                          : "Start"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>            
          </View>

          {/* Rest timer card (only visible while resting) */}
          {isResting && restTotal > 0 && (
            <View className="mb-5 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-4">
              <View className="mb-2 flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Rest timer
                  </Text>
                  <Text className="mt-1 text-2xl font-bold text-emerald-100">
                    {restFinished ? "0:00" : formatSeconds(restRemaining)}
                  </Text>
                  <Text className="mt-1 text-[11px] text-emerald-100/80">
                    {restFinished
                      ? "Time's up — acknowledge to stop alerts."
                      : restPaused
                        ? "Rest paused. Resume when you're ready."
                        : "Breathe, shake it out, get ready for the next set."}
                  </Text>
                </View>

                <View className="items-end gap-2">
                  <TouchableOpacity
                    className="h-8 items-center justify-center rounded-full bg-white/10 px-3"
                    activeOpacity={0.85}
                    onPress={() => setRestPaused((prev) => !prev)}
                  >
                    <Text className="text-[11px] font-semibold text-emerald-100">
                      {restPaused ? "Resume timer" : "Pause timer"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-8 items-center justify-center rounded-full bg-white/10 px-3"
                    activeOpacity={0.85}
                    onPress={clearRest}
                  >
                    <Text className="text-[11px] font-semibold text-emerald-100">
                      Skip rest
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Rest progress bar */}
              <View className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/20">
                <View
                  className="h-1.5 rounded-full bg-emerald-400"
                  style={{ width: `${restProgress * 100}%` }}
                />
              </View>

              {restFinished && (
                <View className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-600/10 p-3">
                  <Text className="text-sm font-semibold text-emerald-50">
                    Rest finished
                  </Text>
                  <Text className="mt-1 text-xs text-emerald-100/80">
                    Alerts will repeat until you confirm.
                  </Text>
                  <TouchableOpacity
                    className="mt-3 h-9 items-center justify-center rounded-full bg-emerald-400"
                    activeOpacity={0.9}
                    onPress={acknowledgeRest}
                  >
                    <Text className="text-sm font-semibold text-emerald-950">
                      Got it
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {upNext && (
                <View className="mt-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/90">
                    Up next
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-emerald-50">
                    {upNext.exerciseName}
                  </Text>
                  <Text className="text-xs text-emerald-100/80">
                    {upNext.setLabel} · {upNext.targetReps}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Exercises list */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-50">
              Exercises
            </Text>
            <Text className="mt-1 text-xs text-zinc-500">
              Tap an exercise to view technique details. Mark each set
              done to trigger your rest timer.
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

                  // Highlight this as the "ready" set when rest has finished
                  const isNextHighlight =
                    !isDone &&
                    (!isResting || restFinished) &&
                    nextSetKey != null &&
                    key === nextSetKey;

                  return (
                    <View
                      key={key}
                      className={`mb-2 flex-row items-center justify-between ${
                        isNextHighlight
                          ? "rounded-xl border border-[#0df20d] bg-[#0df20d]/10"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center gap-3 px-1 py-1">
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
                          {isNextHighlight && (
                            <Text className="mt-0.5 text-[11px] font-semibold text-[#0df20d]">
                              Ready — this is your next set
                            </Text>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        className={`h-7 min-w-[88px] items-center justify-center rounded-full border ${
                          isDone
                            ? "border-[#0df20d] bg-[#0df20d]"
                            : "border-white/30 bg-transparent"
                        }`}
                        activeOpacity={0.85}
                        onPress={() =>
                          handleSetPress(key, exercise, set, index)
                        }
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

        {/* Sticky footer button — ONLY when all sets are done */}
        {allCompleted && (
          <View className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent px-4 pb-6 pt-4">
            <TouchableOpacity
              className="pointer-events-auto h-12 flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)] shadow-[0_0_20px_rgba(13,242,13,0.5)]"
              activeOpacity={0.9}
              onPress={markAllCompleted}
              disabled={isCompleting}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#050816"
              />
              <Text className="ml-2 text-sm font-bold text-[#050816]">
                {isCompleting
                  ? "Finishing..."
                  : "Mark workout completed"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
