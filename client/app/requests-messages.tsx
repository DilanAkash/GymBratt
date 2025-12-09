import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

const items = [
  {
    id: "1",
    title: "Freeze membership for 2 weeks",
    subtitle: "Requested on Feb 20, 2025",
    status: "Pending",
  },
  {
    id: "2",
    title: "Change training time to evenings",
    subtitle: "Answered Feb 10, 2025 • Alex (Trainer)",
    status: "Resolved",
  },
];

export default function RequestsMessagesScreen() {
  const router = useRouter();

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
            Requests & messages
          </Text>

          <View className="h-10 w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* New request button */}
        <TouchableOpacity
          className="mb-5 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 bg-slate-800/70 px-4 py-3"
          activeOpacity={0.9}
        >
          <Ionicons name="add-circle-outline" size={18} color={PRIMARY} />
          <Text className="text-sm font-semibold text-[rgb(13,242,13)]">
            New request / message
          </Text>
        </TouchableOpacity>

        {/* List */}
        <View className="rounded-3xl border border-white/10 bg-white/5">
          {items.map((item, idx) => (
            <View key={item.id}>
              {idx > 0 && <View className="h-[1px] w-full bg-white/10" />}

              <TouchableOpacity
                className="flex-row items-center px-4 py-4"
                activeOpacity={0.9}
              >
                <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#e5e7eb"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-50">
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-400">
                    {item.subtitle}
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    className={`text-xs font-semibold ${
                      item.status === "Pending"
                        ? "text-yellow-400"
                        : "text-[rgb(13,242,13)]"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
