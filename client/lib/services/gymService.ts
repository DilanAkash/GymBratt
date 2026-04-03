import { db } from '../firebase';
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    Timestamp
} from 'firebase/firestore';

export interface GymProfile {
    id: string;
    name: string;
    location?: string;
    logoUrl?: string;
    features?: string[];
    primaryColor?: string;
}

export const getGymDetails = async (gymId: string): Promise<GymProfile | null> => {
    try {
        const gymRef = doc(db, 'gyms', gymId);
        const gymSnap = await getDoc(gymRef);

        if (gymSnap.exists()) {
            return { id: gymSnap.id, ...gymSnap.data() } as GymProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching gym details:', error);
        throw error;
    }
};

export const connectUserToGym = async (userId: string, gymId: string, gymName: string) => {
    try {
        // 1. Update User Profile
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            gymId: gymId,
            gymName: gymName,
            membershipStatus: 'Active', // Defaulting to active for now, logic might change
            joinedAt: Timestamp.now(),
        });

        // 2. Add user to Gym's members sub-collection or array?
        // Firestore rules often simpler with sub-collection for scaling.
        // Let's assume we might want to just verify existence for now.
        // But ideally: db.collection('gyms').doc(gymId).collection('members').doc(userId).set({...})
        // For this phase, let's keep it simple: User points to Gym.

        return true;
    } catch (error) {
        console.error('Error connecting user to gym:', error);
        throw error;
    }
};
