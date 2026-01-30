import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";

export const userService = {
    // Create or Update User Profile
    async saveUserProfile(user: UserProfile) {
        try {
            const userRef = doc(db, "user", user.uid);
            await setDoc(userRef, {
                ...user,
                updatedAt: serverTimestamp()
            }, { merge: true });
            return user;
        } catch (error) {
            console.error("Error saving user profile:", error);
            throw error;
        }
    },

    // Get User Profile by ID
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        try {
            const userRef = doc(db, "user", uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return userSnap.data() as UserProfile;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        }
    },

    // Check if user has a profile, if not create a default one (used in Auth flow)
    async ensureUserProfile(uid: string, email: string, name: string) {
        const profile = await this.getUserProfile(uid);
        if (!profile) {
            // Default new user as Customer
            const newProfile: Partial<UserProfile> = {
                uid,
                email,
                displayName: name,
                role: 'customer',
                addresses: [],
                createdAt: serverTimestamp() as any, // Cast to avoid type issues with client/server timestamps
            };

            const userRef = doc(db, "user", uid);
            await setDoc(userRef, newProfile);
            return newProfile;
        }
        return profile;
    }
};
