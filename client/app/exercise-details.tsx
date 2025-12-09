import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

type ExerciseDetailParams = {
  name?: string;
};

export default function ExerciseDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ExerciseDetailParams>();

  // Dynamic-ready template object – later we’ll load this from Firestore
  const exercise = {
    name: params.name || "Barbell Bench Press",
    primaryMuscles: ["Chest"],
    secondaryMuscles: ["Shoulders", "Triceps"],
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    youtubeUrl: "https://youtube.com", // placeholder
    // Content adapted from your HTML
    steps: [
      "Lie flat on your back on a bench. Grip the barbell with hands just wider than shoulder-width apart, so when you’re at the bottom of the move your hands are directly above your elbows.",
      "Bring the bar slowly down to your chest, puffing it out to meet the bar. Keep your elbows at a 45-degree angle.",
      "Push the bar back up to the starting position, squeezing your chest muscles. Don’t lock your elbows at the top.",
      "Repeat for the desired number of repetitions.",
    ],
    mistakes: [
      "Flaring elbows too wide: This puts unnecessary strain on your shoulder joints. Keep them tucked at about a 45-degree angle.",
      "Lifting your hips off the bench: This can strain your lower back and reduces the effectiveness of the exercise for your chest.",
      "Bouncing the bar off your chest: This uses momentum instead of muscle and increases the risk of injury. Control the weight throughout the entire movement.",
    ],
    // Just a placeholder preview image – later we’ll store per-exercise media
    previewImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSr0UJkUMGQ6T8YzLFq0f8Z99y2OCUc6lWuWZEHy_ob2DzlD-RsXC_AsrqUpbZZXy1R-olp5U1RUam2frItQ8bYIxn-tkV73uigYPmvyUnHM8KNtTmr2b2xOlb1MIbThEXxQdOl3ox1FFfjhUHQs1ifzLp11SoIyDbViQNvYwNx0n63rYAVOvpNLCuaYgxHSdlMXbJ5ZNxC8D9raj2GMMdNHxd11LpkVyNyucL23DulWPvHvfq0p4zK9SWIiDrXa_HYs8G3gEmEwA",
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header – same spacing/theme as other screens */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            className="flex-1 px-2 text-center text-lg font-bold text-gray-100"
          >
            {exercise.name}
          </Text>

          {/* Spacer to keep title centered */}
          <View className="h-10 w-10" />
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 40,
          }}
        >
          {/* === Top media (4:3 preview) === */}
          <View className="mb-6 w-full overflow-hidden rounded-xl">
            <View
              style={{ aspectRatio: 4 / 3 }}
              className="w-full overflow-hidden rounded-xl bg-black/40"
            >
              <Image
                source={{ uri: exercise.previewImage }}
                resizeMode="cover"
                className="h-full w-full"
              />
            </View>
          </View>

          {/* === Muscles / Equipment glass card === */}
          <View className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            {/* Primary */}
            <View className="mb-4">
              <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Primary Muscles
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {exercise.primaryMuscles.map((m) => (
                  <View
                    key={m}
                    className="flex h-8 items-center justify-center rounded-lg bg-[#0df20d]/20 px-3"
                  >
                    <Text className="text-sm font-medium text-[#0df20d]">
                      {m}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Secondary */}
            <View className="mb-4">
              <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Secondary Muscles
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {exercise.secondaryMuscles.map((m) => (
                  <View
                    key={m}
                    className="flex h-8 items-center justify-center rounded-lg bg-[#0df20d]/20 px-3"
                  >
                    <Text className="text-sm font-medium text-[#0df20d]">
                      {m}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Equipment */}
            <View>
              <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Equipment
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {exercise.equipment.map((e) => (
                  <View
                    key={e}
                    className="flex h-8 items-center justify-center rounded-lg bg-[#0df20d]/20 px-3"
                  >
                    <Text className="text-sm font-medium text-[#0df20d]">
                      {e}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* === How to Perform card === */}
          <View className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xl font-bold text-gray-100">
              How to Perform
            </Text>

            <View className="mt-4">
              {exercise.steps.map((step, idx) => (
                <View key={idx} className="mb-3 flex-row gap-3">
                  <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <Text className="text-xs font-bold text-gray-100">
                      {idx + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-sm leading-relaxed text-gray-200">
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* === Common Mistakes card === */}
          <View className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <Text className="text-xl font-bold text-gray-100">
              Common Mistakes
            </Text>

            <View className="mt-4">
              {exercise.mistakes.map((mistake, idx) => (
                <View key={idx} className="mb-3 flex-row gap-2">
                  <Text className="mt-[2px] text-base text-[#f97316]">•</Text>
                  <Text className="flex-1 text-sm leading-relaxed text-gray-200">
                    {mistake}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* === YouTube button === */}
          <TouchableOpacity
            className="mb-4 flex h-12 flex-row items-center justify-center gap-2 rounded-xl bg-[#0df20d] px-4"
            activeOpacity={0.9}
            onPress={() => {
              // Later: Linking.openURL(exercise.youtubeUrl);
            }}
          >
            <Ionicons name="play-circle" size={20} color="#050816" />
            <Text className="text-sm font-bold text-[#050816]">
              View on YouTube
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
