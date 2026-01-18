import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";

const PRIMARY = "#0df20d";

export default function AddMealScreen() {
    const router = useRouter();
    const { logMeal } = useProgramStore();
    const [isSaving, setIsSaving] = useState(false);

    // Form
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fats, setFats] = useState("");
    const [mealType, setMealType] = useState("Snack");

    const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

    const handleSave = async () => {
        if (!name || !calories) {
            Alert.alert("Missing Input", "Please enter at least meal name and calories.");
            return;
        }

        setIsSaving(true);
        try {
            const meal = {
                name,
                date: Date.now(),
                type: mealType.toLowerCase(),
                calories: parseInt(calories) || 0,
                macros: {
                    protein: parseInt(protein) || 0,
                    carbs: parseInt(carbs) || 0,
                    fats: parseInt(fats) || 0,
                }
            };

            await logMeal(meal);
            router.back();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to save meal.");
        } finally {
            setIsSaving(false);
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
                        Log Meal
                    </Text>

                    <View className="h-10 w-10" />
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                {/* Name */}
                <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-slate-300">Meal Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Oatmeal with protein"
                        placeholderTextColor="#6b7280"
                        className="rounded-xl bg-white/10 px-4 py-3 text-base text-white"
                    />
                </View>

                {/* Meal Type */}
                <View className="mb-6">
                    <Text className="mb-2 text-sm font-semibold text-slate-300">Meal Type</Text>
                    <View className="flex-row gap-2">
                        {MEAL_TYPES.map(type => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setMealType(type)}
                                className={`rounded-full px-4 py-2 border ${mealType === type ? 'bg-lime-500/20 border-lime-500' : 'bg-white/5 border-white/10'}`}
                            >
                                <Text className={`text-xs font-medium ${mealType === type ? 'text-lime-400' : 'text-slate-400'}`}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Calories */}
                <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-slate-300">Calories (kcal)</Text>
                    <TextInput
                        value={calories}
                        onChangeText={setCalories}
                        placeholder="0"
                        keyboardType="numeric"
                        placeholderTextColor="#6b7280"
                        className="rounded-xl bg-white/10 px-4 py-3 text-base text-white"
                    />
                </View>

                {/* Macros */}
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <Text className="mb-2 text-xs font-semibold text-slate-400">Protein (g)</Text>
                        <TextInput
                            value={protein}
                            onChangeText={setProtein}
                            placeholder="0"
                            keyboardType="numeric"
                            placeholderTextColor="#6b7280"
                            className="rounded-xl bg-white/10 px-4 py-3 text-center text-white"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="mb-2 text-xs font-semibold text-slate-400">Carbs (g)</Text>
                        <TextInput
                            value={carbs}
                            onChangeText={setCarbs}
                            placeholder="0"
                            keyboardType="numeric"
                            placeholderTextColor="#6b7280"
                            className="rounded-xl bg-white/10 px-4 py-3 text-center text-white"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="mb-2 text-xs font-semibold text-slate-400">Fat (g)</Text>
                        <TextInput
                            value={fats}
                            onChangeText={setFats}
                            placeholder="0"
                            keyboardType="numeric"
                            placeholderTextColor="#6b7280"
                            className="rounded-xl bg-white/10 px-4 py-3 text-center text-white"
                        />
                    </View>
                </View>
            </ScrollView>

            <View className="border-t border-white/10 bg-[#050816]/95 px-4 pb-6 pt-3">
                <TouchableOpacity
                    className="h-14 w-full flex-row items-center justify-center rounded-xl bg-[rgb(13,242,13)]"
                    activeOpacity={0.9}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#050816" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#050816" />
                            <Text className="ml-2 text-base font-bold text-[#050816]">
                                Log Meal
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
