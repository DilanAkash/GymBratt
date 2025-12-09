// lib/mockPrograms.ts

export type ProgramSource = "coach" | "user";

export type DayStatus = "completed" | "today" | "upcoming";

export interface ProgramSetSchema {
  id: string;
  label: string; // e.g. "Set 1"
  targetReps: string; // e.g. "8–10 reps"
  rpe?: string; // e.g. "RPE 8"
  rest?: string; // e.g. "Rest 90s"
}

export interface ProgramExercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  notes?: string;
  sets: ProgramSetSchema[];
  videoUrl?: string;
}

export interface ProgramDay {
  id: string;
  title: string; // e.g. "Day 1 — Push"
  subtitle: string; // e.g. "Chest, Shoulders, Triceps"
  focus: string; // e.g. "Upper body push"
  weekIndex: number; // 1-based week number
  dayIndex: number; // 1-based day number within week
  status: DayStatus;
  exercises: ProgramExercise[];
}

export interface Program {
  id: string;
  name: string;
  coachName?: string;
  goal: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  daysPerWeek: number;
  source: ProgramSource;
  tags: string[];
  summary: string;
  gymRequired: boolean;
  createdAt: number;
  progress: {
    completedWorkouts: number;
    totalWorkouts: number;
  };
  days: ProgramDay[];
}

export const MOCK_PROGRAMS: Program[] = [
  {
    id: "lean-bulk-12w",
    name: "Lean Bulk 12 Weeks",
    coachName: "Coach Alex",
    goal: "Strength & Hypertrophy",
    level: "Intermediate",
    durationWeeks: 12,
    daysPerWeek: 4,
    source: "coach",
    tags: ["Lean bulk", "Strength", "Hypertrophy", "4 days/week"],
    summary:
      "A structured 12-week lean bulk program focusing on progressive overload, compound lifts, and smart accessory work.",
    gymRequired: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    progress: {
      completedWorkouts: 5,
      totalWorkouts: 48, // 12 weeks x 4 days
    },
    days: [
      {
        id: "lean-bulk-12w-w1-d1",
        title: "Day 1 — Push",
        subtitle: "Chest, Shoulders, Triceps",
        focus: "Upper body push strength",
        weekIndex: 1,
        dayIndex: 1,
        status: "today",
        exercises: [
          {
            id: "bench-press",
            name: "Barbell Bench Press",
            muscleGroup: "Chest",
            equipment: "Barbell",
            notes:
              "Keep your shoulder blades retracted and feet planted. Control the eccentric.",
            videoUrl: "",
            sets: [
              {
                id: "bench-s1",
                label: "Set 1",
                targetReps: "8–10 reps",
                rpe: "RPE 7",
                rest: "Rest 90s",
              },
              {
                id: "bench-s2",
                label: "Set 2",
                targetReps: "8–10 reps",
                rpe: "RPE 8",
                rest: "Rest 90s",
              },
              {
                id: "bench-s3",
                label: "Set 3",
                targetReps: "6–8 reps",
                rpe: "RPE 9",
                rest: "Rest 120s",
              },
            ],
          },
          {
            id: "incline-db-press",
            name: "Incline Dumbbell Press",
            muscleGroup: "Chest",
            equipment: "Dumbbells",
            notes: "Slight incline, control the bottom stretch.",
            videoUrl: "",
            sets: [
              {
                id: "idp-s1",
                label: "Set 1",
                targetReps: "10–12 reps",
                rpe: "RPE 8",
                rest: "Rest 90s",
              },
              {
                id: "idp-s2",
                label: "Set 2",
                targetReps: "10–12 reps",
                rpe: "RPE 8",
                rest: "Rest 90s",
              },
            ],
          },
          {
            id: "lat-raise",
            name: "Dumbbell Lateral Raise",
            muscleGroup: "Shoulders",
            equipment: "Dumbbells",
            notes: "Soft bend in elbows, raise to shoulder height.",
            videoUrl: "",
            sets: [
              {
                id: "lat-s1",
                label: "Set 1",
                targetReps: "12–15 reps",
                rpe: "RPE 7",
                rest: "Rest 60s",
              },
              {
                id: "lat-s2",
                label: "Set 2",
                targetReps: "12–15 reps",
                rpe: "RPE 7",
                rest: "Rest 60s",
              },
            ],
          },
        ],
      },
      {
        id: "lean-bulk-12w-w1-d2",
        title: "Day 2 — Pull",
        subtitle: "Back, Biceps",
        focus: "Upper body pull strength",
        weekIndex: 1,
        dayIndex: 2,
        status: "upcoming",
        exercises: [
          {
            id: "deadlift",
            name: "Conventional Deadlift",
            muscleGroup: "Back",
            equipment: "Barbell",
            notes: "Neutral spine, push the floor away.",
            videoUrl: "",
            sets: [
              {
                id: "dl-s1",
                label: "Set 1",
                targetReps: "5 reps",
                rpe: "RPE 7",
                rest: "Rest 180s",
              },
              {
                id: "dl-s2",
                label: "Set 2",
                targetReps: "5 reps",
                rpe: "RPE 8",
                rest: "Rest 180s",
              },
              {
                id: "dl-s3",
                label: "Set 3",
                targetReps: "5 reps",
                rpe: "RPE 8.5",
                rest: "Rest 180s",
              },
            ],
          },
        ],
      },
      {
        id: "lean-bulk-12w-w1-d3",
        title: "Day 3 — Legs",
        subtitle: "Quads, Hamstrings, Glutes",
        focus: "Lower body strength",
        weekIndex: 1,
        dayIndex: 3,
        status: "upcoming",
        exercises: [
          {
            id: "back-squat",
            name: "Barbell Back Squat",
            muscleGroup: "Legs",
            equipment: "Barbell",
            notes: "Depth to parallel, brace your core.",
            videoUrl: "",
            sets: [
              {
                id: "sqt-s1",
                label: "Set 1",
                targetReps: "6–8 reps",
                rpe: "RPE 7",
                rest: "Rest 150s",
              },
              {
                id: "sqt-s2",
                label: "Set 2",
                targetReps: "6–8 reps",
                rpe: "RPE 8",
                rest: "Rest 150s",
              },
            ],
          },
        ],
      },
      {
        id: "lean-bulk-12w-w1-d4",
        title: "Day 4 — Upper Accessory",
        subtitle: "Arms, Shoulders",
        focus: "Accessory volume",
        weekIndex: 1,
        dayIndex: 4,
        status: "upcoming",
        exercises: [
          {
            id: "cable-pushdown",
            name: "Cable Triceps Pushdown",
            muscleGroup: "Triceps",
            equipment: "Cable",
            notes: "Lock elbows by your sides, control the top.",
            videoUrl: "",
            sets: [
              {
                id: "ctp-s1",
                label: "Set 1",
                targetReps: "12–15 reps",
                rpe: "RPE 8",
                rest: "Rest 60s",
              },
              {
                id: "ctp-s2",
                label: "Set 2",
                targetReps: "12–15 reps",
                rpe: "RPE 8",
                rest: "Rest 60s",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "push-pull-legs-custom",
    name: "Push · Pull · Legs (Custom)",
    coachName: undefined,
    goal: "Build muscle & stay consistent",
    level: "Beginner",
    durationWeeks: 8,
    daysPerWeek: 3,
    source: "user",
    tags: ["Custom", "PPL", "3 days/week"],
    summary:
      "Simple and effective PPL split that you can run year-round and adjust as you progress.",
    gymRequired: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    progress: {
      completedWorkouts: 3,
      totalWorkouts: 24, // 8 weeks x 3 days
    },
    days: [
      {
        id: "ppl-w1-d1",
        title: "Push Day",
        subtitle: "Chest, Shoulders, Triceps",
        focus: "Upper body push basics",
        weekIndex: 1,
        dayIndex: 1,
        status: "completed",
        exercises: [
          {
            id: "pushups",
            name: "Push-ups",
            muscleGroup: "Chest",
            equipment: "Bodyweight",
            notes: "Keep core tight, full range of motion.",
            sets: [
              {
                id: "pu-s1",
                label: "Set 1",
                targetReps: "AMRAP",
                rest: "Rest 60–90s",
              },
              {
                id: "pu-s2",
                label: "Set 2",
                targetReps: "AMRAP",
                rest: "Rest 60–90s",
              },
            ],
          },
        ],
      },
      {
        id: "ppl-w1-d2",
        title: "Pull Day",
        subtitle: "Back, Biceps",
        focus: "Upper body pull basics",
        weekIndex: 1,
        dayIndex: 2,
        status: "upcoming",
        exercises: [
          {
            id: "inverted-row",
            name: "Inverted Rows",
            muscleGroup: "Back",
            equipment: "Bodyweight",
            notes: "Keep body straight, pull chest to bar.",
            sets: [
              {
                id: "ir-s1",
                label: "Set 1",
                targetReps: "8–12 reps",
                rest: "Rest 90s",
              },
              {
                id: "ir-s2",
                label: "Set 2",
                targetReps: "8–12 reps",
                rest: "Rest 90s",
              },
            ],
          },
        ],
      },
      {
        id: "ppl-w1-d3",
        title: "Leg Day",
        subtitle: "Quads, Hamstrings, Glutes",
        focus: "Lower body basics",
        weekIndex: 1,
        dayIndex: 3,
        status: "upcoming",
        exercises: [
          {
            id: "bodyweight-squat",
            name: "Bodyweight Squat",
            muscleGroup: "Legs",
            equipment: "Bodyweight",
            notes: "Keep heels on floor, chest up.",
            sets: [
              {
                id: "bws-s1",
                label: "Set 1",
                targetReps: "12–15 reps",
                rest: "Rest 60s",
              },
              {
                id: "bws-s2",
                label: "Set 2",
                targetReps: "12–15 reps",
                rest: "Rest 60s",
              },
            ],
          },
        ],
      },
    ],
  },
];
