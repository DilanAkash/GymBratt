import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function ProgressPhotosScreen() {
  const router = useRouter();

  // Template photo data – later from Firestore
  const photos = [
    {
      id: "1",
      date: "Aug 15, 2023",
      label: "Front",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmJHGunQXDsdBNndduhp0G3LydlJhZig7iMXoJr08IFfTz5Q3KGiNp_m87RU-HbDjfdXIbgT5GcXjuYkEcdtp4ObaBBLxOVMRAfFiR9j8mS-kiVwwqKkWmopwGO_0IDMt8dBixQIYZaljPzqZaH4TJeqy5wZrYCYz5vvwPSVH3T2gKa6i-gzzUyfi8Q7kMmAY0r40OLA_xw6gOm-f8QCjVmUfr-jMOlAybRu7s_E8FCRSqn3EyjIVz_mtUJlbHueOoi8_4Xj5RFCY",
    },
    {
      id: "2",
      date: "Aug 15, 2023",
      label: "Side",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAadCJvQhWo5Vk7AKz_aYZEiuz7S5pR0k4ECJF5TiAgJudNFL7Nx_ar_9UAd0Ppr-A_-fJClAjSrhTFzff7Glkdi_wEk15faGKcB8MHRRcSk2Hj0NpD0y5J3iyPe_V34ED8PXJlzbVc1HZUy_NRi1XbOowKo7BTju1LOxKxWyFcbQUeK3thGsq_k6eqUTdQ5HDpD3pXY9SH6M5uyhUfi38xyGpeWfwV43-KFv5YJaKv3ZwNWIqxXVICMA1D7kMBwxlxlFNlRL6DdR4",
    },
    {
      id: "3",
      date: "Aug 15, 2023",
      label: "Back",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa2pBiInxxlruZFOXAGbpoYhcASlySQiKegrJxdQpY_mjCln1l1rtxNByg9b-zKtA-8OY6r-tyhAaYddhehPkSJnw8DoLSBpoTTsbRwtGJYzOQwMn5SFdZ3HnPETgbSuZovNEytwFCgs9Kq4s40gwQRSecZqWRHo4yKiwgAMUPy-UKglzoGovRenKiMRhns6OcYkXZSvHfa9U6ZACt1CxQWjiiPQA4ajDBmHnGPhTOiMAVZU0ZC8ZRALHDf6wJT1VxHqnKGPzfNa4",
    },
    {
      id: "4",
      date: "Jul 28, 2023",
      label: "Front",
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNSMR3EUAwZ0Hl_HDyBYPYyBaA2hR2oxQp3X_r09cDa3seueBpwHLvEhoFZTYGeJOgXzToCD5ZxBZE2I64oGvdwtbeb_VpfDmuaYNecg3--_KH1nv6IBA8KzXeso9e6xr094r4Y4yeX5xVwK_KADxjQDwPuL5nWC92euLhkLlFPhpzZgGyuPEehM3mJEKtk010wpycWQp22tmBqmAwd6zQVzOFb8VzB2RRP9rPTJHTyTRoLMkWJ6Rel_6XGKp-AVQ3AKb9jjNiR_g",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 px-2 text-center text-lg font-bold text-white">
            Progress photos
          </Text>

          <TouchableOpacity className="h-10 w-10 items-center justify-center">
            <Ionicons name="ellipsis-horizontal" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
      >
        {/* Add photos button */}
        <TouchableOpacity
          className="mb-5 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 bg-slate-800/70 px-4 py-3"
          activeOpacity={0.9}
        >
          <Ionicons name="cloud-upload-outline" size={18} color={PRIMARY} />
          <Text className="text-sm font-semibold text-[rgb(13,242,13)]">
            Add new photos
          </Text>
        </TouchableOpacity>

        {/* Info text */}
        <Text className="mb-3 text-xs text-slate-400">
          Compare how you look over time. Try to use similar lighting and
          distance for each set of photos.
        </Text>

        {/* Grid of photos – 2 columns */}
        <View className="flex-row flex-wrap justify-between">
          {photos.map((photo) => (
            <View
              key={photo.id}
              className="mb-4 w-[48%] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60"
            >
              <ImageBackground
                source={{ uri: photo.uri }}
                style={{ width: "100%", height: 180 }}
                resizeMode="cover"
              >
                <View className="flex-1 justify-end bg-gradient-to-t from-black/80 to-transparent p-3">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                    {photo.label}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-300">
                    {photo.date}
                  </Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
