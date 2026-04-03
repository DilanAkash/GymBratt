import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessAnimation from "../../components/SuccessAnimation";
import { useProgramStore } from "../../lib/ProgramStoreContext";

const PRIMARY = "#0df20d";

export default function NutritionScreen() {
  const router = useRouter();
  const { getDailyNutrition, deleteMeal } = useProgramStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDayFollowed, setIsDayFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Date Logic (Simplification: Just today for now)
  const todayDate = new Date();
  const dateLabel = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const loadData = async () => {
    try {
      const data = await getDailyNutrition(Date.now());
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Derived Totals
  const totals = useMemo(() => {
    let cals = 0, p = 0, c = 0, f = 0;
    logs.forEach(l => {
      cals += (l.calories || 0);
      p += (l.protein || 0);
      c += (l.carbs || 0);
      f += (l.fats || 0);
    });
    return { cals, p, c, f };
  }, [logs]);

  // Planned Goals (Mock for now, can be in User Profile later)
  const PLANNED = { cals: 2500, p: 180, c: 250, f: 70 };
  const progress = Math.min(totals.cals / PLANNED.cals, 1);

  // Group meals by type for display list logic if we wanted, or just flatten. 
  // The existing UI lists meals. We can just map our logs.

  const mappedMeals = logs.map(l => ({
    id: l.id,
    title: l.name,
    description: `${l.type} • P: ${l.protein}g C: ${l.carbs}g F: ${l.fats}g`,
    calories: l.calories,
    icon: l.type === 'breakfast' ? 'cafe-outline' : l.type === 'lunch' ? 'restaurant-outline' : l.type === 'dinner' ? 'pizza-outline' : 'ice-cream-outline'
  }));

  const handleMealPress = (mealId: string, title: string) => {
    // Navigate to details if needed, or just editing. 
    // For Basic Log, maybe just viewing info?
    // Let's just do nothing or show alert for now as "Edit" isn't prioritized in Basic.
  };

  const handleMarkFollowed = () => {
    setShowSuccess(true);
    setIsDayFollowed(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Meal",
      "Are you sure you want to delete this meal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (deleteMeal) {
                await deleteMeal(id);
                loadData(); // Reload to refresh list
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete meal");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <SuccessAnimation
        visible={showSuccess}
        message="Nutrition Goal Met!"
        onFinish={() => setShowSuccess(false)}
      />

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
          {dateLabel}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
          }
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
                  {totals.cals}{" "}
                  <Text className="text-sm font-normal text-slate-400">
                    kcal
                  </Text>
                </Text>
              </View>

              <View className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                <View
                  className="h-2.5 rounded-full bg-[rgb(57,255,20)]"
                  style={{ width: `${progress * 100}%` }}
                />
              </View>

              <Text className="mt-2 text-right text-sm text-slate-400">
                Planned: {PLANNED.cals} kcal
              </Text>
            </View>

            {/* Macro Chips */}
            <View className="mt-1 flex-row flex-wrap items-center justify-center gap-3">
              <View className="h-8 items-center justify-center rounded-full bg-[rgba(57,255,20,0.18)] px-4">
                <Text className="text-sm font-medium text-[rgb(57,255,20)]">
                  Protein: {totals.p}g
                </Text>
              </View>
              <View className="h-8 items-center justify-center rounded-full bg-[rgba(57,255,20,0.18)] px-4">
                <Text className="text-sm font-medium text-[rgb(57,255,20)]">
                  Carbs: {totals.c}g
                </Text>
              </View>
              <View className="h-8 items-center justify-center rounded-full bg-[rgba(57,255,20,0.18)] px-4">
                <Text className="text-sm font-medium text-[rgb(57,255,20)]">
                  Fats: {totals.f}g
                </Text>
              </View>
            </View>
          </View>

          {/* Meal List */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-100">
              Today&apos;s meals
            </Text>
            <TouchableOpacity onPress={() => router.push("/add-meal")}>
              <Text className="text-xs font-bold text-[rgb(13,242,13)]">+ Add Meal</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="mb-2 mt-1 text-xs text-slate-500">
              Tap + to log a new meal.
            </Text>
          </View>

          <View className="flex flex-col gap-4">
            {loading ? <ActivityIndicator color={PRIMARY} /> : mappedMeals.length === 0 ? (
              <View className="p-4 items-center bg-white/5 rounded-2xl">
                <Text className="text-slate-400">No meals logged yet.</Text>
              </View>
            ) : mappedMeals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                className="flex-row items-center rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                activeOpacity={0.9}
                onPress={() => handleMealPress(meal.id, meal.title)}
                onLongPress={() => handleDelete(meal.id)}
                delayLongPress={500}
              >
                {/* Icon */}
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-lg bg-[rgba(57,255,20,0.14)]">
                  <Ionicons name={meal.icon as any} size={22} color={PRIMARY} />
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
          <TouchableOpacity
            className={`h-14 w-full items-center justify-center rounded-xl ${isDayFollowed ? 'bg-[#1e293b]' : 'bg-[rgb(57,255,20)]'}`}
            onPress={handleMarkFollowed}
            disabled={isDayFollowed}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={isDayFollowed ? "checkmark-circle" : "checkbox-outline"}
                size={22}
                color={isDayFollowed ? "#94a3b8" : "#050816"}
              />
              <Text className={`text-base font-bold ${isDayFollowed ? 'text-slate-400' : 'text-[#050816]'}`}>
                {isDayFollowed ? "Day Completed" : "Mark Day as Followed"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View >
    </SafeAreaView >
  );
}
