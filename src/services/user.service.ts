import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, Address } from "@/types";

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
    },

    // Add a new address to user profile
    async addAddress(uid: string, address: Omit<Address, 'id'>): Promise<Address> {
        try {
            const newAddress: Address = {
                ...address,
                id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };

            const userRef = doc(db, "user", uid);
            await updateDoc(userRef, {
                addresses: arrayUnion(newAddress),
                updatedAt: serverTimestamp()
            });

            return newAddress;
        } catch (error) {
            console.error("Error adding address:", error);
            throw error;
        }
    },

    // Update an existing address
    async updateAddress(uid: string, addressId: string, updatedData: Partial<Omit<Address, 'id'>>): Promise<void> {
        try {
            const profile = await this.getUserProfile(uid);
            if (!profile) throw new Error("User profile not found");

            const updatedAddresses = profile.addresses.map(addr =>
                addr.id === addressId ? { ...addr, ...updatedData } : addr
            );

            const userRef = doc(db, "user", uid);
            await updateDoc(userRef, {
                addresses: updatedAddresses,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    },

    // Delete an address
    async deleteAddress(uid: string, addressId: string): Promise<void> {
        try {
            const profile = await this.getUserProfile(uid);
            if (!profile) throw new Error("User profile not found");

            const addressToRemove = profile.addresses.find(addr => addr.id === addressId);
            if (!addressToRemove) throw new Error("Address not found");

            const userRef = doc(db, "user", uid);
            await updateDoc(userRef, {
                addresses: arrayRemove(addressToRemove),
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error deleting address:", error);
            throw error;
        }
    }
};
