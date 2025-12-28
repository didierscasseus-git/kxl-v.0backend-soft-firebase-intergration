import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserProfile {
    uid: string;
    firstName: string;
    lastName: string;
    organization: string;
    email: string;
    role?: 'STANDARD_OPERATOR' | 'PREMIUM_OPERATOR' | 'DEVELOPER';
    stage?: 'INITIALIZE' | 'DIAGNOSE' | 'REBUILD' | 'ACTIVATE';
    lastActive?: any;
    createdAt?: any;
}

export const createUserProfile = async (profile: UserProfile) => {
    try {
        await setDoc(doc(db, "users", profile.uid), {
            ...profile,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw error;
    }
};

export const getUserProfile = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile: ", error);
        throw error;
    }
};

export const updateUserStage = async (uid: string, stage: UserProfile['stage']) => {
    try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            stage,
            lastActive: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating user stage: ", error);
    }
};
