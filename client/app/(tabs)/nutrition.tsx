import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function NutritionScreen() {
  const router = useRouter();

  // Dynamic-ready template data (later: Firestore)
  const today = {
    label: "Today, Oct 26",
    caloriesCurrent: 2200,
    caloriesPlanned: 2500,
    caloriesProgress: 0.88, // 88%
    protein: 180,
    carbs: 250,
    fats: 70,
  };

  const meals = [
    {
      id: "breakfast",
      title: "Breakfast - 8:00 AM",
      description: "Oatmeal with berries, protein shake",
      calories: 550,
      icon: "cafe-outline" as const,
    },
    {
      id: "lunch",
      title: "Lunch - 1:00 PM",
      description: "Grilled chicken breast, quinoa, steamed broccoli",
      calories: 750,
      icon: "restaurant-outline" as const,
    },
    {
      id: "snack",
      title: "Snack - 4:00 PM",
      description: "Greek yogurt with almonds",
      calories: 300,
      icon: "ice-cream-outline" as const,
    },
    {
      id: "dinner",
      title: "Dinner - 7:30 PM",
      description: "Salmon fillet with roasted asparagus",
      calories: 600,
      icon: "pizza-outline" as const,
    },
  ];

  const handleMealPress = (mealId: string, title: string) => {
    router.push({
      pathname: "/meal-details",
      params: { id: mealId, title },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Top App Bar */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
        <View className="flex-row items-center justify-between">
          {/* left spacer (for symmetry) */}
          <View className="h-12 w-12" />
          <Text className="flex-1 text-center text-lg font-bold text-white">
            Nutrition
          </Text>
          {/* right spacer */}
          <View className="h-12 w-12" />
        </View>
      </View>

      {/* Date Navigator */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full">
          <Ionicons name="chevron-back" size={22} color={PRIMARY} />
        </TouchableOpacity>

        <Text className="text-[20px] font-bold tracking-tight text-white">
          {today.label}
        </Text>

        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full">
          <Ionicons name="chevron-forward" size={22} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 100,
          }}
        >
          {/* Daily Summary Card */}
          <View className="mb-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            {/* Calories */}
            <View className="mb-4">
              <View className="mb-2 flex-row items-baseline justify-between">
                <Text className="text-base font-medium text-white">
                  Calories
                </Text>
                <Text className="text-xl font-bold text-[rgb(57,255,20)]">
                  {today.caloriesCurrent}{" "}
                  <Text className="text-sm font-normal text-slate-400">
                    kcal
                  </Text>
                </Text>
              </View>

              <View className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                <View
                  className="h-2.5 rounded-full bg-[rgb(57,255,20)]"
                  style={{ width: `${today.caloriesProgress * 100}%` }}
                />
              </View>

              <Text className="mt-2 text-right text-sm text-slate-400">
                Planned: {today.caloriesPlanned} kcal
              </Text>
            </View>

            {/* Macro Chips */}
            <View className="mt-1 flex-row flex-wrap items-center justify-center gap-3">
              <View className="h-8 items-center justify-center rounded-full bg-[rgba(57,255,20,0.18)] px-4">
                <Text className="text-sm font-medium text-[rgb(57,255,20)]">
                  Protein: {today.protein}g
                </Text>
              </View>
              <View className="h-8 items-center justify-center rounded-full bg-[rgba(57,255,20,0.18)] px-4">
                <Text className="text-sm font-medium text-[rgb(57,255,20)]">
                  Carbs: {today.carbs}g
                </Text>
              </View>
              <View className="h-8 items-center justify-center rounded-full bg-[rgba(57,255,20,0.18)] px-4">
                <Text className="text-sm font-medium text-[rgb(57,255,20)]">
                  Fats: {today.fats}g
                </Text>
              </View>
            </View>
          </View>

          {/* Meal List */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-100">
              Today&apos;s meals
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              Tap a meal to view details and ingredients.
            </Text>
          </View>

          <View className="flex flex-col gap-4">
            {meals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                className="flex-row items-center rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                activeOpacity={0.9}
                onPress={() => handleMealPress(meal.id, meal.title)}
              >
                {/* Icon */}
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-lg bg-[rgba(57,255,20,0.14)]">
                  <Ionicons name={meal.icon} size={22} color={PRIMARY} />
                </View>

                {/* Text block */}
                <View className="flex-1">
                  <Text
                    className="text-base font-medium text-white"
                    numberOfLines={1}
                  >
                    {meal.title}
                  </Text>
                  <Text
                    className="mt-1 text-sm text-slate-400"
                    numberOfLines={2}
                  >
                    {meal.description}
                  </Text>
                </View>

                {/* Calories block */}
                <View className="ml-3 w-20 items-end">
                  <Text className="text-sm font-bold text-[rgb(57,255,20)]">
                    {meal.calories}
                    <Text className="text-[10px] font-normal text-slate-300">
                      {" "}
                      kcal
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer button – Mark Day as Followed */}
        <View className="absolute bottom-0 left-0 right-0 bg-[#050816]/90 px-4 pb-5 pt-3">
          <TouchableOpacity className="h-14 w-full items-center justify-center rounded-xl bg-[rgb(57,255,20)]">
            <Text className="text-base font-bold text-[#050816]">
              Mark Day as Followed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
