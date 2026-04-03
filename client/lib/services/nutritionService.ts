import { db, auth } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    Timestamp,
    orderBy
} from 'firebase/firestore';

export interface MacroBreakdown {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
}

export interface Meal {
    id?: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    timestamp: Date;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface NutritionDay {
    id?: string;
    date: string; // YYYY-MM-DD
    total: MacroBreakdown;
    meals: Meal[];
}

export const addMeal = async (meal: Omit<Meal, 'id'>) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const mealData = {
            ...meal,
            timestamp: Timestamp.fromDate(meal.timestamp || new Date()),
            userId: user.uid,
        };

        const docRef = await addDoc(collection(db, `users/${user.uid}/nutritionLogs`), mealData);
        return { ...meal, id: docRef.id };
    } catch (error) {
        console.error('Error adding meal:', error);
        throw error;
    }
};

export const updateMeal = async (mealId: string, updates: Partial<Meal>) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const mealRef = doc(db, `users/${user.uid}/nutritionLogs`, mealId);

        // Convert Date to Timestamp if present in updates
        const updateData: any = { ...updates };
        if (updates.timestamp) {
            updateData.timestamp = Timestamp.fromDate(updates.timestamp);
        }

        await updateDoc(mealRef, updateData);
        return true;
    } catch (error) {
        console.error('Error updating meal:', error);
        throw error;
    }
};

export const deleteMeal = async (mealId: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const mealRef = doc(db, `users/${user.uid}/nutritionLogs`, mealId);
        await deleteDoc(mealRef);
        return true;
    } catch (error) {
        console.error('Error deleting meal:', error);
        throw error;
    }
};

export const getDailyNutrition = async (date: Date): Promise<NutritionDay> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Create start and end of day timestamps
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, `users/${user.uid}/nutritionLogs`),
            where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
            where('timestamp', '<=', Timestamp.fromDate(endOfDay)),
            orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);

        const meals: Meal[] = [];
        const total: MacroBreakdown = {
            protein: 0,
            carbs: 0,
            fats: 0,
            calories: 0,
        };

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const meal: Meal = {
                id: doc.id,
                name: data.name,
                calories: data.calories || 0,
                protein: data.protein || 0,
                carbs: data.carbs || 0,
                fats: data.fats || 0,
                timestamp: data.timestamp.toDate(),
                type: data.type || 'snack',
            };

            meals.push(meal);

            // Accumulate totals
            total.calories += meal.calories;
            total.protein += meal.protein;
            total.carbs += meal.carbs;
            total.fats += meal.fats;
        });

        return {
            date: date.toISOString().split('T')[0],
            total,
            meals,
        };
    } catch (error) {
        console.error('Error getting daily nutrition:', error);
        throw error;
    }
};
