import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <View className="flex-1 items-center justify-between px-8 py-8">
        {/* top spacer */}
        <View className="flex-1" />

        {/* center logo */}
        <View className="items-center gap-4">
          <Ionicons name="barbell-outline" size={64} color="#0df20d" />
          <Text className="text-[32px] font-bold leading-tight tracking-wide text-white">
            GYM APP
          </Text>
          <Text className="text-base text-slate-400">Members Only</Text>
        </View>

        {/* bottom loader */}
        <View className="flex-1 items-center justify-center gap-4">
          <View className="h-6 w-6 items-center justify-center">
            {/* simple spinner substitute */}
            <View className="h-6 w-6 rounded-full border-2 border-[#0df20d]/20 border-t-[#0df20d]" />
          </View>
          <Text className="text-sm text-slate-500">Powered by GymApp</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
