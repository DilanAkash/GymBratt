import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";
import type { WorkoutLog } from "../lib/mockPrograms";

export default function WorkoutHistoryScreen() {
    const router = useRouter();
    const { getHistory } = useProgramStore();
    const [logs, setLogs] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const history = await getHistory();
            setLogs(history);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const renderItem = ({ item }: { item: WorkoutLog }) => (
        <View className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-zinc-400">
                    {formatDate(item.date)}
                </Text>
                <Text className="text-xs font-bold text-zinc-500">
                    {formatDuration(item.durationSeconds || 0)}
                </Text>
            </View>
            <Text className="text-lg font-bold text-white">{item.programName}</Text>
            <Text className="text-sm text-zinc-400">{item.dayTitle}</Text>

            <View className="mt-3 border-t border-white/5 pt-3">
                <Text className="text-xs text-zinc-500">{item.exercises?.length || 0} Exercises Completed</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#050816]">
            <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-slate-200">
                        Workout History
                    </Text>
                    <View className="h-9 w-9" />
                </View>
            </View>

            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    !loading ? (
                        <View className="mt-20 items-center">
                            <Text className="text-zinc-500">No workouts logged yet.</Text>
                        </View>
                    ) : (
                        <View className="mt-20 items-center">
                            <Text className="text-zinc-500">Loading history...</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}
