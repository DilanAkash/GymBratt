// lib/AttendanceContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export interface AttendanceEntry {
  id: string;
  timestamp: number; // ms since epoch
  gymId: string;
}

type AttendanceContextValue = {
  entries: AttendanceEntry[];
  addCheckIn: (params: { gymId: string }) => void;
};

const AttendanceContext = createContext<
  AttendanceContextValue | undefined
>(undefined);

export const AttendanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);

  const addCheckIn = ({ gymId }: { gymId: string }) => {
    const now = Date.now();
    const id = now.toString();

    setEntries((prev) => [
      ...prev,
      {
        id,
        timestamp: now,
        gymId,
      },
    ]);
  };

  return (
    <AttendanceContext.Provider value={{ entries, addCheckIn }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = (): AttendanceContextValue => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) {
    throw new Error(
      "useAttendance must be used within an AttendanceProvider"
    );
  }
  return ctx;
};
