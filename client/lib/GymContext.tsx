import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useAppUser } from "./UserContext";
import { getGymDetails, type GymProfile } from "./services/gymService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GymContextValue = {
    currentGym: GymProfile | null;
    isGymMode: boolean;
    isLoading: boolean;
    toggleGymMode: () => void;
    setGymMode: (enabled: boolean) => void;
};

const GymContext = createContext<GymContextValue | undefined>(undefined);

export const GymProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAppUser();
    const [currentGym, setCurrentGym] = useState<GymProfile | null>(null);
    const [isGymMode, setIsGymMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load gym details when user.gymId changes
    useEffect(() => {
        const loadGym = async () => {
            if (user.gymId) {
                setIsLoading(true);
                try {
                    const gym = await getGymDetails(user.gymId);
                    setCurrentGym(gym);

                    // Auto-enable gym mode if just joined? Or load preference?
                    // For now, if they have a gym, let's check preference or default to true?
                    const pref = await AsyncStorage.getItem("gymModeEnabled");
                    if (pref !== null) {
                        setIsGymMode(pref === "true");
                    } else {
                        // Default to true if they have a gym
                        setIsGymMode(true);
                    }
                } catch (e) {
                    console.error("Failed to load gym details", e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setCurrentGym(null);
                setIsGymMode(false);
                setIsLoading(false);
            }
        };

        loadGym();
    }, [user.gymId]);

    const toggleGymMode = async () => {
        if (!currentGym) return;
        const newState = !isGymMode;
        setIsGymMode(newState);
        await AsyncStorage.setItem("gymModeEnabled", String(newState));
    };

    const setGymMode = async (enabled: boolean) => {
        if (!currentGym && enabled) return;
        setIsGymMode(enabled);
        await AsyncStorage.setItem("gymModeEnabled", String(enabled));
    };

    return (
        <GymContext.Provider
            value={{
                currentGym,
                isGymMode,
                isLoading,
                toggleGymMode,
                setGymMode,
            }}
        >
            {children}
        </GymContext.Provider>
    );
};

export const useGym = (): GymContextValue => {
    const ctx = useContext(GymContext);
    if (!ctx) {
        throw new Error("useGym must be used within a GymProvider");
    }
    return ctx;
};
