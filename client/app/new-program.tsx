import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";
import type { Program } from "../lib/mockPrograms";

const GOALS = ["Strength", "Hypertrophy", "Fat Loss", "Endurance"];
const DAYS_OPTIONS = [2, 3, 4, 5, 6];
const EXPERIENCE_OPTIONS: Program["level"][] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function NewProgramScreen() {
  const router = useRouter();
  const { addUserProgram } = useProgramStore();

  const [name, setName] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(3);
  const [selectedExperience, setSelectedExperience] =
    useState<Program["level"]>("Beginner");
  const [weeks, setWeeks] = useState(8);
  const [programType, setProgramType] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decreaseWeeks = () => {
    setWeeks((prev) => Math.max(4, prev - 1));
  };

  const increaseWeeks = () => {
    setWeeks((prev) => Math.min(24, prev + 1));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Please enter a program name.");
      return;
    }
    if (!selectedGoal) {
      setError("Please choose a main goal.");
      return;
    }
    if (!selectedDays) {
      setError("Please select training days per week.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const summary =
        notes.trim() ||
        `Custom ${selectedGoal.toLowerCase()} program, ${selectedDays} days/week for ${weeks} weeks.`;

      const newProgram = addUserProgram({
        name: name.trim(),
        goal: selectedGoal,
        level: selectedExperience,
        daysPerWeek: selectedDays,
        summary,
      });

      router.replace({
        pathname: "/new-program-builder",
        params: { programId: newProgram.id },
      });
    } catch (e) {
      console.error("Error creating program", e);
      setError("Something went wrong. Please try again.");
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
            className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text className="flex-1 px-2 text-center text-base font-semibold text-slate-100">
            New program
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
          {/* Title */}
          <View className="mb-6">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Build your plan
            </Text>
            <Text className="mt-2 text-xl font-bold text-slate-50">
              Program basics
            </Text>
            <Text className="mt-1 text-sm text-zinc-400">
              Start with the core details. You can fine-tune sessions in the
              next step.
            </Text>
          </View>

          {/* Program name */}
          <View className="mb-6">
            <Text className="pb-2 text-sm font-medium text-neutral-300">
              Program name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Lean Bulk 12 Weeks"
              placeholderTextColor="#6b7280"
              className="h-12 rounded-xl border border-white/15 bg-white/5 px-4 text-base text-white"
            />
          </View>

          {/* Goal */}
          <View className="mb-6">
            <Text className="pb-2 text-sm font-medium text-neutral-300">
              Main goal
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {GOALS.map((goal) => {
                const selected = selectedGoal === goal;
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => setSelectedGoal(goal)}
                    className={`rounded-full border px-3 py-1.5 ${
                      selected
                        ? "border-lime-400 bg-lime-400/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selected ? "text-lime-300" : "text-neutral-200"
                      }`}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Experience level */}
          <View className="mb-6">
            <Text className="pb-2 text-sm font-medium text-neutral-300">
              Experience level
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((option) => {
                const selected = selectedExperience === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSelectedExperience(option)}
                    className={`rounded-full border px-3 py-1.5 ${
                      selected
                        ? "border-lime-400 bg-lime-400/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selected ? "text-lime-300" : "text-neutral-200"
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Days per week */}
          <View className="mb-6">
            <Text className="pb-2 text-sm font-medium text-neutral-300">
              Training days per week
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DAYS_OPTIONS.map((d) => {
                const selected = selectedDays === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setSelectedDays(d)}
                    className={`h-9 min-w-[44px] items-center justify-center rounded-full border ${
                      selected
                        ? "border-lime-400 bg-lime-400/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selected ? "text-lime-300" : "text-neutral-200"
                      }`}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Duration */}
          <View className="mb-6">
            <Text className="pb-2 text-sm font-medium text-neutral-300">
              Duration (weeks)
            </Text>
            <View className="relative flex-row items-center">
              <TouchableOpacity
                className="absolute left-2 rounded-full p-1"
                onPress={decreaseWeeks}
              >
                <Ionicons name="remove" size={18} color="#9ca3af" />
              </TouchableOpacity>
              <View className="mx-auto h-11 w-24 items-center justify-center rounded-full border border-white/15 bg-white/5">
                <Text className="text-lg font-semibold text-white">
                  {weeks}
                </Text>
              </View>
              <TouchableOpacity
                className="absolute right-2 rounded-full p-1"
                onPress={increaseWeeks}
              >
                <Ionicons name="add" size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Optional details */}
          <View className="pt-2">
            {/* Program Type */}
            <View className="mb-6">
              <Text className="pb-2 text-sm font-medium text-neutral-300">
                Program type (optional)
              </Text>
              <TextInput
                value={programType}
                onChangeText={setProgramType}
                placeholder="e.g. Push/Pull/Legs, Upper/Lower, Full-body"
                placeholderTextColor="#6b7280"
                className="h-12 rounded-lg border border-white/20 bg-white/5 px-4 text-base text-white"
              />
            </View>

            {/* Description / Notes */}
            <View className="mb-6">
              <Text className="pb-2 text-sm font-medium text-neutral-300">
                Notes (optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special focus, equipment limitations, or notes for future you."
                placeholderTextColor="#6b7280"
                multiline
                textAlignVertical="top"
                className="min-h-[80px] rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white"
              />
            </View>
          </View>

          {error && (
            <View className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2">
              <Text className="text-xs text-red-200">{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View className="border-t border-white/10 bg-[#050816]/95 px-4 pb-6 pt-4">
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={isSaving}
            className={`mb-3 h-12 flex-row items-center justify-center rounded-xl ${
              isSaving
                ? "bg-lime-500/60"
                : "bg-[rgb(13,242,13)] shadow-[0_0_20px_rgba(13,242,13,0.5)]"
            }`}
            onPress={handleCreate}
          >
            <Text className="text-sm font-bold text-[#050816]">
              {isSaving ? "Creating..." : "Next: Build program"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-center text-sm font-medium text-lime-400">
              Save as draft (coming soon)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
