"use client";

import { useEffect, useState } from "react";
import { Wrench, Users, Calendar, Banknote, TrendingUp, Activity } from "lucide-react";
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
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <RealtimeIndicator lastUpdated={lastUpdated} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">{bookingStats.pending}</div>
                        <p className="text-xs text-slate-500 mt-1">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-500">Completed Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{bookingStats.completed}</div>
                        <p className="text-xs text-slate-500 mt-1">Successfully finished</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-500">Service Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{serviceStats.total}</div>
                        <p className="text-xs text-slate-500 mt-1">Total services offered</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>Latest service requests</CardDescription>
                            </div>
                            <Link href="/admin/bookings">
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {bookingsLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : recentBookings.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No bookings yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{booking.serviceName}</p>
                                            <p className="text-xs text-slate-500">ID: {booking.id.slice(-8)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{booking.servicePrice}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
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

                {/* Quick Actions */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/admin/services">
                            <Button className="w-full h-20 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold flex flex-col gap-2">
                                <Wrench className="h-5 w-5" />
                                Manage Services
                            </Button>
                        </Link>
                        <Link href="/admin/partners">
                            <Button variant="outline" className="w-full h-20 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold flex flex-col gap-2">
                                <Users className="h-5 w-5" />
                                Add Partner
                            </Button>
                        </Link>
                        <Link href="/admin/bookings">
                            <Button variant="outline" className="w-full h-20 border-2 border-slate-200 hover:bg-slate-50 font-bold flex flex-col gap-2">
                                <Calendar className="h-5 w-5" />
                                View Bookings
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" className="w-full h-20 text-slate-500 hover:bg-slate-50 font-bold flex flex-col gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Go to Website
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* System Health */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>All systems operational</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                            <div>
                                <p className="font-medium text-slate-900">Firestore Database</p>
                                <p className="text-xs text-green-600 font-bold uppercase">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                            <div>
                                <p className="font-medium text-slate-900">Authentication</p>
                                <p className="text-xs text-green-600 font-bold uppercase">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                            <div>
                                <p className="font-medium text-slate-900">Storage Bucket</p>
                                <p className="text-xs text-green-600 font-bold uppercase">Online</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
