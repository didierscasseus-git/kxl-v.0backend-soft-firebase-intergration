
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";

export interface SystemVersion {
    uid: string;
    version_id: string;
    action: string;
    timestamp: import('firebase/firestore').Timestamp;
    metadata: Record<string, any>;
}

/**
 * Tracks and documents version history in individual user profiles.
 */
export const logSystemAction = async (
    uid: string,
    action: string,
    metadata: Record<string, any> = {},
    category: 'SYSTEM' | 'SECURITY' | 'UI' | 'AI' | 'COLLAB' = 'SYSTEM'
) => {
    try {
        await addDoc(collection(db, "history"), {
            uid,
            action,
            category,
            metadata,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error logging system action: ", error);
    }
};

export const getUserHistory = async (uid: string) => {
    try {
        const q = query(
            collection(db, "history"),
            where("uid", "==", uid),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemVersion & { id: string }));
    } catch (error) {
        console.error("Error fetching user history: ", error);
        return [];
    }
};

export const getAllSystemHistory = async () => {
    try {
        const q = query(
            collection(db, "history"),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemVersion & { id: string }));
    } catch (error) {
        console.error("Error fetching all system history: ", error);
        return [];
    }
};
