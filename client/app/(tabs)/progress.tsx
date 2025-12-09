import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function ProgressScreen() {
  // Dynamic-ready template data (later: Firestore)
  const router = useRouter();
  const weight = {
    current: 75.2,
    unit: "kg",
    change: -2.8,
    period: "Last 3 months",
  };

  const measurements = [
    { id: "bodyFat", label: "Body Fat %", value: "18.5%", delta: "-1.5%", positive: false },
    { id: "chest", label: "Chest", value: "102 cm", delta: "+2 cm", positive: true },
    { id: "waist", label: "Waist", value: "85 cm", delta: "-3 cm", positive: false },
    { id: "hips", label: "Hips", value: "95 cm", delta: "+1 cm", positive: true },
  ];

  const photos = [
    {
      id: "1",
      date: "Aug 15, 2023",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmJHGunQXDsdBNndduhp0G3LydlJhZig7iMXoJr08IFfTz5Q3KGiNp_m87RU-HbDjfdXIbgT5GcXjuYkEcdtp4ObaBBLxOVMRAfFiR9j8mS-kiVwwqKkWmopwGO_0IDMt8dBixQIYZaljPzqZaH4TJeqy5wZrYCYz5vvwPSVH3T2gKa6i-gzzUyfi8Q7kMmAY0r40OLA_xw6gOm-f8QCjVmUfr-jMOlAybRu7s_E8FCRSqn3EyjIVz_mtUJlbHueOoi8_4Xj5RFCY",
    },
    {
      id: "2",
      date: "Jul 28, 2023",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAadCJvQhWo5Vk7AKz_aYZEiuz7S5pR0k4ECJF5TiAgJudNFL7Nx_ar_9UAd0Ppr-A_-fJClAjSrhTFzff7Glkdi_wEk15faGKcB8MHRRcSk2Hj0NpD0y5J3iyPe_V34ED8PXJlzbVc1HZUy_NRi1XbOowKo7BTju1LOxKxWyFcbQUeK3thGsq_k6eqUTdQ5HDpD3pXY9SH6M5uyhUfi38xyGpeWfwV43-KFv5YJaKv3ZwNWIqxXVICMA1D7kMBwxlxlFNlRL6DdR4",
    },
    {
      id: "3",
      date: "Jun 12, 2023",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa2pBiInxxlruZFOXAGbpoYhcASlySQiKegrJxdQpY_mjCln1l1rtxNByg9b-zKtA-8OY6r-tyhAaYddhehPkSJnw8DoLSBpoTTsbRwtGJYzOQwMn5SFdZ3HnPETgbSuZovNEytwFCgs9Kq4s40gwQRSecZqWRHo4yKiwgAMUPy-UKglzoGovRenKiMRhns6OcYkXZSvHfa9U6ZACt1CxQWjiiPQA4ajDBmHnGPhTOiMAVZU0ZC8ZRALHDf6wJT1VxHqnKGPzfNa4",
    },
    {
      id: "4",
      date: "May 20, 2023",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNSMR3EUAwZ0Hl_HDyBYPYyBaA2hR2oxQp3X_r09cDa3seueBpwHLvEhoFZTYGeJOgXzToCD5ZxBZE2I64oGvdwtbeb_VpfDmuaYNecg3--_KH1nv6IBA8KzXeso9e6xr094r4Y4yeX5xVwK_KADxjQDwPuL5nWC92euLhkLlFPhpzZgGyuPEehM3mJEKtk010wpycWQp22tmBqmAwd6zQVzOFb8VzB2RRP9rPTJHTyTRoLMkWJ6Rel_6XGKp-AVQ3AKb9jjNiR_g",
    },
  ];

  const filterLabels = ["1M", "3M", "6M", "All"] as const;
  const activeFilter = "3M"; // later: state

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* Header */}
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[28px] font-bold leading-tight text-white">
            Progress
          </Text>

          {/* Add Entry – we'll wire navigation in the next step */}
          <TouchableOpacity
  className="flex flex-row items-center gap-1.5 rounded-full"
  activeOpacity={0.9}
  onPress={() => router.push("/add-progress-entry")}
>
            <Ionicons name="add-circle" size={22} color={PRIMARY} />
            <Text className="text-sm font-bold text-[rgb(13,242,13)]">
              Add Entry
            </Text>
          </TouchableOpacity>
        </View>

        {/* Segmented filter */}
        <View className="mb-4 mt-2 flex-row">
          <View className="flex h-10 flex-1 flex-row items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/50 p-1">
            {filterLabels.map((label) => {
              const selected = label === activeFilter;
              return (
                <View
                  key={label}
                  className={`flex-1 items-center justify-center rounded-lg px-2 ${
                    selected ? "bg-[rgba(13,242,13,0.9)]" : ""
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selected ? "text-black" : "text-slate-300"
                    }`}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weight section title */}
        <Text className="mb-2 mt-2 text-lg font-bold tracking-tight text-white">
          Weight
        </Text>

        {/* Weight chart card */}
        <View className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
          <View className="flex-row items-baseline justify-between">
            <View>
              <Text className="text-base font-medium text-slate-400">
                Current Weight
              </Text>
              <Text className="mt-1 text-[32px] font-bold leading-tight text-white">
                {weight.current.toFixed(1)} {weight.unit}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons
                name={
                  weight.change < 0
                    ? "trending-down-outline"
                    : "trending-up-outline"
                }
                size={18}
                color={weight.change < 0 ? "#f97373" : PRIMARY}
              />
              <Text
                className={`text-base font-medium ${
                  weight.change < 0 ? "text-red-400" : "text-[rgb(13,242,13)]"
                }`}
              >
                {weight.change > 0 ? "+" : ""}
                {weight.change.toFixed(1)}kg
              </Text>
            </View>
          </View>

          {/* Chart placeholder – later we can swap for real chart */}
          <View className="mt-4 mb-2 h-40 overflow-hidden rounded-lg bg-gradient-to-b from-[rgba(13,242,13,0.25)] to-transparent">
            <View className="absolute inset-x-3 bottom-6 h-0.5 bg-[rgba(156,163,175,0.6)]" />
            <View className="absolute left-3 right-3 bottom-6 h-24">
              {/* simple "line" using border radius and transform */}
              <View className="absolute bottom-0 h-1.5 w-full rounded-full bg-[rgb(13,242,13)] opacity-80" />
            </View>
          </View>

          <View className="flex-row justify-between pt-1">
            <Text className="text-xs font-bold tracking-wide text-slate-400">
              Jun
            </Text>
            <Text className="text-xs font-bold tracking-wide text-slate-400">
              Jul
            </Text>
            <Text className="text-xs font-bold tracking-wide text-slate-400">
              Aug
            </Text>
          </View>
        </View>

        {/* Measurements header */}
        <Text className="mb-2 mt-6 text-lg font-bold tracking-tight text-white">
          Measurements
        </Text>

        {/* Measurements grid */}
        <View className="grid grid-cols-2 gap-3">
          {measurements.map((m) => (
            <View
              key={m.id}
              className="flex flex-col gap-1 rounded-xl border border-slate-700/50 bg-slate-800/60 p-4"
            >
              <Text className="text-sm font-medium text-slate-400">
                {m.label}
              </Text>
              <Text className="text-2xl font-bold leading-tight text-white">
                {m.value}
              </Text>
              <Text
                className={`text-sm font-medium ${
                  m.positive ? "text-[rgb(13,242,13)]" : "text-red-400"
                }`}
              >
                {m.delta}
              </Text>
            </View>
          ))}
        </View>

        {/* Photos header */}
        <View className="mt-6 mb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold tracking-tight text-white">
              Photos
            </Text>
          </View>
          {/* "See all" will open photos screen later */}
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/progress-photos")}
        >
        <Text className="text-sm font-bold text-[rgb(13,242,13)]">
            See all
        </Text>
        </TouchableOpacity>
        </View>

        {/* Horizontal photos scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
          className="pb-2"
        >
          <View className="flex-row gap-3">
            {photos.map((photo) => (
            <TouchableOpacity
            key={photo.id}
            activeOpacity={0.9}
            className="h-56 w-40 overflow-hidden rounded-xl"
            onPress={() => router.push("/progress-photos")}
            >

                <ImageBackground
                  source={{ uri: photo.uri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                >
                  <View className="flex-1 justify-end bg-gradient-to-t from-black/70 to-transparent p-3">
                    <Text className="text-sm font-bold text-white">
                      {photo.date}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
