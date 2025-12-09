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

export default function RequestMembershipScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* header */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View className="h-12 w-12" />
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 120,
          }}
        >
          <View className="mb-6">
            <Text className="pb-1 text-3xl font-bold leading-tight text-slate-50">
              Request Membership
            </Text>
            <Text className="text-base text-slate-400">
              Fill your details. We&apos;ll approve you soon.
            </Text>
          </View>

          {/* full name */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#6b7280"
              className="h-14 rounded-lg border border-white/10 bg-white/5 px-4 text-base text-slate-50"
            />
          </View>

          {/* email */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Email
            </Text>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-14 rounded-lg border border-white/10 bg-white/5 px-4 text-base text-slate-50"
            />
          </View>

          {/* phone */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Phone Number
            </Text>
            <TextInput
              placeholder="+94 77 000 0000"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              className="h-14 rounded-lg border border-white/10 bg-white/5 px-4 text-base text-slate-50"
            />
          </View>

          {/* gender & dob */}
          <View className="mb-5 flex-row gap-4">
            <View className="flex-1">
              <Text className="pb-2 text-sm font-medium text-slate-200">
                Gender
              </Text>
              <View className="h-14 flex-row items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4">
                <Text className="text-base text-slate-400">Select</Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={18}
                  color="#9ca3af"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="pb-2 text-sm font-medium text-slate-200">
                Date of Birth
              </Text>
              <View className="h-14 flex-row items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4">
                <Text className="text-base text-slate-400">Select date</Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* goal */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Your Goal
            </Text>
            <View className="h-14 flex-row items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4">
              <Text className="text-base text-slate-400">
                Select your primary goal
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={18}
                color="#9ca3af"
              />
            </View>
          </View>

          {/* experience */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Experience Level
            </Text>
            <View className="grid grid-cols-3 gap-3">
              {["Beginner", "Intermediate", "Advanced"].map((label, idx) => (
                <TouchableOpacity
                  key={label}
                  className={`h-12 items-center justify-center rounded-lg border ${
                    idx === 1
                      ? "border-[rgb(13,242,13)] bg-[rgb(13,242,13)]/15"
                      : "border-slate-700"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-sm font-medium ${
                      idx === 1 ? "text-[rgb(13,242,13)]" : "text-slate-300"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* emergency contact */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Emergency Contact
            </Text>
            <View className="flex-row gap-4">
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#6b7280"
                className="h-14 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-base text-slate-50"
              />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                className="h-14 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-base text-slate-50"
              />
            </View>
          </View>

          {/* notes */}
          <View className="mb-5">
            <Text className="pb-2 text-sm font-medium text-slate-200">
              Any injuries or medical conditions?
            </Text>
            <TextInput
              placeholder="Optional..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="min-h-[96px] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-slate-50"
            />
          </View>
        </ScrollView>

        {/* sticky footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-[#050816]/90 px-5 pb-6 pt-3">
          <TouchableOpacity
            className="h-14 w-full items-center justify-center rounded-xl bg-[rgb(13,242,13)]"
            activeOpacity={0.9}
            onPress={() => {
              // later: save to Firestore as membership request
              router.back();
            }}
          >
            <Text className="text-base font-bold text-[#050816]">
              Submit Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
