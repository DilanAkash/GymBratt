import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGym } from "../../lib/GymContext";

export default function GymScreen() {
    const router = useRouter();
    const { currentGym, isGymMode } = useGym();

    if (!isGymMode || !currentGym) {
        return (
            <SafeAreaView className="flex-1 bg-[#050816] items-center justify-center p-6">
                <Text className="text-white text-lg font-bold text-center">
                    Gym Mode Inactive
                </Text>
                <Text className="text-slate-400 text-center mt-2">
                    Enable Gym Mode in your profile to access premium features.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#050816]">
            <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
                <View className="flex-row items-center justify-between">
                    <View className="h-10 w-10" />
                    <Text className="flex-1 text-center text-lg font-bold text-white">
                        {currentGym.name}
                    </Text>
                    <TouchableOpacity
                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                        onPress={() => router.push('/scan-qr')}
                    >
                        <Ionicons name="qr-code-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Placeholder Features */}
                <Text className="text-slate-100 font-semibold mb-4 text-base">Member Services</Text>

                <View className="flex-row flex-wrap gap-3">
                    <TouchableOpacity
                        className="w-[48%] bg-white/5 p-4 rounded-2xl border border-white/10"
                        onPress={() => router.push('/coach-programs')}
                    >
                        <View className="h-10 w-10 rounded-full bg-purple-500/20 items-center justify-center mb-3">
                            <Ionicons name="fitness-outline" size={22} color="rgb(168,85,247)" />
                        </View>
                        <Text className="text-white font-bold">Coach Programs</Text>
                        <Text className="text-slate-400 text-xs mt-1">Assignments from trainers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-[48%] bg-white/5 p-4 rounded-2xl border border-white/10"
                        onPress={() => router.push('/attendance')}
                    >
                        <View className="h-10 w-10 rounded-full bg-blue-500/20 items-center justify-center mb-3">
                            <Ionicons name="calendar-outline" size={22} color="rgb(59,130,246)" />
                        </View>
                        <Text className="text-white font-bold">Attendance</Text>
                        <Text className="text-slate-400 text-xs mt-1">View your check-ins</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-[100%] bg-white/5 p-4 rounded-2xl border border-white/10 mt-1"
                        onPress={() => router.push('/membership-details')}
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 rounded-full bg-emerald-500/20 items-center justify-center">
                                    <Ionicons name="card-outline" size={22} color="rgb(16,185,129)" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold">Membership Card</Text>
                                    <Text className="text-slate-400 text-xs">Show this at front desk</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="gray" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
