import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 160,
          paddingHorizontal: 20,
        }}
      >
        {/* ===== Header ===== */}
        <View className="mb-6">
          <Text className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
            Programs
          </Text>
          <Text className="mt-2 text-[32px] font-bold text-slate-100">
            Workouts
          </Text>
        </View>

        {/* ===== Today section ===== */}
        <View>
          <Text className="mb-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wide">
            Today
          </Text>

          <View className="rounded-3xl bg-slate-900/90 border border-slate-800 px-5 py-6">
            <View className="mb-5">
              <Text className="text-[15px] font-semibold text-slate-100">
                Today’s Workout
              </Text>
              <Text className="mt-1 text-[13px] text-slate-400">
                Week 3 · Day 2 – Upper Body
              </Text>
            </View>

            <View className="mb-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[13px] font-medium text-slate-300">
                  Not started
                </Text>
                <Text className="text-[11px] font-medium text-slate-400">
                  0 / 12 exercises
                </Text>
              </View>

              <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <View
                  className="h-1.5 rounded-full bg-lime-400"
                  style={{ width: "0%" }}
                />
              </View>
            </View>

            <TouchableOpacity
              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full bg-lime-400 shadow-xl shadow-lime-400/30"
              onPress={() => router.push("/workout-day")}
            >
              <Ionicons name="play" size={18} color="#020617" />
              <Text className="text-[14px] font-bold text-slate-950">
                Start workout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Filters section ===== */}
        <View className="mt-8">
          <Text className="mb-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wide">
            Filter programs
          </Text>

          <View className="flex-row items-center justify-between gap-3">
            <TouchableOpacity className="flex-1 rounded-full bg-slate-900 py-2.5">
              <Text className="text-center text-[12px] font-medium text-slate-200">
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 rounded-full bg-lime-400 py-2.5 shadow shadow-lime-400/50">
              <Text className="text-center text-[12px] font-semibold text-slate-950">
                Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 rounded-full bg-slate-900 py-2.5">
              <Text className="text-center text-[12px] font-medium text-slate-200">
                Upcoming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 rounded-full bg-slate-900 py-2.5">
              <Text className="text-center text-[12px] font-medium text-slate-200">
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Coach programs section ===== */}
        <View className="mt-10">
          <View className="mb-3">
            <Text className="text-[14px] font-semibold text-slate-100">
              Coach programs
            </Text>
            <Text className="mt-1 text-[11px] text-slate-500">
              Assigned by your trainer
            </Text>
          </View>

          <TouchableOpacity className="rounded-3xl bg-slate-900/90 border border-slate-800 px-5 py-5" activeOpacity={0.9} onPress={() => router.push("/program-details")}>
            <View className="mb-4">
              <Text className="text-[15px] font-bold text-white">
                Hypertrophy Phase 1
              </Text>
              <Text className="mt-1 text-[12px] text-slate-400">
                4 days/week · Strength &amp; Hypertrophy
              </Text>
              <Text className="mt-0.5 text-[11px] text-slate-500">
                by Alex Johnson
              </Text>
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row justify-between">
                <Text className="text-[12px] font-medium text-slate-300">
                  Week 3 of 12
                </Text>
                <Text className="text-[12px] font-semibold text-lime-400">
                  25%
                </Text>
              </View>

              <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <View
                  className="h-1.5 rounded-full bg-lime-400"
                  style={{ width: "25%" }}
                />
              </View>
            </View>

            <View className="self-start rounded-full bg-lime-400/15 px-3 py-1">
              <Text className="text-[11px] font-medium text-lime-400">
                Active
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ===== My programs section ===== */}
        <View className="mt-10 mb-4">
          {/* Header row */}
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[14px] font-semibold text-slate-100">
                My programs
              </Text>
              <Text className="mt-1 text-[11px] text-slate-500">
                Programs you’ve created
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/new-program")}>
              <Text className="text-[12px] font-semibold text-lime-400">
                New program
              </Text>
            </TouchableOpacity>
          </View>

          {/* Personal program card */}
          <TouchableOpacity className="mb-4 rounded-3xl bg-slate-900/90 border border-slate-800 px-5 py-5" activeOpacity={0.9} onPress={() => router.push("/program-details")} >
            <View className="mb-4">
              <Text className="text-[15px] font-bold text-white">
                Total Body Shred
              </Text>
              <Text className="mt-1 text-[12px] text-slate-400">
                3 days/week · Full body
              </Text>
              <Text className="mt-0.5 text-[11px] text-slate-500">
                Created by you
              </Text>
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row justify-between">
                <Text className="text-[12px] font-medium text-slate-300">
                  Week 1 of 8
                </Text>
                <Text className="text-[12px] font-semibold text-lime-400">
                  12%
                </Text>
              </View>

              <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <View
                  className="h-1.5 rounded-full bg-lime-400"
                  style={{ width: "12%" }}
                />
              </View>
            </View>

            <View className="self-start rounded-full bg-amber-500/20 px-3 py-1">
              <Text className="text-[11px] font-medium text-amber-300">
                Draft
              </Text>
            </View>
          </TouchableOpacity>

          {/* Empty-state card */}
          <View className="items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 px-6 py-7">
            <Ionicons name="barbell" size={36} color="#4b5563" />

            <Text className="mt-3 text-center text-[15px] font-semibold text-slate-100">
              You haven’t created any programs yet.
            </Text>
            <Text className="mt-1 text-center text-[11px] text-slate-500">
              Start by creating your first custom plan.
            </Text>

            <TouchableOpacity
              className="mt-4 h-11 flex-row items-center justify-center rounded-full bg-lime-400 px-6 shadow-lg shadow-lime-400/30"
              onPress={() => router.push("/new-program")}
            >
              <Ionicons name="add" size={18} color="#020617" />
              <Text className="ml-2 text-[13px] font-bold text-slate-950">
                Create your first program
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity
        className="absolute bottom-7 right-5 h-14 w-14 items-center justify-center rounded-full bg-lime-400 shadow-lg shadow-lime-400/40"
        onPress={() => router.push("/new-program")}
      >
        <Ionicons name="add" size={26} color="#020617" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
