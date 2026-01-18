import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    updateDoc,
    serverTimestamp,
    getDoc,
    orderBy,
    limit,
    onSnapshot,
    addDoc,
    where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import type { Program, ProgramDay } from "../mockPrograms";

// Helper to sanitize undefined values for Firestore
const sanitize = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (value === undefined) return null;
        return value;
    }));
};

// Users sub-collection path
const getUserProgramsRef = (userId: string) => collection(db, "users", userId, "programs");

export const programService = {
    // Subscribe to user's programs (real-time)
    subscribeToUserPrograms: (userId: string, onUpdate: (programs: Program[]) => void) => {
        const q = query(getUserProgramsRef(userId));
        return onSnapshot(q, (snapshot) => {
            const programs = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Program[];
            onUpdate(programs);
        });
    },

    // Fetch all user programs (one-time)
    fetchUserPrograms: async (userId: string): Promise<Program[]> => {
        const q = query(getUserProgramsRef(userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })) as Program[];
    },

    // Add a new program
    addProgram: async (userId: string, program: Program): Promise<void> => {
        const programRef = doc(getUserProgramsRef(userId), program.id);
        await setDoc(programRef, sanitize({
            ...program,
            createdAt: serverTimestamp(), // Use server timestamp
        }));
    },

    // Update an existing program
    updateProgram: async (userId: string, programId: string, updates: Partial<Program>): Promise<void> => {
        const programRef = doc(db, "users", userId, "programs", programId);
        await updateDoc(programRef, sanitize(updates));
    },

    // Delete a program
    deleteProgram: async (userId: string, programId: string): Promise<void> => {
        const programRef = doc(db, "users", userId, "programs", programId);
        await deleteDoc(programRef);
    },

    // Specific helper for updating days
    updateProgramDays: async (userId: string, programId: string, days: ProgramDay[]): Promise<void> => {
        const programRef = doc(db, "users", userId, "programs", programId);

        // Recalculate basic stats
        const daysPerWeek = days.length > 0
            ? Math.max(1, Math.round(days.length / (days[days.length - 1].weekIndex || 1)))
            : 0;

        await updateDoc(programRef, sanitize({
            days,
            // Optional: update computed fields if needed, but client might handle logic updates before sending
        }));
    },

    // Add a completed workout log
    addWorkoutLog: async (userId: string, log: any): Promise<void> => {
        // 'log' should be of type WorkoutLog but avoiding circular deps if needed
        const logsRef = collection(db, "users", userId, "workoutLogs");
        const newLogRef = doc(logsRef, log.id);
        await setDoc(newLogRef, sanitize(log));
    },

    // Fetch workout logs
    getWorkoutLogs: async (userId: string): Promise<any[]> => {
        const logsRef = collection(db, "users", userId, "workoutLogs");
        const q = query(logsRef, orderBy("date", "desc"), limit(50));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },

    // Progress Entries
    addProgressEntry: async (userId: string, entry: any): Promise<void> => {
        const entriesRef = collection(db, "users", userId, "progressEntries");
        await addDoc(entriesRef, sanitize(entry));
    },

    getProgressEntries: async (userId: string): Promise<any[]> => {
        const entriesRef = collection(db, "users", userId, "progressEntries");
        const q = query(entriesRef, orderBy("date", "desc"), limit(30));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },

    // Upload photo
    uploadProgressPhoto: async (userId: string, uri: string): Promise<string> => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = `progress/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const storageRef = ref(storage, `users/${userId}/${filename}`);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading photo:", error);
            throw error;
        }
    },

    // Nutrition
    logMeal: async (userId: string, meal: any): Promise<void> => {
        const mealsRef = collection(db, "users", userId, "mealLogs");
        await addDoc(mealsRef, sanitize(meal));
    },

    getDailyNutrition: async (userId: string, dateStart: number, dateEnd: number): Promise<any[]> => {
        const mealsRef = collection(db, "users", userId, "mealLogs");
        // Simple query for range
        const q = query(
            mealsRef,
            where("date", ">=", dateStart),
            where("date", "<=", dateEnd),
            orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    }
};
