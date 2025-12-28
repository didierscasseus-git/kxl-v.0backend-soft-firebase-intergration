
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { encryptData, decryptData } from "../utils/encryption";

export interface Proposition {
    id?: string;
    userId: string;
    type: 'FEATURE' | 'BUG' | 'STRATEGY' | 'DATA_CORRECTION';
    status: 'PENDING' | 'ANALYZING' | 'ACCEPTED' | 'ARCHIVED' | 'REJECTED';
    encryptedContent: string;
    decryptedContent?: string; // For client-side use only
    createdAt: any;
    version: number;
}

const CRM_COLLECTION = 'propositions';

export const submitProposition = async (
    userId: string,
    content: string,
    type: Proposition['type'] = 'FEATURE'
): Promise<string> => {
    try {
        const encrypted = encryptData(content);

        // Check if there are existing active propositions to increment version? 
        // For now, simple versioning 1.0

        const docRef = await addDoc(collection(db, CRM_COLLECTION), {
            userId,
            type,
            status: 'PENDING',
            encryptedContent: encrypted,
            createdAt: serverTimestamp(),
            version: 1.0,
            metadata: {
                interface: 'KXL_PROFILE_CRM',
                encryption: 'BASIC_OBFUSCATION_V1'
            }
        });

        return docRef.id;
    } catch (error) {
        console.error("Error submitting proposition:", error);
        throw error;
    }
};

export const getUserPropositions = async (userId: string): Promise<Proposition[]> => {
    try {
        const q = query(
            collection(db, CRM_COLLECTION),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const props: Proposition[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const decrypted = decryptData(data.encryptedContent);

            props.push({
                id: doc.id,
                userId: data.userId,
                type: data.type,
                status: data.status,
                encryptedContent: data.encryptedContent,
                decryptedContent: decrypted,
                createdAt: data.createdAt,
                version: data.version
            });
        });

        return props;
    } catch (error) {
        console.error("Error fetching propositions:", error);
        throw error;
    }
};
export const getAllPropositions = async (): Promise<Proposition[]> => {
    try {
        const q = query(
            collection(db, CRM_COLLECTION),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const props: Proposition[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const decrypted = decryptData(data.encryptedContent);

            props.push({
                id: doc.id,
                userId: data.userId,
                type: data.type,
                status: data.status,
                encryptedContent: data.encryptedContent,
                decryptedContent: decrypted,
                createdAt: data.createdAt,
                version: data.version
            });
        });

        return props;
    } catch (error) {
        console.error("Error fetching all propositions:", error);
        throw error;
    }
};

export const updatePropositionStatus = async (
    propositionId: string,
    status: Proposition['status']
): Promise<void> => {
    try {
        const { doc, updateDoc } = await import("firebase/firestore");
        const propRef = doc(db, CRM_COLLECTION, propositionId);
        await updateDoc(propRef, {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating proposition status:", error);
        throw error;
    }
};
