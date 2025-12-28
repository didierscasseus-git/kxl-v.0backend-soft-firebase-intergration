
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ContactMessage {
    name: string;
    email: string;
    organization: string;
    message: string;
    userId?: string;
    timestamp?: any;
}

export const sendContactMessage = async (data: ContactMessage) => {
    try {
        const docRef = await addDoc(collection(db, "contacts"), {
            ...data,
            timestamp: serverTimestamp(),
        });
        return docRef.id;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied: Ensure security rules are applied in the Firebase Console.");
        }
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const getUserMessages = async (userId: string) => {
    try {
        const q = query(
            collection(db, "contacts"),
            where("userId", "==", userId),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (ContactMessage & { id: string })[];
    } catch (error) {
        console.error("Error fetching user messages: ", error);
        throw error;
    }
};
