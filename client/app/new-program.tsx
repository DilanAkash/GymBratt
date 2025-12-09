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

const GOALS = ["Strength", "Hypertrophy", "Fat Loss", "Endurance"];
const DAYS_OPTIONS = [2, 3, 4, 5, 6];
const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

// Color/emoji tag options – template for now
const TAG_OPTIONS = [
  { color: "#0df20d", emoji: "🔥" }, // primary
  { color: "#22d3ee", emoji: "🏋️‍♂️" },
  { color: "#a855f7", emoji: "⚡" },
  { color: "#f97316", emoji: "💪" },
];

export default function NewProgramScreen() {
  const router = useRouter();

  const [programName, setProgramName] = useState("");
  const [goal, setGoal] = useState<string>("Strength");
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [experience, setExperience] = useState<string>("Intermediate");
  const [programType, setProgramType] = useState("");
  const [notes, setNotes] = useState("");

  // Tag picker state
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);
  const selectedTag = TAG_OPTIONS[selectedTagIndex];

  const increaseWeeks = () => setDurationWeeks((w) => Math.min(w + 1, 52));
  const decreaseWeeks = () =>
    setDurationWeeks((w) => (w > 1 ? w - 1 : 1));

  const handleNext = () => {
    // Later: pass this data to builder via params or global state
    router.push("/new-program-builder");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Top bar */}
      <View className="border-b border-white/10 bg-[#050816]/90 px-4 pb-4 pt-2">
        <View className="h-12 flex-row items-center">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View className="mt-2">
          <Text className="text-[28px] font-bold leading-tight text-white">
            New Program
          </Text>
          <Text className="pt-1 text-base text-neutral-400">
            Start by giving your program a name and basics.
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View className="px-4 pt-5 pb-4">
            {/* Program Name */}
            <View className="mb-6">
              <Text className="pb-2 text-sm font-medium text-neutral-300">
                Program Name <Text className="text-[#0df20d]">*</Text>
              </Text>
              <TextInput
                value={programName}
                onChangeText={setProgramName}
                placeholder="e.g. Strength & Power"
                placeholderTextColor="#6b7280"
                className="h-12 rounded-lg border border-white/20 bg-white/5 px-4 text-base text-white"
              />
            </View>

            {/* Goal */}
            <View className="mb-6">
              <Text className="pb-2 text-sm font-bold text-neutral-300">
                Goal
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {GOALS.map((item) => {
                  const selected = item === goal;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setGoal(item)}
                      className={`h-9 items-center justify-center rounded-full border px-4 ${
                        selected
                          ? "border-[#0df20d] bg-[#0df20d]/20"
                          : "border-transparent bg-white/10"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selected ? "text-[#0df20d]" : "text-neutral-200"
                        }`}
                      >
                        {item}
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

                <TextInput
                  value={String(durationWeeks)}
                  onChangeText={(val) => {
                    const num = parseInt(val || "1", 10);
                    if (!Number.isNaN(num)) {
                      setDurationWeeks(Math.max(1, Math.min(num, 52)));
                    }
                  }}
                  keyboardType="number-pad"
                  placeholder="e.g. 8"
                  placeholderTextColor="#6b7280"
                  className="h-12 flex-1 rounded-lg border border-white/20 bg-white/5 px-4 text-center text-base text-white"
                />

                <TouchableOpacity
                  className="absolute right-2 rounded-full p-1"
                  onPress={increaseWeeks}
                >
                  <Ionicons name="add" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Days per week */}
            <View className="mb-6">
              <Text className="pb-2 text-sm font-bold text-neutral-300">
                Days per week
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DAYS_OPTIONS.map((d) => {
                  const selected = d === daysPerWeek;
                  return (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setDaysPerWeek(d)}
                      className={`h-12 w-[18%] items-center justify-center rounded-lg ${
                        selected
                          ? "border border-[#0df20d] bg-[#0df20d]/20"
                          : "bg-white/10"
                      }`}
                    >
                      <Text
                        className={`text-base font-medium ${
                          selected ? "text-[#0df20d]" : "text-neutral-200"
                        }`}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Experience level */}
            <View className="mb-6">
              <Text className="pb-2 text-sm font-bold text-neutral-300">
                Experience Level
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((option) => {
                  const selected = option === experience;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setExperience(option)}
                      className={`h-9 flex-1 basis-[30%] items-center justify-center rounded-full border px-4 ${
                        selected
                          ? "border-[#0df20d] bg-[#0df20d]/20"
                          : "border-transparent bg-white/10"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selected ? "text-[#0df20d]" : "text-neutral-200"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Optional details */}
            <View className="pt-2">
              {/* Program Type */}
              <View className="mb-6">
                <Text className="pb-2 text-sm font-medium text-neutral-300">
                  Program Type (Optional)
                </Text>
                <TextInput
                  value={programType}
                  onChangeText={setProgramType}
                  placeholder="e.g. Push/Pull/Legs"
                  placeholderTextColor="#6b7280"
                  className="h-12 rounded-lg border border-white/20 bg-white/5 px-4 text-base text-white"
                />
              </View>

              {/* Description / Notes */}
              <View className="mb-6">
                <Text className="pb-2 text-sm font-medium text-neutral-300">
                  Description/Notes (Optional)
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any details or notes here..."
                  placeholderTextColor="#6b7280"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="min-h-[96px] rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-base text-white"
                />
              </View>

              {/* Color/Emoji picker – now interactive */}
              <View className="rounded-lg border border-white/20 bg-white/5 p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-medium text-neutral-300">
                    Tag with Color/Emoji
                  </Text>

                  {/* Selected tag preview */}
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: selectedTag.color }}
                  >
                    <Text className="text-xl">{selectedTag.emoji}</Text>
                  </View>
                </View>

                {/* Choices row */}
                <View className="mt-3 flex-row items-center gap-3">
                  {TAG_OPTIONS.map((tag, index) => {
                    const isSelected = index === selectedTagIndex;
                    return (
                      <TouchableOpacity
                        key={tag.color}
                        onPress={() => setSelectedTagIndex(index)}
                        className="items-center gap-1"
                      >
                        <View
                          className="h-8 w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: tag.color }}
                        >
                          <Text className="text-lg">{tag.emoji}</Text>
                        </View>
                        {isSelected && (
                          <View className="h-1 w-6 rounded-full bg-[#0df20d]" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer actions */}
        <View className="border-t border-white/10 bg-[#050816]/90 px-4 pb-6 pt-3">
          <TouchableOpacity
            className="mb-3 h-14 w-full items-center justify-center rounded-full bg-[#0df20d]"
            onPress={handleNext}
          >
            <Text className="text-base font-bold text-[#050816]">
              Next: Build Program
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="text-center text-sm font-medium text-[#0df20d]">
              Save as draft
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
