import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <View className="absolute -top-40 -left-40 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <View className="absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <View className="flex-1 px-6">
        {/* top app bar / logo */}
        <View className="mt-4 flex-row items-center">
          <View className="flex h-10 w-10 items-center justify-center">
            <Ionicons name="barbell-outline" size={30} color="#0df20d" />
          </View>
        </View>

        {/* hero */}
        <View className="flex-1 items-center justify-center">
          <View className="mb-8 w-full max-w-xs">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqo_SYE4JsJEBC1jtII3EN6JZhShxZL1bD1-wzE8W2Cp9g04qK7ZB3iAeFoR6nQuTbDLjmmyoUJPtsFaTbvPK1DoBUx7t3RkENWODkranNHA2lAKJ7FnImftetZKPZSvUiRHgBcMo0w-E6KKqtjaRNFMhyjdk-gPMvOhO1ARjjzO_OXjYS-sihp6UBzifq6DqL4K8cr-jLvsgkSMpbOYGpJRztPKj__k32EswAQVrNoUkwCxja5HnrBveX3SjLHOHK2u3vFMv8ukM",
              }}
              style={{
                width: "100%",
                height: 220,
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          </View>

          <Text className="text-center text-3xl font-bold leading-tight tracking-tight text-slate-50">
            Train Smarter. Stay Consistent.
          </Text>
          <Text className="mt-2 text-center text-base text-slate-400">
            Your gym in your pocket. Members-only access.
          </Text>
        </View>

        {/* footer buttons */}
        <View className="mb-4 mt-2 flex flex-col items-center gap-4">
          {/* Log In */}
          <View className="w-full">
            <TouchableOpacity
              className="h-14 w-full items-center justify-center rounded-xl bg-[#0df20d]"
              activeOpacity={0.9}
              onPress={() => router.push("/login")}
            >
              <Text className="text-base font-bold text-[#050816]">
                Log In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Request membership */}
          <View className="w-full">
            <TouchableOpacity
              className="h-14 w-full items-center justify-center rounded-xl bg-transparent"
              activeOpacity={0.9}
              onPress={() => router.push("/request-membership")}
            >
              <Text className="text-base font-medium text-slate-400">
                Request Membership
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
