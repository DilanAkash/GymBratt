// lib/AttendanceContext.tsx
import { addDoc, collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { auth, db } from "./firebase";

export interface AttendanceEntry {
  id: string;
  timestamp: number; // ms since epoch
  gymId: string;
  userId?: string;
}

type AttendanceContextValue = {
  entries: AttendanceEntry[];
  addCheckIn: (params: { gymId: string }) => Promise<void>;
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

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setEntries([]);
      return;
    }

    const q = query(
      collection(db, "attendance"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AttendanceEntry[];
      setEntries(fetched);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const addCheckIn = async ({ gymId }: { gymId: string }) => {
    const now = Date.now();
    const userId = auth.currentUser?.uid || "mock-user-id";

    try {
      // Optimistic update
      const tempId = now.toString();
      const newEntry: AttendanceEntry = {
        id: tempId,
        timestamp: now,
        gymId,
        userId,
      };
      setEntries((prev) => [...prev, newEntry]);

      // Write to Firestore
      await addDoc(collection(db, "attendance"), {
        gymId,
        userId,
        timestamp: now,
        deviceCheckIn: true,
      });

    } catch (error) {
      console.error("Error logging attendance:", error);
      // revert optimistic? For now just log error.
      throw error;
    }
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
