import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0df20d";

export default function AddProgressEntryScreen() {
  const router = useRouter();

  // Later we'll use real dates + form state
  const dateLabel = "Today • Oct 26, 2025";

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
            Add progress
          </Text>

          {/* spacer */}
          <View className="h-10 w-10" />
        </View>

        <Text className="mt-2 text-center text-xs text-slate-400">
          {dateLabel}
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 120,
          }}
        >
          {/* Weight & body fat */}
          <View className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-800/70 p-4">
            <Text className="mb-3 text-sm font-semibold text-slate-100">
              Weight & body fat
            </Text>

            <View className="flex-row gap-3">
              {/* Weight */}
              <View className="flex-1">
                <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Weight
                </Text>
                <View className="mt-1 flex-row items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2">
                  <TextInput
                    placeholder="75.2"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                    className="flex-1 text-base font-semibold text-white"
                  />
                  <Text className="text-xs font-semibold text-slate-400">
                    kg
                  </Text>
                </View>
              </View>

              {/* Body fat */}
              <View className="flex-1">
                <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Body fat %
                </Text>
                <View className="mt-1 flex-row items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2">
                  <TextInput
                    placeholder="18.5"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                    className="flex-1 text-base font-semibold text-white"
                  />
                  <Text className="text-xs font-semibold text-slate-400">
                    %
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Measurements */}
          <View className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-800/70 p-4">
            <Text className="mb-3 text-sm font-semibold text-slate-100">
              Measurements
            </Text>

            {/* Chest */}
            <View className="mb-3">
              <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Chest
              </Text>
              <View className="mt-1 flex-row items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2">
                <TextInput
                  placeholder="102"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  className="flex-1 text-base font-semibold text-white"
                />
                <Text className="text-xs font-semibold text-slate-400">cm</Text>
              </View>
            </View>

            {/* Waist */}
            <View className="mb-3">
              <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Waist
              </Text>
              <View className="mt-1 flex-row items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2">
                <TextInput
                  placeholder="85"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  className="flex-1 text-base font-semibold text-white"
                />
                <Text className="text-xs font-semibold text-slate-400">cm</Text>
              </View>
            </View>

            {/* Hips */}
            <View>
              <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Hips
              </Text>
              <View className="mt-1 flex-row items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2">
                <TextInput
                  placeholder="95"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  className="flex-1 text-base font-semibold text-white"
                />
                <Text className="text-xs font-semibold text-slate-400">cm</Text>
              </View>
            </View>
          </View>

          {/* Progress photos */}
          <View className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-800/70 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-slate-100">
                Progress photos
              </Text>
              <Text className="text-xs text-slate-400">Optional</Text>
            </View>

            <View className="flex-row gap-3">
              {["Front", "Side", "Back"].map((label) => (
                <TouchableOpacity
                  key={label}
                  className="flex-1 items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-900/70 px-2 py-6"
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera-outline" size={22} color="#9ca3af" />
                  <Text className="mt-2 text-xs font-medium text-slate-300">
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="mt-2 text-[11px] text-slate-500">
              We&apos;ll keep these private. Only you (and your coach, if
              connected) can see them.
            </Text>
          </View>

          {/* Notes */}
          <View className="mb-5 rounded-2xl border border-slate-700/50 bg-slate-800/70 p-4">
            <Text className="mb-2 text-sm font-semibold text-slate-100">
              Notes
            </Text>
            <TextInput
              placeholder="How are you feeling today? Energy, sleep, pumps..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="min-h-[96px] rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
            />
          </View>
        </ScrollView>

        {/* Sticky footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-[#050816]/95 px-4 pb-6 pt-3">
          <TouchableOpacity
            className="h-14 w-full flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)]"
            activeOpacity={0.9}
            onPress={() => {
              // Later: save to Firestore then go back
              router.back();
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#050816" />
            <Text className="ml-2 text-base font-bold text-[#050816]">
              Save entry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
