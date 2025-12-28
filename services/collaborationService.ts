
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

/**
 * Foundation for future collaborative workflows (shared documents, team units).
 */
export const initiateCollaboration = async (ownerId: string, partnerId: string, projectId: string) => {
    try {
        await addDoc(collection(db, "collaborations"), {
            participants: [ownerId, partnerId],
            projectId,
            status: "pending",
            createdAt: new Date(),
        });

    } catch (error) {
        console.error("[COLLAB_ERROR]: Initiation failure:", error);
    }
};

/**
 * Links two operators into a persistent Unit.
 */
export const linkOperators = async (uid1: string, uid2: string) => {
    try {
        // Create an active link document
        await addDoc(collection(db, "operator_links"), {
            unit_id: `UNIT_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            operators: [uid1, uid2],
            establishedAt: new Date(),
            status: 'ACTIVE'
        });
    } catch (error) {
        console.error("[COLLAB_ERROR]: Link failure:", error);
    }
};

export const subscribeToActiveCollaborations = (uid: string, callback: (data: any) => void) => {
    const q = query(
        collection(db, "collaborations"),
        where("participants", "array-contains", uid)
    );
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
    });
};
