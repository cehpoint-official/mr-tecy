import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    serverTimestamp,
    orderBy,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking, BookingStatus } from "@/types";

export const bookingService = {
    // Create New Booking (Customer)
    async createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) {
        try {
            const bookingsRef = collection(db, "bookings");
            const newBooking = {
                ...bookingData,
                status: 'pending' as BookingStatus,
                paymentStatus: 'pending' as const, // COD is pending until paid
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(bookingsRef, newBooking);
            return { id: docRef.id, ...newBooking };
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    },

    // Get Customer Bookings
    async getCustomerBookings(customerId: string) {
        try {
            console.log("Fetching bookings for customer:", customerId);
            const bookingsRef = collection(db, "bookings");
            const q = query(
                bookingsRef,
                where("customerId", "==", customerId)
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

            // Sort in-memory to avoid indexing issues during development
            return data.sort((a, b) => {
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error getting customer bookings:", error);
            throw error;
        }
    },

    // Get All Bookings (Admin)
    async getAllBookings() {
        try {
            const bookingsRef = collection(db, "bookings");
            const snapshot = await getDocs(bookingsRef);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

            // Sort in-memory
            return data.sort((a, b) => {
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error getting all bookings:", error);
            throw error;
        }
    },

    // Real-time subscription to all bookings (Admin)
    subscribeToAllBookings(
        onUpdate: (bookings: Booking[]) => void,
        onError?: (error: Error) => void
    ): Unsubscribe {
        const bookingsRef = collection(db, "bookings");

        return onSnapshot(
            bookingsRef,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Booking));

                // Sort in-memory by creation date
                const sorted = data.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis() || 0;
                    const timeB = b.createdAt?.toMillis() || 0;
                    return timeB - timeA;
                });

                onUpdate(sorted);
            },
            (error) => {
                console.error("Error in bookings subscription:", error);
                if (onError) onError(error);
            }
        );
    },

    // Real-time subscription to customer bookings
    subscribeToCustomerBookings(
        customerId: string,
        onUpdate: (bookings: Booking[]) => void,
        onError?: (error: Error) => void
    ): Unsubscribe {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("customerId", "==", customerId));

        return onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Booking));

                // Sort in-memory
                const sorted = data.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis() || 0;
                    const timeB = b.createdAt?.toMillis() || 0;
                    return timeB - timeA;
                });

                onUpdate(sorted);
            },
            (error) => {
                console.error("Error in customer bookings subscription:", error);
                if (onError) onError(error);
            }
        );
    },

    // Real-time booking statistics (Admin)
    subscribeToBookingStats(
        onUpdate: (stats: {
            total: number;
            pending: number;
            accepted: number;
            inProgress: number;
            completed: number;
            cancelled: number;
            totalRevenue: number;
            pendingRevenue: number;
        }) => void,
        onError?: (error: Error) => void
    ): Unsubscribe {
        const bookingsRef = collection(db, "bookings");

        return onSnapshot(
            bookingsRef,
            (snapshot) => {
                const bookings = snapshot.docs.map(doc => doc.data() as Booking);

                const stats = {
                    total: bookings.length,
                    pending: bookings.filter(b => b.status === 'pending').length,
                    accepted: bookings.filter(b => b.status === 'accepted').length,
                    inProgress: bookings.filter(b => b.status === 'in_progress').length,
                    completed: bookings.filter(b => b.status === 'completed').length,
                    cancelled: bookings.filter(b => b.status === 'cancelled').length,
                    totalRevenue: bookings
                        .filter(b => b.paymentStatus === 'paid')
                        .reduce((sum, b) => sum + b.servicePrice, 0),
                    pendingRevenue: bookings
                        .filter(b => b.paymentStatus === 'pending')
                        .reduce((sum, b) => sum + b.servicePrice, 0),
                };

                onUpdate(stats);
            },
            (error) => {
                console.error("Error in booking stats subscription:", error);
                if (onError) onError(error);
            }
        );
    },

    // Update Booking Status (Partner/Admin)
    async updateBookingStatus(bookingId: string, status: BookingStatus) {
        try {
            const bookingRef = doc(db, "bookings", bookingId);
            const updates: any = { status };

            if (status === 'completed') {
                // Set warranty + 30 days
                const warrantyDate = new Date();
                warrantyDate.setDate(warrantyDate.getDate() + 30);
                updates.warrantyValidUntil = warrantyDate; // Firestore will convert Date to Timestamp
                updates.paymentStatus = 'paid'; // Assume COD collected on completion
            }

            await updateDoc(bookingRef, updates);
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw error;
        }
    }
};

