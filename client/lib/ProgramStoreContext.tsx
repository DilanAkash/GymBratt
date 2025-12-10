import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import {
    MOCK_PROGRAMS,
    type DayStatus,
    type Program,
    type ProgramDay
} from "./mockPrograms";

export type AddUserProgramInput = {
  name: string;
  goal: string;
  level: Program["level"];
  daysPerWeek: number;
  summary: string;
  durationWeeks: number;
};

type ProgramStoreValue = {
  programs: Program[];
  addUserProgram: (input: AddUserProgramInput) => Program;
  updateProgramDays: (programId: string, days: ProgramDay[]) => void;
  deleteProgram: (programId: string) => void;
  completeWorkoutDay: (programId: string, dayId: string) => void;
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

    const newProgram: Program = {
      id,
      name: input.name || "My custom program",
      coachName: undefined,
      goal: input.goal,
      level: input.level,
      durationWeeks: input.durationWeeks,
      daysPerWeek: input.daysPerWeek,
      source: "user",
      tags: [
        "Custom",
        `${input.daysPerWeek} days/week`,
        input.level,
      ],
      summary: input.summary || "Custom program created by you.",
      gymRequired: false,
      createdAt: Date.now(),
      progress: {
        completedWorkouts: 0,
        totalWorkouts: 0,
      },
      // 🔥 No days by default. User adds them in the builder.
      days: [],
    };

    setPrograms((prev) => [...prev, newProgram]);
    return newProgram;
  };

  const updateProgramDays = (programId: string, days: ProgramDay[]) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== programId) return p;

        const weeks = new Set(days.map((d) => d.weekIndex));
        const weeksCount = weeks.size || 1;
        const daysPerWeek =
          weeksCount > 0
            ? Math.max(1, Math.round(days.length / weeksCount))
            : p.daysPerWeek;

        const totalWorkouts =
          days.length > 0
            ? days.length *
              Math.max(1, Math.round(p.durationWeeks / weeksCount))
            : p.progress.totalWorkouts;

        return {
          ...p,
          days,
          daysPerWeek,
          progress: {
            ...p.progress,
            totalWorkouts: totalWorkouts || p.progress.totalWorkouts,
          },
        };
      })
    );
  };

  const deleteProgram = (programId: string) => {
    setPrograms((prev) =>
      prev.filter(
        (p) => !(p.id === programId && p.source === "user")
      )
    );
  };

  const completeWorkoutDay = (programId: string, dayId: string) => {
    setPrograms((prev) =>
      prev.map((p): Program => {
        if (p.id !== programId) return p;

        let alreadyCompleted = false;

        // First pass: mark the target day as completed
        const updatedDays: ProgramDay[] = p.days.map(
          (d): ProgramDay => {
            if (d.id === dayId) {
              if (d.status === "completed") alreadyCompleted = true;
              return {
                ...d,
                status: "completed" as DayStatus,
              };
            }
            return d;
          }
        );

        let completedWorkouts = p.progress.completedWorkouts;
        let totalWorkouts =
          p.progress.totalWorkouts || updatedDays.length || 1;

        if (!alreadyCompleted) {
          completedWorkouts = Math.min(
            totalWorkouts,
            completedWorkouts + 1
          );
        }

        // Find next upcoming day to mark as "today"
        const nextUpcoming = updatedDays.find(
          (d) => d.status === "upcoming"
        );

        const finalDays: ProgramDay[] = nextUpcoming
          ? updatedDays.map(
              (d): ProgramDay =>
                d.id === nextUpcoming.id
                  ? {
                      ...d,
                      status: "today" as DayStatus,
                    }
                  : d
            )
          : updatedDays;

        return {
          ...p,
          days: finalDays,
          progress: {
            ...p.progress,
            completedWorkouts,
            totalWorkouts,
          },
        };
      })
    );
  };

  return (
    <ProgramStoreContext.Provider
      value={{
        programs,
        addUserProgram,
        updateProgramDays,
        deleteProgram,
        completeWorkoutDay,
      }}
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
