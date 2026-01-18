
// lib/UserContext.tsx
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { auth, db } from "./firebase";

export interface AppUser {
  uid?: string;
  fullName: string;
  email: string;
  gymName: string;
  membershipStatus: string;
  membershipLevel: string;
  phone?: string;
  dob?: string;
  gymId?: string;
  goal?: string;
}

export const defaultUser: AppUser = {
  fullName: "Guest User",
  email: "",
  gymName: "Your Gym",
  membershipStatus: "Inactive",
  membershipLevel: "Guest",
};

type UserContextValue = {
  user: AppUser;
  loading: boolean;
  setUser: (user: AppUser) => void;
  resetUser: () => void;
  updateGym: (gymId: string, gymName: string) => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser>(defaultUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous listener if we are switching users or logging out
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      setLoading(true);

      if (firebaseUser) {
        // User is signed in.
        const userDocRef = doc(db, "users", firebaseUser.uid);

        unsubscribeSnapshot = onSnapshot(userDocRef, {
          next: async (docSnap) => {
            if (docSnap.exists()) {
              setUser({ uid: firebaseUser.uid, ...docSnap.data() } as AppUser);
            } else {
              // New user, create profile
              const newUser: AppUser = {
                uid: firebaseUser.uid,
                fullName: firebaseUser.displayName || "New User",
                email: firebaseUser.email || "",
                gymName: "GymBratt Gym",
                membershipStatus: "Active",
                membershipLevel: "Standard",
              };
              // Use cancelable write or just fire-and-forget safely
              try {
                await setDoc(userDocRef, newUser);
              } catch (e) { console.error("Error creating user doc:", e); }
              setUser(newUser);
            }
            setLoading(false);
          },
          error: (error) => {
            console.error("Error fetching user profile:", error);
            setLoading(false);
          }
        });
      } else {
        // No user is signed in.
        setUser(defaultUser);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const resetUser = () => {
    setUser(defaultUser);
  };

  const updateGym = async (gymId: string, gymName: string) => {
    if (!user.uid) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { gymId, gymName, membershipStatus: "Active" }, { merge: true });
    // Local state update will happen via onSnapshot
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, resetUser, updateGym }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAppUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useAppUser must be used within a UserProvider");
  }
  return ctx;
};
