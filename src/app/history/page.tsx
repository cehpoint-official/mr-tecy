"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wrench, ShieldCheck, Clock, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { BottomNavigation } from "@/components/BottomNavigation";
import Link from "next/link";

export default function OrderHistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchBookings();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("History: Fetching bookings for UID:", user?.uid);
            const data = await bookingService.getCustomerBookings(user!.uid);
            console.log("History: Found bookings:", data.length);
            setBookings(data);
        } catch (err: any) {
            console.error("History: Fetch error:", err);
            setError(err.message || "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="px-6 pt-8 pb-6 bg-white border-b shadow-sm">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking History</h1>
                    <p className="text-slate-500 text-sm font-medium">Track your service requests and warranties.</p>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-4 pt-6">
                {error ? (
                    <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 p-8 shadow-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load</h3>
                        <p className="text-red-600 text-sm max-w-[200px] mx-auto leading-relaxed">
                            {error}
                        </p>
                        <Button onClick={fetchBookings} className="mt-6 bg-red-600 hover:bg-red-700 font-bold text-sm px-8 rounded-full shadow-lg shadow-red-100 transition-all active:scale-95">
                            Try Again
                        </Button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 translate-y-20">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-10 h-10 text-blue-300" />
                        </div>
                        <p className="text-slate-400 font-bold">No bookings yet.</p>
                        <Link href="/">
                            <button className="text-blue-600 font-bold mt-2 text-sm">Book your first service →</button>
                        </Link>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-bold text-slate-900">{booking.serviceName}</CardTitle>
                                        <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            #{booking.id.slice(-6)}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'} className="font-bold text-[10px] uppercase">
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">{format(booking.createdAt.toDate(), "MMM dd, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium truncate">{booking.location.city}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Amount (COD)</span>
                                        <span className="text-lg font-extrabold text-blue-600">₹{booking.servicePrice}</span>
                                    </div>

                                    {booking.status === 'completed' && booking.warrantyValidUntil && (
                                        <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                                            <ShieldCheck className="w-4 h-4 text-green-600" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-bold text-green-600 uppercase">Warranty Valid</span>
                                                <span className="text-[10px] font-extrabold text-green-700">
                                                    {format(booking.warrantyValidUntil.toDate(), "MMM dd, yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </main>

            <BottomNavigation />
        </div>
    );
}
