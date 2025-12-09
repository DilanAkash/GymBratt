import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

const WEEKS = [1, 2, 3, 4, 5];

const DAYS = [
  {
    id: "day1",
    title: "Day 1 – Push",
    subtitle: "Chest, Shoulders, Triceps",
    exercises: 6,
  },
  {
    id: "day2",
    title: "Day 2 – Pull",
    subtitle: "Back, Biceps",
    exercises: 5,
  },
  {
    id: "day3",
    title: "Day 3 – Rest",
    subtitle: "Recovery Day",
    exercises: null,
  },
  {
    id: "day4",
    title: "Day 4 – Legs",
    subtitle: "Quads, Hamstrings, Calves",
    exercises: 7,
  },
];

export default function ProgramBuilderScreen() {
  const router = useRouter();
  const [activeWeek, setActiveWeek] = useState<number>(1);

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-slate-800 bg-[#050816]/90 px-4 pb-3 pt-4">
        <View className="mb-3 flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="text-base font-bold text-[#0df20d]">
              Save Draft
            </Text>
          </TouchableOpacity>
        </View>

        <View className="pl-1">
          <Text className="text-[28px] font-bold leading-tight text-slate-100">
            Build Program
          </Text>
          <Text className="mt-1 text-base text-slate-400">
            Push/Pull/Legs Split
          </Text>
        </View>
      </View>

      {/* Week selector */}
      <View className="border-b border-slate-800 bg-[#050816]/90 pb-3 pt-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <View className="flex-row gap-3">
            {WEEKS.map((week) => {
              const selected = week === activeWeek;
              return (
                <TouchableOpacity
                  key={week}
                  onPress={() => setActiveWeek(week)}
                  className={`h-10 items-center justify-center rounded-full px-5 ${
                    selected ? "bg-[#0df20d]" : "bg-slate-700/60"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selected ? "text-black" : "text-slate-200"
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

      {/* Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        >
          {/* Day cards */}
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.id}
              activeOpacity={0.85}
              className="mb-4 flex-row items-center gap-4 rounded-xl border border-slate-600/60 bg-slate-800/50 p-4"
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-slate-100">
                  {day.title}
                </Text>
                <Text className="mt-1 text-sm text-slate-400">
                  {day.subtitle}
                </Text>

                {day.exercises != null && (
                  <View className="mt-3">
                    <View className="inline-flex items-center rounded-full bg-slate-700/60 px-3 py-1">
                      <Text className="text-xs font-medium text-slate-200">
                        {day.exercises} Exercises
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#9ca3af"
              />
            </TouchableOpacity>
          ))}

          {/* Add workout day */}
          <TouchableOpacity className="mt-2 mb-4 flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 p-6">
            <Ionicons name="add-circle" size={24} color={PRIMARY} />
            <Text className="text-base font-semibold text-[#0df20d]">
              Add a workout day
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
