import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

type MealDetailParams = {
  id?: string;
  title?: string;
};

export default function MealDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<MealDetailParams>();

  // Template meal object – later load from DB using params.id
  const meal = {
    title: params.title || "Post-Workout Lunch",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdCMGwVMPP187_j3hYupBN_PJM7lQv-dfRBE0SPT9exNpjvUJcYnDLJqeFNbs2oK6WSyL_CPilja_S-OT6481Fx43Miu0i481YDTFkPTXPaEW5T8gdNpUVPDcLgRIVx_BLCY6rgvXZAlBK8oyQMCOtA54RyjCSdSiewv2ybV1Vzd_MiNj6wZJ2G0EssGD29lU6lhkePe0k5kSXs83Om73tOcBW5u_PeR4zmLX4T8EJe-oYiqY5IWyHjY8NG_dUUo2WNnbZDyYzk3M",
    macros: {
      calories: 550,
      carbs: "45g",
      protein: "50g",
      fats: "18g",
    },
    ingredients: [
      {
        name: "Grilled Chicken Breast",
        info: "150g • C: 0g / P: 31g / F: 4g",
        calories: 165,
      },
      {
        name: "Quinoa",
        info: "1 cup cooked • C: 40g / P: 8g / F: 4g",
        calories: 222,
      },
      {
        name: "Broccoli Florets",
        info: "1 cup steamed • C: 11g / P: 4g / F: 1g",
        calories: 55,
      },
      {
        name: "Avocado",
        info: "1/4 medium • C: 4g / P: 1g / F: 9g",
        calories: 108,
      },
    ],
    swapSuggestions: [
      "For Chicken: Salmon, Tofu, or Lean Beef.",
      "For Quinoa: Brown Rice, Sweet Potato, or Whole Wheat Pasta.",
    ],
    trainersNotes:
      "Make sure to eat this meal within 60–90 minutes of your workout to maximize muscle recovery and glycogen replenishment. Feel free to add a pinch of chili flakes for extra flavor!",
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Top App Bar */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#e5e7eb" />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            className="flex-1 px-2 text-center text-lg font-bold text-gray-100"
          >
            {meal.title}
          </Text>

          <TouchableOpacity className="h-12 w-12 items-center justify-center">
            <Ionicons name="share-outline" size={20} color="#e5e7eb" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 120,
          }}
        >
          {/* Hero Image */}
          <View className="px-4 pt-2">
            <View className="overflow-hidden rounded-xl">
              <ImageBackground
                source={{ uri: meal.imageUrl }}
                resizeMode="cover"
                style={{ width: "100%", minHeight: 240 }}
              />
            </View>
          </View>

          {/* Total Macros */}
          <View className="px-4">
            <Text className="pt-6 pb-3 text-xl font-bold tracking-tight text-white">
              Total Macros
            </Text>

            <View className="mb-2 flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%] rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4">
                <Text className="text-sm font-medium text-slate-400">
                  Calories
                </Text>
                <Text className="mt-2 text-2xl font-bold text-white">
                  {meal.macros.calories}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%] rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4">
                <Text className="text-sm font-medium text-slate-400">
                  Carbs
                </Text>
                <Text className="mt-2 text-2xl font-bold text-white">
                  {meal.macros.carbs}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%] rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4">
                <Text className="text-sm font-medium text-slate-400">
                  Protein
                </Text>
                <Text className="mt-2 text-2xl font-bold text-white">
                  {meal.macros.protein}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%] rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4">
                <Text className="text-sm font-medium text-slate-400">
                  Fats
                </Text>
                <Text className="mt-2 text-2xl font-bold text-white">
                  {meal.macros.fats}
                </Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View className="px-4">
            <Text className="pt-6 pb-3 text-xl font-bold tracking-tight text-white">
              Ingredients
            </Text>

            <View className="flex flex-col gap-3">
              {meal.ingredients.map((ing) => (
                <View
                  key={ing.name}
                  className="flex-row items-center rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4"
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-white">
                      {ing.name}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-400">
                      {ing.info}
                    </Text>
                  </View>
                  <Text className="text-base font-medium text-white">
                    {ing.calories} kcal
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Alternative Options */}
          <View className="px-4">
            <Text className="pt-6 pb-3 text-xl font-bold tracking-tight text-white">
              Alternative Options
            </Text>

            <View className="rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4">
              {/* Simple, always-open version (no <details> in RN) */}
              <Text className="mb-2 text-base font-semibold text-white">
                Swap Suggestions
              </Text>

              <View className="mt-2 border-t border-white/10 pt-3">
                {meal.swapSuggestions.map((s, idx) => (
                  <Text
                    key={idx}
                    className="mb-2 text-sm leading-relaxed text-slate-300"
                  >
                    {s}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Trainer's Notes */}
          <View className="px-4 pb-4">
            <Text className="pt-6 pb-3 text-xl font-bold tracking-tight text-white">
              Trainer&apos;s Notes
            </Text>

            <View className="rounded-xl border border-white/10 bg-[rgba(26,42,26,0.6)] p-4">
              <Text className="text-base leading-relaxed text-slate-300">
                {meal.trainersNotes}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* CTA Button fixed at bottom */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050816] to-transparent px-4 pb-6 pt-4">
          <TouchableOpacity className="flex h-14 flex-row items-center justify-center gap-2 rounded-xl bg-[rgb(57,255,20)]">
            <Ionicons name="checkmark-circle" size={20} color="#050816" />
            <Text className="text-base font-bold text-[#050816]">
              I Ate This
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
