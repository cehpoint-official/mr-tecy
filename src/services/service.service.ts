import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Service } from "@/types";

export const serviceService = {
    // Create Service (Admin only)
    async createService(serviceData: Omit<Service, 'id' | 'active'>) {
        try {
            const servicesRef = collection(db, "services");
            const newService = {
                ...serviceData,
                active: true,
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(servicesRef, newService);
            return { id: docRef.id, ...newService };
        } catch (error) {
            console.error("Error creating service:", error);
            throw error;
        }
    },

    // Get All Services (Active)
    async getServices(onlyActive = true) {
        try {
            const servicesRef = collection(db, "services");
            let q = query(servicesRef);

            if (onlyActive) {
                q = query(servicesRef, where("active", "==", true));
            }

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        } catch (error) {
            console.error("Error getting services:", error);
            throw error;
        }
    },

    // Get Service by ID
    async getServiceById(id: string) {
        try {
            const serviceRef = doc(db, "services", id);
            const snap = await getDoc(serviceRef);
            if (snap.exists()) {
                return { id: snap.id, ...snap.data() } as Service;
            }
            return null;
        } catch (error) {
            console.error("Error getting service by ID:", error);
            throw error;
        }
    },

    // Update Service
    async updateService(id: string, updates: Partial<Service>) {
        try {
            const serviceRef = doc(db, "services", id);
            await updateDoc(serviceRef, updates);
        } catch (error) {
            console.error("Error updating service:", error);
            throw error;
        }
    },

    // Real-time subscription to all services
    subscribeToServices(
        onUpdate: (services: Service[]) => void,
        onlyActive = false,
        onError?: (error: Error) => void
    ): Unsubscribe {
        const servicesRef = collection(db, "services");
        let q = query(servicesRef);

        if (onlyActive) {
            q = query(servicesRef, where("active", "==", true));
        }

        return onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Service));

                onUpdate(data);
            },
            (error) => {
                console.error("Error in services subscription:", error);
                if (onError) onError(error);
            }
        );
    },

    // Real-time service statistics
    subscribeToServiceStats(
        onUpdate: (stats: {
            total: number;
            active: number;
            inactive: number;
            byCategory: Record<string, number>;
        }) => void,
        onError?: (error: Error) => void
    ): Unsubscribe {
        const servicesRef = collection(db, "services");

        return onSnapshot(
            servicesRef,
            (snapshot) => {
                const services = snapshot.docs.map(doc => doc.data() as Service);

                const byCategory: Record<string, number> = {};
                services.forEach(service => {
                    byCategory[service.category] = (byCategory[service.category] || 0) + 1;
                });

                const stats = {
                    total: services.length,
                    active: services.filter(s => s.active).length,
                    inactive: services.filter(s => !s.active).length,
                    byCategory
                };

                onUpdate(stats);
            },
            (error) => {
                console.error("Error in service stats subscription:", error);
                if (onError) onError(error);
            }
        );
    }
};

