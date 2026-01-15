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
  updateProgram: (programId: string, updates: Partial<Program>) => void;
  deleteProgram: (programId: string) => void;
  completeWorkoutDay: (programId: string, dayId: string) => void;
  getNextWorkoutDay: (programId: string) => ProgramDay | undefined;
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

  const updateProgram = (programId: string, updates: Partial<Program>) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === programId ? { ...p, ...updates } : p))
    );
  };

  const getNextWorkoutDay = (programId: string): ProgramDay | undefined => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return undefined;

    // 1. Try to find "today"
    const today = program.days.find((d) => d.status === "today");
    if (today) return today;

    // 2. Try to find first "upcoming"
    const upcoming = program.days.find((d) => d.status === "upcoming");
    if (upcoming) return upcoming;

    // 3. Fallback to first day if none completed
    if (program.progress.completedWorkouts === 0 && program.days.length > 0) {
      return program.days[0];
    }

    return undefined;
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
        const totalWorkouts =
          p.progress.totalWorkouts || updatedDays.length || 1;

        if (!alreadyCompleted) {
          completedWorkouts = Math.min(
            totalWorkouts,
            completedWorkouts + 1
          );
        }

        // Find next upcoming day to mark as "today"
        // If we just finished a day, find the NEXT one in the list
        const currentDayIndex = updatedDays.findIndex((d) => d.id === dayId);
        let nextDayIndex = -1;

        // Look for the next non-completed day
        for (let i = currentDayIndex + 1; i < updatedDays.length; i++) {
          if (updatedDays[i].status !== 'completed') {
            nextDayIndex = i;
            break;
          }
        }
        // If not found, circle back (or maybe just don't set a today if all done)
        if (nextDayIndex === -1 && completedWorkouts < totalWorkouts) {
          // Try from start
          nextDayIndex = updatedDays.findIndex(d => d.status !== 'completed');
        }

        const finalDays: ProgramDay[] = updatedDays.map((d, idx) => {
          // Unset previous todays? Or just ensure only one?
          // For simplicity, let's just set the identified next day to "today"
          // and ensure the completed one is "completed" (already done above)
          // also we might want to set others to 'upcoming' if they were 'today' but skipped?

          if (idx === nextDayIndex) {
            return { ...d, status: 'today' as DayStatus };
          }
          // If it was 'today' but we moved past it, it should probably stay 'completed' or 'skipped' (but we don't have skipped yet)
          // For now, if it's not the target day and not the next day, leave it alone unless it was 'today' and not completed?
          if (d.status === 'today' && d.id !== dayId && idx !== nextDayIndex) {
            return { ...d, status: 'upcoming' as DayStatus };
          }
          return d;
        });

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
        updateProgram,
        deleteProgram,
        completeWorkoutDay,
        getNextWorkoutDay,
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
