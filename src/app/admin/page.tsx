"use client";

import { useEffect, useState } from "react";
import { Wrench, Users, Calendar, Banknote, TrendingUp, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/StatCard";
import { RealtimeIndicator } from "@/components/admin/RealtimeIndicator";
import { bookingService } from "@/services/booking.service";
import { serviceService } from "@/services/service.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";

export default function AdminDashboard() {
    const { bookings, loading: bookingsLoading } = useRealtimeBookings();
    const [serviceStats, setServiceStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Subscribe to service stats
    useEffect(() => {
        const unsubscribe = serviceService.subscribeToServiceStats(
            (stats) => {
                setServiceStats(stats);
                setLastUpdated(new Date());
            },
            (error) => console.error("Error fetching service stats:", error)
        );

        return () => unsubscribe();
    }, []);

    // Calculate booking stats
    const bookingStats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        revenue: bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.servicePrice, 0),
    };

    const recentBookings = bookings.slice(0, 5);

    return (
        <div className="min-h-screen bg-slate-50 pb-6">
            {/* Background Gradient - Mobile First */}
            <div className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-[#A1F6FB] via-[#DBFDFC] to-slate-50 pointer-events-none" />

            <div className="relative z-10 px-4 lg:px-8 max-w-[1600px] mx-auto space-y-6 pt-6">
                {/* Header - Mobile Optimized */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Dashboard</h1>
                        <p className="text-slate-600 text-sm mt-1 hidden sm:block">Welcome back! Here's what's happening today.</p>
                    </div>
                    <RealtimeIndicator lastUpdated={lastUpdated} />
                </div>

                {/* Stats Grid - Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/admin/services">
                        <StatCard
                            title="Active Services"
                            value={serviceStats.active}
                            icon={Wrench}
                            color="from-blue-500 to-blue-600"
                            loading={false}
                        />
                    </Link>
                    <Link href="/admin/partners">
                        <StatCard
                            title="Total Partners"
                            value="8"
                            icon={Users}
                            color="from-cyan-500 to-cyan-600"
                            loading={false}
                        />
                    </Link>
                    <Link href="/admin/bookings">
                        <StatCard
                            title="Total Bookings"
                            value={bookingStats.total}
                            icon={Calendar}
                            color="from-indigo-500 to-indigo-600"
                            loading={bookingsLoading}
                        />
                    </Link>
                    <StatCard
                        title="Total Revenue"
                        value={`₹${bookingStats.revenue}`}
                        icon={Banknote}
                        color="from-emerald-500 to-emerald-600"
                        loading={bookingsLoading}
                    />
                </div>

                {/* Secondary Stats - Mobile Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold tracking-wide text-slate-400 uppercase">Pending Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{bookingStats.pending}</div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold tracking-wide text-slate-400 uppercase">Completed Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{bookingStats.completed}</div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Successfully finished</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold tracking-wide text-slate-400 uppercase">Service Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{serviceStats.total}</div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Total services offered</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings - Mobile Optimized */}
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
                                    <CardDescription className="text-xs">Latest service requests</CardDescription>
                                </div>
                                <Link href="/admin/bookings">
                                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs h-8">
                                        View All <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {bookingsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />
                                    ))}
                                </div>
                            ) : recentBookings.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-medium">No bookings yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 truncate text-sm">{booking.serviceName}</p>
                                                <p className="text-xs text-slate-500 font-medium">ID: {booking.id.slice(-8)}</p>
                                            </div>
                                            <div className="text-right ml-3">
                                                <p className="font-extrabold text-slate-900 text-sm">₹{booking.servicePrice}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions - Mobile Optimized */}
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                            <CardDescription className="text-xs">Common administrative tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Link href="/admin/services">
                                <Button className="w-full h-20 sm:h-24 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold flex flex-col gap-2 rounded-2xl shadow-lg shadow-blue-200">
                                    <Wrench className="h-5 w-5" />
                                    <span className="text-xs sm:text-sm">Manage Services</span>
                                </Button>
                            </Link>
                            <Link href="/admin/partners">
                                <Button variant="outline" className="w-full h-20 sm:h-24 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold flex flex-col gap-2 rounded-2xl">
                                    <Users className="h-5 w-5" />
                                    <span className="text-xs sm:text-sm">Add Partner</span>
                                </Button>
                            </Link>
                            <Link href="/admin/bookings">
                                <Button variant="outline" className="w-full h-20 sm:h-24 border-2 border-slate-200 hover:bg-slate-50 font-bold flex flex-col gap-2 rounded-2xl">
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-xs sm:text-sm">View Bookings</span>
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="ghost" className="w-full h-20 sm:h-24 text-slate-500 hover:bg-slate-50 font-bold flex flex-col gap-2 rounded-2xl border border-slate-200">
                                    <TrendingUp className="h-5 w-5" />
                                    <span className="text-xs sm:text-sm">Go to Website</span>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* System Health - Mobile Optimized */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">System Health</CardTitle>
                        <CardDescription className="text-xs">All systems operational</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Firestore Database</p>
                                    <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wide">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Authentication</p>
                                    <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wide">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Storage Bucket</p>
                                    <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wide">Online</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
