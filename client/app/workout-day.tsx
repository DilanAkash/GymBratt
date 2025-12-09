import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutDayScreen() {
  const router = useRouter();

  const handleExercisePress = (name: string) => {
    // Later we’ll pass more params (id, muscles, etc)
    router.push({
      pathname: "/exercise-details",
      params: { name },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Top app bar */}
      <View className="px-5 pt-4 pb-3 border-b border-white/10 bg-zinc-950">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View className="h-8 items-center justify-center rounded-full bg-lime-400/20 px-4">
            <Text className="text-xs font-medium text-lime-400">≈ 60 min</Text>
          </View>
        </View>

        <Text className="mt-3 text-2xl font-bold text-white">
          Week 3 · Day 2
        </Text>
        <Text className="mt-1 text-sm text-zinc-400">Upper body focus</Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          <View className="px-5 pt-4">
            {/* Summary card */}
            <View className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg">
              <View className="flex-row flex-wrap gap-2">
                {["Chest", "Triceps", "Shoulders"].map((muscle) => (
                  <View
                    key={muscle}
                    className="h-7 items-center justify-center rounded-full bg-white/10 px-3"
                  >
                    <Text className="text-xs font-medium text-white">
                      {muscle}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="mt-4">
                <Text className="text-base font-semibold text-white">
                  Trainer&apos;s note
                </Text>
                <Text className="mt-2 text-sm text-zinc-400">
                  Focus on controlled movements and maintaining proper form,
                  especially on the last few reps of each set. Let&apos;s get
                  it!
                </Text>
              </View>
            </View>

            {/* Exercises title */}
            <Text className="mt-8 text-lg font-bold text-white">
              Exercises
            </Text>

            {/* Exercise card 1 (collapsed) */}
            <View className="mt-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  className="flex-1 pr-3"
                  onPress={() => handleExercisePress("Barbell Bench Press")}
                >
                  <Text className="text-base font-bold text-white">
                    Barbell Bench Press
                  </Text>
                  <Text className="mt-1 text-sm text-zinc-400">
                    3 sets × 8–10 reps
                  </Text>
                </TouchableOpacity>

                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </View>

              <View className="mt-3 flex-row gap-2">
                <View className="h-6 items-center justify-center rounded-full bg-white/10 px-2.5">
                  <Text className="text-xs font-medium text-white">RPE 8</Text>
                </View>
                <View className="h-6 items-center justify-center rounded-full bg-white/10 px-2.5">
                  <Text className="text-xs font-medium text-white">
                    60s rest
                  </Text>
                </View>
              </View>
            </View>

            {/* Exercise card 2 (expanded) */}
            <View className="mt-4 rounded-2xl border border-lime-400/50 bg-slate-900/80 p-4 shadow-lg">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  className="flex-1 pr-3"
                  onPress={() => handleExercisePress("Incline Dumbbell Press")}
                >
                  <Text className="text-base font-bold text-lime-400">
                    Incline Dumbbell Press
                  </Text>
                  <Text className="mt-1 text-sm text-zinc-400">
                    3 sets × 10–12 reps
                  </Text>
                </TouchableOpacity>

                <Ionicons name="chevron-up" size={20} color="#39ff14" />
              </View>

              <View className="mt-3 flex-row gap-2">
                <View className="h-6 items-center justify-center rounded-full bg-lime-400/20 px-2.5">
                  <Text className="text-xs font-medium text-lime-400">
                    RPE 7–8
                  </Text>
                </View>
                <View className="h-6 items-center justify-center rounded-full bg-lime-400/20 px-2.5">
                  <Text className="text-xs font-medium text-lime-400">
                    60s rest
                  </Text>
                </View>
              </View>

              {/* Logging table */}
              <View className="mt-4">
                {/* Header row */}
                <View className="mb-2 flex-row items-center">
                  <View className="w-10 items-center">
                    <Text className="text-[11px] font-medium text-zinc-400">
                      Set
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] font-medium text-zinc-400">
                      Target
                    </Text>
                  </View>
                  <View className="w-14">
                    <Text className="text-center text-[11px] font-medium text-zinc-400">
                      Reps
                    </Text>
                  </View>
                  <View className="w-16">
                    <Text className="text-center text-[11px] font-medium text-zinc-400">
                      Weight
                    </Text>
                  </View>
                  <View className="w-10" />
                </View>

                {[
                  { set: 1, target: "10r @ 50kg", reps: "10", weight: "50" },
                  { set: 2, target: "10r @ 50kg", reps: "10", weight: "50" },
                  { set: 3, target: "12r @ 45kg", reps: "12", weight: "45" },
                ].map((row) => (
                  <View key={row.set} className="mb-2 flex-row items-center">
                    {/* Set number pill */}
                    <View className="w-10 items-center">
                      <View className="h-8 w-8 items-center justify-center rounded-md bg-white/5">
                        <Text className="text-sm font-medium text-white">
                          {row.set}
                        </Text>
                      </View>
                    </View>

                    {/* Target */}
                    <View className="flex-1 pr-2">
                      <Text className="text-xs text-zinc-400">
                        {row.target}
                      </Text>
                    </View>

                    {/* Reps input */}
                    <View className="w-14">
                      <TextInput
                        defaultValue={row.reps}
                        className="h-8 rounded-md bg-white/10 px-2 text-center text-sm text-white"
                        keyboardType="numeric"
                      />
                    </View>

                    {/* Weight input */}
                    <View className="ml-2 w-16">
                      <TextInput
                        defaultValue={row.weight}
                        className="h-8 rounded-md bg-white/10 px-2 text-center text-sm text-white"
                        keyboardType="numeric"
                      />
                    </View>

                    {/* Checkbox (visual only for now) */}
                    <View className="ml-3 w-10 items-center">
                      <View className="h-5 w-5 rounded-full border-2 border-zinc-500" />
                    </View>
                  </View>
                ))}
              </View>

              {/* Add notes */}
              <View className="mt-3 items-center justify-center">
                <TouchableOpacity>
                  <Text className="text-sm font-medium text-lime-400">
                    Add notes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Exercise card 3 (collapsed) */}
            <View className="mt-4 mb-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  className="flex-1 pr-3"
                  onPress={() => handleExercisePress("Tricep Pushdown")}
                >
                  <Text className="text-base font-bold text-white">
                    Tricep Pushdown
                  </Text>
                  <Text className="mt-1 text-sm text-zinc-400">
                    3 sets × 12–15 reps
                  </Text>
                </TouchableOpacity>

              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </View>

              <View className="mt-3 flex-row gap-2">
                <View className="h-6 items-center justify-center rounded-full bg-white/10 px-2.5">
                  <Text className="text-xs font-medium text-white">
                    RPE 9
                  </Text>
                </View>
                <View className="h-6 items-center justify-center rounded-full bg-white/10 px-2.5">
                  <Text className="text-xs font-medium text-white">
                    45s rest
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky footer button */}
        <View className="pointer-events-none absolute bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-gradient-to-t from-zinc-950 to-transparent">
          <TouchableOpacity className="pointer-events-auto h-12 w-full items-center justify-center rounded-xl bg-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.6)]">
            <Text className="text-sm font-bold text-slate-950">
              Mark workout completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
