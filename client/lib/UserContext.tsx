// lib/UserContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export interface AppUser {
  fullName: string;
  email: string;
  gymName: string;
  membershipStatus: string;
  membershipLevel: string;
}

export const defaultUser: AppUser = {
  fullName: "",
  email: "",
  gymName: "Your Gym",
  membershipStatus: "Active",
  membershipLevel: "Standard · 3 days / week",
};

type UserContextValue = {
  user: AppUser;
  setUser: (user: AppUser) => void;
  resetUser: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser>(defaultUser);

  const resetUser = () => {
    setUser(defaultUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
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
