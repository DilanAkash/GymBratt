import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAppUser } from "./UserContext"; // Assumption: UserContext exists
import { programService } from "./services/programService";
import {
  MOCK_PROGRAMS,
  type DayStatus,
  type Program,
  type ProgramDay,
  type WorkoutLog,
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
  isLoading: boolean;
  addUserProgram: (input: AddUserProgramInput) => Promise<Program>;
  updateProgramDays: (programId: string, days: ProgramDay[]) => Promise<void>;
  updateProgram: (programId: string, updates: Partial<Program>) => Promise<void>;
  deleteProgram: (programId: string) => Promise<void>;
  completeWorkoutDay: (programId: string, dayId: string) => Promise<void>;
  getNextWorkoutDay: (programId: string) => ProgramDay | undefined;
  logWorkout: (log: WorkoutLog) => Promise<void>;
  getHistory: () => Promise<WorkoutLog[]>;
  addProgressEntry: (entry: any) => Promise<void>;
  getProgressEntries: () => Promise<any[]>;
  uploadProgressPhoto: (uri: string) => Promise<string>;
  logMeal: (meal: any) => Promise<void>;
  getDailyNutrition: (dateArg: number) => Promise<any[]>;
};

const ProgramStoreContext = createContext<ProgramStoreValue | undefined>(
  undefined
);

export const ProgramStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAppUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to programs when user is logged in
  useEffect(() => {
    if (!user || !user.uid) {
      setPrograms([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = programService.subscribeToUserPrograms(user.uid, (fetchedPrograms) => {
      setPrograms(fetchedPrograms);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addUserProgram = async (input: AddUserProgramInput): Promise<Program> => {
    if (!user || !user.uid) throw new Error("User not authenticated");

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
      days: [],
    };

    await programService.addProgram(user.uid, newProgram);
    return newProgram;
  };

  const updateProgramDays = async (programId: string, days: ProgramDay[]) => {
    if (!user || !user.uid) return;
    await programService.updateProgramDays(user.uid, programId, days);
  };

  const deleteProgram = async (programId: string) => {
    if (!user || !user.uid) return;
    await programService.deleteProgram(user.uid, programId);
  };

  const updateProgram = async (programId: string, updates: Partial<Program>) => {
    if (!user || !user.uid) return;
    await programService.updateProgram(user.uid, programId, updates);
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

  const completeWorkoutDay = async (programId: string, dayId: string) => {
    if (!user || !user.uid) return;

    const program = programs.find((p) => p.id === programId);
    if (!program) return;

    let alreadyCompleted = false;

    // First pass: mark target day complete
    const updatedDays: ProgramDay[] = program.days.map((d) => {
      if (d.id === dayId) {
        if (d.status === "completed") alreadyCompleted = true;
        return { ...d, status: "completed" as DayStatus };
      }
      return d;
    });

    let completedWorkouts = program.progress.completedWorkouts;
    const totalWorkouts = program.progress.totalWorkouts || updatedDays.length || 1;

    if (!alreadyCompleted) {
      completedWorkouts = Math.min(totalWorkouts, completedWorkouts + 1);
    }

    // Find next day logic (simplified)
    const currentDayIndex = updatedDays.findIndex((d) => d.id === dayId);
    let nextDayIndex = -1;

    for (let i = currentDayIndex + 1; i < updatedDays.length; i++) {
      if (updatedDays[i].status !== 'completed') {
        nextDayIndex = i;
        break;
      }
    }

    if (nextDayIndex === -1 && completedWorkouts < totalWorkouts) {
      nextDayIndex = updatedDays.findIndex(d => d.status !== 'completed');
    }

    const finalDays: ProgramDay[] = updatedDays.map((d, idx) => {
      if (idx === nextDayIndex) return { ...d, status: 'today' as DayStatus };
      if (d.status === 'today' && d.id !== dayId && idx !== nextDayIndex) {
        return { ...d, status: 'upcoming' as DayStatus };
      }
      return d;
    });

    await programService.updateProgram(user.uid, programId, {
      days: finalDays,
      progress: {
        ...program.progress,
        completedWorkouts,
        totalWorkouts
      }
    });
  };

  const logWorkout = async (log: WorkoutLog) => {
    if (!user || !user.uid) return;
    const safeLog = { ...log, userId: user.uid };
    await programService.addWorkoutLog(user.uid, safeLog);
  };

  const getHistory = async (): Promise<WorkoutLog[]> => {
    if (!user || !user.uid) return [];
    return (await programService.getWorkoutLogs(user.uid)) as WorkoutLog[];
  };

  const addProgressEntry = async (entry: any) => {
    if (!user || !user.uid) return;
    const safeEntry = { ...entry, userId: user.uid };
    await programService.addProgressEntry(user.uid, safeEntry);
  };

  const getProgressEntries = async (): Promise<any[]> => {
    if (!user || !user.uid) return [];
    return await programService.getProgressEntries(user.uid);
  };

  const uploadProgressPhoto = async (uri: string): Promise<string> => {
    if (!user || !user.uid) throw new Error("User not authenticated");
    return await programService.uploadProgressPhoto(user.uid, uri);
  };

  const logMeal = async (meal: any) => {
    if (!user || !user.uid) return;
    const safeMeal = { ...meal, userId: user.uid };
    await programService.logMeal(user.uid, safeMeal);
  };

  const getDailyNutrition = async (dateArg: number): Promise<any[]> => {
    if (!user || !user.uid) return [];
    // Start of day
    const start = new Date(dateArg);
    start.setHours(0, 0, 0, 0);
    // End of day
    const end = new Date(dateArg);
    end.setHours(23, 59, 59, 999);

    return await programService.getDailyNutrition(user.uid, start.getTime(), end.getTime());
  };



  return (
    <ProgramStoreContext.Provider
      value={{
        programs,
        isLoading,
        addUserProgram,
        updateProgramDays,
        updateProgram,
        deleteProgram,
        completeWorkoutDay,
        getNextWorkoutDay,
        logWorkout,
        getHistory,
        addProgressEntry,
        getProgressEntries,
        uploadProgressPhoto,
        logMeal,
        getDailyNutrition,
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
