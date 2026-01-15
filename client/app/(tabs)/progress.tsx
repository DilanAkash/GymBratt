import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../lib/firebase";

const PRIMARY = "#0df20d";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProgressScreen() {
  const router = useRouter();
  const [data, setData] = useState<{ id: string; weight: number; date: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // Weights (default placeholder until load)
  const [weight, setWeight] = useState({
    current: 0,
    unit: "kg",
    change: 0,
    period: "All time",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch last 10 entries
      const q = query(
        collection(db, "progress"),
        orderBy("date", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as { id: string; weight: number; date: number })).reverse();

      setData(entries);

      if (entries.length > 0) {
        const latest = entries[entries.length - 1];
        const previous = entries.length > 1 ? entries[0] : latest; // compare vs fast entry for simple trend
        const diff = latest.weight - previous.weight;

        setWeight({
          current: latest.weight,
          unit: "kg",
          change: diff,
          period: "Recent trend"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

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

  const chartConfig = {
    backgroundGradientFrom: "#1e293b",
    backgroundGradientTo: "#0f172a",
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(13, 242, 13, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#0df20d"
    }
  };

  const getChartData = () => {
    if (data.length === 0) return {
      labels: ["Start"],
      datasets: [{ data: [0] }]
    };

    return {
      labels: data.map(d => new Date(d.date).getDate().toString()), // just Day
      datasets: [
        {
          data: data.map(d => d.weight),
          color: (opacity = 1) => `rgba(13, 242, 13, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={PRIMARY} />
        }
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

        {/* Weight section title */}
        <Text className="mb-2 mt-4 text-lg font-bold tracking-tight text-white">
          Weight
        </Text>

        {/* Weight chart card */}
        <View className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
          <View className="flex-row items-baseline justify-between mb-2">
            <View>
              <Text className="text-base font-medium text-slate-400">
                Current Weight
              </Text>
              <Text className="mt-1 text-[32px] font-bold leading-tight text-white">
                {weight.current > 0 ? `${weight.current.toFixed(1)} ${weight.unit}` : "--"}
              </Text>
            </View>

            {weight.current > 0 && (
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
                  className={`text-base font-medium ${weight.change < 0 ? "text-red-400" : "text-[rgb(13,242,13)]"
                    }`}
                >
                  {weight.change > 0 ? "+" : ""}
                  {weight.change.toFixed(1)}kg
                </Text>
              </View>
            )}
          </View>

          {data.length > 0 ? (
            <LineChart
              data={getChartData()}
              width={SCREEN_WIDTH - 64} // padding 16*2 + inner padding
              height={180}
              yAxisLabel=""
              yAxisSuffix="kg"
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          ) : (
            <View className="h-40 items-center justify-center rounded-lg bg-black/20">
              <Text className="text-slate-500">No data available yet</Text>
            </View>
          )}

        </View>

        {/* Measurements header */}
        <Text className="mb-2 mt-6 text-lg font-bold tracking-tight text-white">
          Measurements
        </Text>

        {/* Measurements grid (Static for now) */}
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
                className={`text-sm font-medium ${m.positive ? "text-[rgb(13,242,13)]" : "text-red-400"
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
