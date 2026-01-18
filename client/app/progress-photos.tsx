import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProgramStore } from "../lib/ProgramStoreContext";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function ProgressPhotosScreen() {
  const router = useRouter();
  const { getProgressEntries } = useProgramStore();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const entries = await getProgressEntries();
      // Flatten entries into photos
      const photoList: any[] = [];
      entries.forEach(entry => {
        if (entry.photos) {
          Object.entries(entry.photos).forEach(([label, uri]) => {
            photoList.push({
              id: `${entry.id}-${label}`,
              date: new Date(entry.date).toLocaleDateString(),
              label,
              uri
            });
          });
        }
      });
      setPhotos(photoList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
          onPress={() => router.push("/add-progress-entry")}
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
