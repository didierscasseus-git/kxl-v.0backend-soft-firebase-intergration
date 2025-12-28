
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile, UserProfile } from '../services/userService';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const userProfile = await getUserProfile(currentUser.uid);
                    setProfile(userProfile);
                } catch (error) {
                    console.error("Error fetching global profile:", error);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
