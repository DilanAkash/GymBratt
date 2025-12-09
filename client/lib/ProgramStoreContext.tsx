import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import {
    MOCK_PROGRAMS,
    type Program,
    type ProgramDay,
    type ProgramExercise
} from "./mockPrograms";

export type AddUserProgramInput = {
  name: string;
  goal: string;
  level: Program["level"];
  daysPerWeek: number;
  summary: string;
};

type ProgramStoreValue = {
  programs: Program[];
  addUserProgram: (input: AddUserProgramInput) => Program;
  updateProgramDays: (programId: string, days: ProgramDay[]) => void;
};

const ProgramStoreContext = createContext<ProgramStoreValue | undefined>(
  undefined
);

export const ProgramStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);

  const addUserProgram = (input: AddUserProgramInput): Program => {
    const id = `user-${Date.now()}`;

    // Simple base template: full-body-ish, works for any day.
    const baseExercises: ProgramExercise[] = [
      {
        id: `${id}-squat`,
        name: "Squat variation",
        muscleGroup: "Legs",
        equipment: "Barbell / Machine / Bodyweight",
        notes: "Keep heels down, brace core, control depth.",
        sets: [
          {
            id: "s1",
            label: "Set 1",
            targetReps: "8–10 reps",
            rpe: "RPE 7–8",
            rest: "Rest 90s",
            restSeconds: 90,
          },
          {
            id: "s2",
            label: "Set 2",
            targetReps: "8–10 reps",
            rpe: "RPE 8",
            rest: "Rest 90s",
            restSeconds: 90,
          },
        ],
      },
      {
        id: `${id}-press`,
        name: "Press variation",
        muscleGroup: "Chest / Shoulders",
        equipment: "Barbell / Dumbbells / Machine",
        notes: "Control the lowering, keep shoulders stable.",
        sets: [
          {
            id: "s1",
            label: "Set 1",
            targetReps: "8–12 reps",
            rpe: "RPE 7",
            rest: "Rest 90s",
            restSeconds: 90,
          },
          {
            id: "s2",
            label: "Set 2",
            targetReps: "8–12 reps",
            rpe: "RPE 8",
            rest: "Rest 90s",
            restSeconds: 90,
          },
        ],
      },
      {
        id: `${id}-row`,
        name: "Row / Pull variation",
        muscleGroup: "Back",
        equipment: "Barbell / Cable / Machine",
        notes: "Pull with your back, control the negative.",
        sets: [
          {
            id: "s1",
            label: "Set 1",
            targetReps: "8–12 reps",
            rpe: "RPE 7–8",
            rest: "Rest 90s",
            restSeconds: 90,
          },
          {
            id: "s2",
            label: "Set 2",
            targetReps: "8–12 reps",
            rpe: "RPE 8",
            rest: "Rest 90s",
            restSeconds: 90,
          },
        ],
      },
    ];

    const dayTitles = [
      "Day 1 — Push focus",
      "Day 2 — Pull focus",
      "Day 3 — Legs focus",
      "Day 4 — Upper volume",
      "Day 5 — Mixed accessories",
    ];

    const daysPerWeek = Math.max(1, input.daysPerWeek);

    const createdDays: ProgramDay[] = Array.from(
      { length: daysPerWeek },
      (_, i) => {
        const dayIndex = i + 1;
        const title =
          dayTitles[i] || `Day ${dayIndex} — Custom session`;

        return {
          id: `${id}-w1-d${dayIndex}`,
          title,
          subtitle: input.goal,
          focus: input.goal,
          weekIndex: 1,
          dayIndex,
          status: i === 0 ? "today" : "upcoming",
          exercises: baseExercises,
        };
      }
    );

    const totalWorkouts = createdDays.length * 4; // 4 weeks rough estimate

    const newProgram: Program = {
      id,
      name: input.name || "My custom program",
      coachName: undefined,
      goal: input.goal,
      level: input.level,
      durationWeeks: 8,
      daysPerWeek,
      source: "user",
      tags: [
        "Custom",
        `${daysPerWeek} days/week`,
        input.level,
      ],
      summary: input.summary || "Custom program created by you.",
      gymRequired: false,
      createdAt: Date.now(),
      progress: {
        completedWorkouts: 0,
        totalWorkouts,
      },
      days: createdDays,
    };

    setPrograms((prev) => [...prev, newProgram]);
    return newProgram;
  };

  const updateProgramDays = (programId: string, days: ProgramDay[]) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              days,
              daysPerWeek: Math.max(
                1,
                new Set(days.map((d) => d.dayIndex)).size
              ),
            }
          : p
      )
    );
  };

  return (
    <ProgramStoreContext.Provider
      value={{ programs, addUserProgram, updateProgramDays }}
    >
      {children}
    </ProgramStoreContext.Provider>
  );
};

export const useProgramStore = (): ProgramStoreValue => {
  const ctx = useContext(ProgramStoreContext);
  if (!ctx) {
    throw new Error(
      "useProgramStore must be used within a ProgramStoreProvider"
    );
  }
  return ctx;
};
