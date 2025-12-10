import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Program } from "../../lib/mockPrograms";
import { useProgramStore } from "../../lib/ProgramStoreContext";

type ProgramCardProps = {
  program: Program;
  onPress: () => void;
  onDelete?: () => void;
};

function ProgramCard({ program, onPress, onDelete }: ProgramCardProps) {
  const completion =
    program.progress.totalWorkouts > 0
      ? program.progress.completedWorkouts /
        program.progress.totalWorkouts
      : 0;

  const percentage = Math.round(completion * 100);
  const sourceLabel =
    program.source === "coach" ? "Coach program" : "My program";

  return (
    <View className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
      <View className="mb-2 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {sourceLabel}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
          >
            <Text className="mt-1 text-[15px] font-semibold text-slate-50">
              {program.name}
            </Text>
            <Text className="mt-1 text-xs text-zinc-400">
              {program.goal}
            </Text>
          </TouchableOpacity>

          <View className="mt-2 flex-row flex-wrap gap-2">
            <View className="rounded-full bg-white/10 px-2.5 py-1">
              <Text className="text-[11px] text-zinc-300">
                {program.durationWeeks} weeks
              </Text>
            </View>
            <View className="rounded-full bg-white/10 px-2.5 py-1">
              <Text className="text-[11px] text-zinc-300">
                {program.daysPerWeek} days/week
              </Text>
            </View>
            <View className="rounded-full bg-white/10 px-2.5 py-1">
              <Text className="text-[11px] text-zinc-300">
                {program.level}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          {program.coachName && (
            <View className="mb-2 rounded-full bg-white/10 px-2.5 py-1">
              <Text className="text-[11px] text-zinc-300">
                {program.coachName}
              </Text>
            </View>
          )}

          <View className="items-end">
            <Text className="text-[11px] text-zinc-400">
              Progress
            </Text>
            <Text className="mt-0.5 text-sm font-semibold text-slate-50">
              {percentage}%
            </Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              className="mt-3 h-8 w-8 items-center justify-center rounded-full bg-white/10"
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="#fca5a5"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress bar */}
      <View className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <View
          className="h-1.5 rounded-full bg-[#0df20d]"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const { programs, deleteProgram } = useProgramStore();

  const coachPrograms = programs.filter((p) => p.source === "coach");
  const myPrograms = programs.filter((p) => p.source === "user");

  const confirmDeleteProgram = (program: Program) => {
    Alert.alert(
      "Delete program",
      `Are you sure you want to delete "${program.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProgram(program.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Training
            </Text>
            <Text className="mt-2 text-2xl font-bold text-slate-50">
              Workouts
            </Text>
            <Text className="mt-1 text-sm text-zinc-400">
              Your active programs and daily sessions.
            </Text>
          </View>
        </View>

        {/* Coach Programs */}
        {coachPrograms.length > 0 && (
          <View className="mb-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-slate-50">
                Coach programs
              </Text>
              <Text className="text-xs text-zinc-500">
                {coachPrograms.length} program
                {coachPrograms.length > 1 ? "s" : ""}
              </Text>
            </View>

            {coachPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onPress={() =>
                  router.push({
                    pathname: "/program-details",
                    params: { programId: program.id },
                  })
                }
              />
            ))}
          </View>
        )}

        {/* My Programs */}
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-50">
              My programs
            </Text>
            <Text className="text-xs text-zinc-500">
              {myPrograms.length} program
              {myPrograms.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {myPrograms.length === 0 ? (
            <View className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4">
              <Text className="text-xs text-zinc-400">
                You don&apos;t have any custom programs yet. Tap the +
                button to create your own training split.
              </Text>
            </View>
          ) : (
            myPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onPress={() =>
                  router.push({
                    pathname: "/program-details",
                    params: { programId: program.id },
                  })
                }
                onDelete={() => confirmDeleteProgram(program)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity
        className="absolute bottom-7 right-5 h-14 w-14 items-center justify-center rounded-full bg-[#0df20d] shadow-lg shadow-[rgba(13,242,13,0.5)]"
        onPress={() => router.push("/new-program")}
      >
        <Ionicons name="add" size={26} color="#020617" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
