import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgramStore } from "../lib/ProgramStoreContext";
import type { Program } from "../lib/mockPrograms";

const GOALS = ["Strength", "Hypertrophy", "Fat Loss", "Endurance"];
const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
const EXPERIENCE_OPTIONS: Program["level"][] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];
const WEEK_OPTIONS = [4, 6, 8, 10, 12, 16, 20, 24];

export default function NewProgramScreen() {
  const { addUserProgram } = useProgramStore();

  const [name, setName] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(3);
  const [selectedExperience, setSelectedExperience] =
    useState<Program["level"]>("Beginner");
  const [weeks, setWeeks] = useState<number>(12);
  const [programType, setProgramType] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Please enter a program name.");
      return;
    }
    if (!selectedGoal) {
      setError("Please choose a main goal.");
      return;
    }
    if (!selectedDays) {
      setError("Please select training days per week.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const summary =
        notes.trim() ||
        `Custom ${selectedGoal.toLowerCase()} program, ${selectedDays} days/week for ${weeks} weeks.`;

      const newProgram = await addUserProgram({
        name: name.trim(),
        goal: selectedGoal,
        level: selectedExperience,
        daysPerWeek: selectedDays,
        summary,
        durationWeeks: weeks,
      });

      router.replace({
        pathname: "/new-program-builder",
        params: { programId: newProgram.id },
      });
    } catch (e) {
      console.error("Error creating program", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New program</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Build your plan</Text>
            <Text style={styles.sectionTitle}>Program basics</Text>
            <Text style={styles.sectionSubtitle}>
              Start with the core details. You can fine-tune sessions in the
              next step.
            </Text>
          </View>

          {/* Program name */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Program name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Lean Bulk 12 Weeks"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />
          </View>

          {/* Main goal */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Main goal</Text>
            <View style={styles.chipRow}>
              {GOALS.map((goal) => {
                const selected = selectedGoal === goal;
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => setSelectedGoal(goal)}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Experience level */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Experience level</Text>
            <View style={styles.chipRow}>
              {EXPERIENCE_OPTIONS.map((option) => {
                const selected = selectedExperience === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSelectedExperience(option)}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Days per week */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Training days per week</Text>
            <View style={styles.chipRow}>
              {DAYS_OPTIONS.map((d) => {
                const selected = selectedDays === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setSelectedDays(d)}
                    style={[
                      styles.numberChip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.hint}>
              1–2 = light, 3–5 = standard split, 6–7 = high frequency.
            </Text>
          </View>

          {/* Duration (weeks) */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Duration (weeks)</Text>

            <View style={styles.weekCounter}>
              <TouchableOpacity
                onPress={() => setWeeks(Math.max(1, weeks - 1))}
                style={styles.counterButton}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>

              <View style={styles.counterDisplay}>
                <Text style={styles.counterText}>{weeks}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setWeeks(weeks + 1)}
                style={styles.counterButton}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.chipRow}>
              {WEEK_OPTIONS.map((w) => {
                const selected = weeks === w;
                return (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setWeeks(w)}
                    style={[
                      styles.numberChip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {w}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.hint}>
              You can tweak this later. Most people stick with 8–12 weeks.
            </Text>
          </View>

          {/* Optional details */}
          <View>
            {/* Program Type */}
            <View style={styles.section}>
              <Text style={styles.inputLabel}>Program type (optional)</Text>
              <TextInput
                value={programType}
                onChangeText={setProgramType}
                placeholder="e.g. Push/Pull/Legs, Upper/Lower, Full-body"
                placeholderTextColor="#6b7280"
                style={styles.input}
              />
            </View>

            {/* Description / Notes */}
            <View style={styles.section}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special focus, equipment limitations, or notes for future you."
                placeholderTextColor="#6b7280"
                multiline
                textAlignVertical="top"
                style={styles.textArea}
              />
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={isSaving || !name.trim() || !selectedGoal || !selectedDays}
            style={[
              styles.createButton,
              (isSaving || !name.trim() || !selectedGoal || !selectedDays) &&
              styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
          >
            <Text
              style={[
                styles.createButtonText,
                (isSaving || !name.trim() || !selectedGoal || !selectedDays) &&
                styles.createButtonTextDisabled,
              ]}
            >
              {isSaving ? "Creating..." : "Next: Build program"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.draftText}>
              Save as draft (coming soon)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(5, 8, 22, 0.8)",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    flex: 1,
    paddingHorizontal: 8,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "rgb(241, 245, 249)",
  },
  headerSpacer: {
    height: 36,
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: "rgb(113, 113, 122)",
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(248, 250, 252)",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgb(161, 161, 170)",
  },
  inputLabel: {
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "rgb(212, 212, 216)",
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  textArea: {
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#ffffff",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {
    borderColor: "rgb(163, 230, 53)",
    backgroundColor: "rgba(163, 230, 53, 0.2)",
  },
  chipText: {
    fontSize: 14,
    color: "rgb(212, 212, 216)",
  },
  chipTextSelected: {
    color: "rgb(190, 242, 100)",
  },
  numberChip: {
    height: 36,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  hint: {
    marginTop: 8,
    fontSize: 11,
    color: "rgb(113, 113, 122)",
  },
  weekCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  counterButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  counterDisplay: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  counterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  errorBox: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 12,
    color: "rgb(254, 202, 202)",
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(5, 8, 22, 0.95)",
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  createButton: {
    marginBottom: 12,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgb(13, 242, 13)",
    shadowColor: "rgb(13, 242, 13)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  createButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#050816",
  },
  createButtonTextDisabled: {
    color: "rgb(113, 113, 122)",
  },
  draftText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "rgb(163, 230, 53)",
  },
});
