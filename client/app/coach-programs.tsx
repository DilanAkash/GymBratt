import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";
import { useGym } from "../lib/GymContext";

export default function CoachProgramsScreen() {
    const router = useRouter();
    const { programs, isLoading } = useProgramStore();
    const { currentGym } = useGym();

    const coachPrograms = programs.filter(p => p.source === 'coach');

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4"
            activeOpacity={0.9}
            onPress={() => router.push({
                pathname: "/program-details",
                params: { programId: item.id }
            })}
        >
            <View className="mb-3 flex-row items-start justify-between">
                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <View className="rounded-full bg-purple-500/20 px-2 py-0.5">
                            <Text className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Coach</Text>
                        </View>
                        {item.coachName && (
                            <Text className="text-xs text-slate-400">by {item.coachName}</Text>
                        )}
                    </View>
                    <Text className="text-lg font-bold text-white mb-1">{item.name}</Text>
                    <Text className="text-xs text-slate-400" numberOfLines={2}>{item.summary}</Text>
                </View>
            </View>

            <View className="flex-row items-center gap-3 border-t border-white/5 pt-3">
                <View className="flex-row items-center gap-1.5">
                    <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                    <Text className="text-xs text-slate-400">{item.daysPerWeek} days/wk</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <Ionicons name="barbell-outline" size={14} color="#94a3b8" />
                    <Text className="text-xs text-slate-400">{item.level}</Text>
                </View>
                <View className="flex-1 items-end">
                    <Ionicons name="chevron-forward" size={16} color="#64748b" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#050816]">
            {/* Header */}
            <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-4">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-base font-semibold text-slate-100">
                            Coach Programs
                        </Text>
                        <Text className="text-xs text-slate-400">
                            {currentGym ? `From ${currentGym.name}` : "Available Plans"}
                        </Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={coachPrograms}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                ListEmptyComponent={
                    <View className="mt-10 items-center justify-center p-6">
                        <View className="h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                            <Ionicons name="clipboard-outline" size={32} color="#64748b" />
                        </View>
                        <Text className="text-slate-400 text-center">
                            No coach programs available yet.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
