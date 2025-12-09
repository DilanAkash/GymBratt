import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppUser } from "../../lib/UserContext";

const PRIMARY = "#0df20d";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAppUser();

  const displayName = user.fullName || "Athlete";
  const gymName = user.gymName || "Your Gym";

  const membership = {
    status: user.membershipStatus || "Active",
    statusColor: PRIMARY,
    memberName: displayName,
    memberId: "FF-2049", // placeholder
    expiresAt: "2025-12-31", // placeholder
  };

  const todayWorkout = {
    title: "Push Day – Hypertrophy",
    durationMinutes: 60,
    progress: 0.25, // later from logs
    statusText: "Scheduled",
  };

  const nutrition = {
    calories: 2200,
    protein: 150,
    carbs: 210,
    fat: 70,
  };

  const gymAccess = {
    hasAccess: true,
  };

  const newsItems = [
    {
      id: "1",
      title: "New opening hours this week",
      subtitle: "We’re now open from 5am to 11pm on weekdays.",
    },
    {
      id: "2",
      title: "Member appreciation day",
      subtitle: "Bring a friend for free this Saturday.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        {/* ===== Header: Greeting + Avatar ===== */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Welcome back
            </Text>
              <Text className="mt-2 text-2xl font-bold text-slate-50">
                Good morning, {displayName} 👋
              </Text>
            <Text className="mt-1 text-sm text-zinc-400">
              Here&apos;s your plan for today.
            </Text>
          </View>

          {/* Avatar with ring (simple version – later we can use gradients) */}
          <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-[rgba(13,242,13,0.7)] bg-black/60">
          <Text className="mt-1 text-base font-semibold text-slate-50">
            {gymName}
          </Text>
          </View>
        </View>

        {/* ===== Membership card ===== */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[13px] font-medium text-zinc-300">
                Membership
              </Text>
              <Text className="mt-1 text-base font-semibold text-slate-50">
                {user.gymName}
              </Text>
            </View>

            <View className="rounded-full bg-[rgba(13,242,13,0.16)] px-3 py-1">
              <Text className="text-xs font-semibold text-[#0df20d]">
                {membership.status}
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row justify-between">
            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                Member
              </Text>
              <Text className="mt-1 text-sm font-medium text-slate-50">
                {membership.memberName}
              </Text>
            </View>

            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                ID
              </Text>
              <Text className="mt-1 text-sm font-medium text-slate-50">
                {membership.memberId}
              </Text>
            </View>

            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                Expires
              </Text>
              <Text className="mt-1 text-sm font-medium text-slate-50">
                {membership.expiresAt}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== Today’s Workout ===== */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Today&apos;s Workout
              </Text>
              <Text className="mt-1 text-[15px] font-semibold text-slate-50">
                {todayWorkout.title}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-xs text-zinc-400">Estimated</Text>
              <Text className="mt-0.5 text-sm font-semibold text-slate-50">
                {todayWorkout.durationMinutes} mins
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View className="mt-3">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-xs text-zinc-400">
                {todayWorkout.statusText}
              </Text>
              <Text className="text-xs font-medium text-[#0df20d]">
                {Math.round(todayWorkout.progress * 100)}% complete
              </Text>
            </View>

            <View className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <View
                className="h-1.5 rounded-full bg-[#0df20d]"
                style={{ width: `${todayWorkout.progress * 100}%` }}
              />
            </View>
          </View>

          {/* Start workout */}
          <TouchableOpacity
            className="mt-4 h-11 flex-row items-center justify-center gap-2 rounded-full bg-[#0df20d] shadow-lg shadow-[rgba(13,242,13,0.35)]"
            onPress={() => router.push("/workout-day")}
          >
            <Ionicons name="play" size={18} color="#050816" />
            <Text className="text-[13px] font-bold text-[#050816]">
              Start Workout
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== Today’s Nutrition ===== */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Today&apos;s Nutrition
              </Text>
              <Text className="mt-1 text-[15px] font-semibold text-slate-50">
                Daily macros target
              </Text>
            </View>

            <TouchableOpacity
              className="rounded-full bg-white/10 px-3 py-1"
              onPress={() => router.push("/nutrition")}
            >
              <Text className="text-xs font-medium text-slate-50">
                View Meal Plan
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                Calories
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {nutrition.calories}
              </Text>
              <Text className="text-[11px] text-zinc-500">kcal</Text>
            </View>

            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                Protein
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {nutrition.protein}g
              </Text>
            </View>

            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                Carbs
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {nutrition.carbs}g
              </Text>
            </View>

            <View>
              <Text className="text-[11px] uppercase tracking-wide text-zinc-500">
                Fat
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {nutrition.fat}g
              </Text>
            </View>
          </View>
        </View>

        {/* ===== Gym Access ===== */}
        {gymAccess.hasAccess && (
          <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Gym Access
                </Text>
                <Text className="mt-1 text-[15px] font-semibold text-slate-50">
                  Scan to enter
                </Text>
              </View>

              <Ionicons name="qr-code-outline" size={26} color="#e5e7eb" />
            </View>

            <Text className="text-sm text-zinc-400">
              Show your QR code at the entrance to check in.
            </Text>

            <TouchableOpacity
              className="mt-4 h-11 items-center justify-center rounded-full bg-white/10"
              activeOpacity={0.9}
              onPress={() => router.push("/scan-qr")}
            >
              <Text className="text-xs font-semibold text-slate-100">
                Scan check-in QR
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===== Latest Updates / News ===== */}
        <View className="mb-3">
          <Text className="text-sm font-semibold text-slate-50">
            Latest updates
          </Text>
          <Text className="mt-1 text-xs text-zinc-500">
            News and announcements from your gym.
          </Text>
        </View>

        <View>
          {newsItems.map((item) => (
            <View
              key={item.id}
              className="mb-3 flex-row rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Ionicons name="megaphone-outline" size={18} color="#e5e7eb" />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-50">
                  {item.title}
                </Text>
                <Text className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
