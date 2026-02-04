"use client";

import { useEffect, useState } from "react";
import { Wrench, Users, Calendar, Banknote, Clock, CheckCircle2, TrendingUp, Activity, ChevronRight, UserCheck, UserX, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/StatCard";
import { RealtimeIndicator } from "@/components/admin/RealtimeIndicator";
import { bookingService } from "@/services/booking.service";
import { serviceService } from "@/services/service.service";
import { partnerService } from "@/services/partner-resource.service";
import { partnerApplicationService } from "@/services/partner.service";
import { PartnerApplication } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const { bookings, loading: bookingsLoading } = useRealtimeBookings();
    const [serviceStats, setServiceStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [partnerCount, setPartnerCount] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [partnerApps, setPartnerApps] = useState<PartnerApplication[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [processingApps, setProcessingApps] = useState<Set<string>>(new Set());

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

    // Subscribe to partners for real-time count
    useEffect(() => {
        const unsubscribe = partnerService.subscribeToPartners(
            (partners) => {
                setPartnerCount(partners.length);
                setLastUpdated(new Date());
            },
            (error) => console.error("Error fetching partners:", error)
        );

        return () => unsubscribe();
    }, []);

    // Fetch partner applications
    useEffect(() => {
        async function loadPartnerApplications() {
            setLoadingApps(true);
            try {
                const apps = await partnerApplicationService.getPendingApplications();
                setPartnerApps(apps);
            } catch (error) {
                console.error("Error loading partner applications:", error);
            } finally {
                setLoadingApps(false);
            }
        }

        loadPartnerApplications();
    }, []);

    const handleApprovePartner = async (userId: string) => {
        setProcessingApps(prev => new Set(prev).add(userId));
        try {
            await partnerApplicationService.approvePartner(userId);
            const apps = await partnerApplicationService.getPendingApplications();
            setPartnerApps(apps);
        } catch (error) {
            console.error("Error approving partner:", error);
            alert("Failed to approve partner application");
        } finally {
            setProcessingApps(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleRejectPartner = async (userId: string) => {
        setProcessingApps(prev => new Set(prev).add(userId));
        try {
            await partnerApplicationService.rejectPartner(userId);
            const apps = await partnerApplicationService.getPendingApplications();
            setPartnerApps(apps);
        } catch (error) {
            console.error("Error rejecting partner:", error);
            alert("Failed to reject partner application");
        } finally {
            setProcessingApps(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

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
        <div className="min-h-screen pb-12 overflow-x-hidden">
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 pt-8">
                {/* Header - Minimal & Clean */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Overview
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RealtimeIndicator lastUpdated={lastUpdated} />
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <Link href="/admin/services" className="group">
                        <StatCard
                            title="Active Services"
                            value={serviceStats.active}
                            icon={Wrench}
                            color="from-blue-500 to-blue-600"
                            loading={false}
                            className="h-full"
                        />
                    </Link>
                    <Link href="/admin/partners" className="group">
                        <StatCard
                            title="Total Partners"
                            value={partnerCount}
                            icon={Users}
                            color="from-cyan-500 to-cyan-600"
                            loading={false}
                            className="h-full"
                        />
                    </Link>
                    <Link href="/admin/bookings" className="group">
                        <StatCard
                            title="Total Bookings"
                            value={bookingStats.total}
                            icon={Calendar}
                            color="from-indigo-500 to-indigo-600"
                            loading={bookingsLoading}
                            className="h-full"
                        />
                    </Link>
                    <StatCard
                        title="Total Revenue"
                        value={`₹${bookingStats.revenue}`}
                        icon={Banknote}
                        color="from-emerald-500 to-emerald-600"
                        loading={bookingsLoading}
                        className="h-full"
                    />
                </div>

                {/* Quick Status Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                            <p className="text-2xl font-black text-slate-900">{bookingStats.pending}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed</p>
                            <p className="text-2xl font-black text-slate-900">{bookingStats.completed}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Services</p>
                            <p className="text-2xl font-black text-slate-900">{serviceStats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    {/* Left Column: Applications & Bookings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Partner Applications */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-bold text-slate-900">Partner Applications</h3>
                                <Badge variant="outline" className="bg-white">{partnerApps.length} Pending</Badge>
                            </div>

                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    {loadingApps ? (
                                        <div className="p-8 space-y-4">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl" />
                                            ))}
                                        </div>
                                    ) : partnerApps.length === 0 ? (
                                        <div className="text-center py-16 text-slate-400 bg-slate-50/50">
                                            <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium">All caught up!</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {partnerApps.map((app) => (
                                                <div key={app.userId} className="p-6 hover:bg-slate-50/80 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-slate-900 text-lg">{app.fullName}</h4>
                                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Pending</Badge>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                                                                <span>{app.email}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300 self-center" />
                                                                <span>{app.phone}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300 self-center" />
                                                                <span>{app.experience}y exp</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 pt-2">
                                                                {app.skills.map(skill => (
                                                                    <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200">
                                                                        {skill}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 sm:self-center shrink-0">
                                                            <Button
                                                                onClick={() => handleApprovePartner(app.userId)}
                                                                disabled={processingApps.has(app.userId)}
                                                                className="bg-green-600 hover:bg-green-700 font-bold shadow-green-200 shadow-lg"
                                                                size="sm"
                                                            >
                                                                {processingApps.has(app.userId) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleRejectPartner(app.userId)}
                                                                disabled={processingApps.has(app.userId)}
                                                                variant="outline"
                                                                className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 font-bold"
                                                                size="sm"
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Bookings List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
                                <Link href="/admin/bookings" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    {bookingsLoading ? (
                                        <div className="p-8 space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl" />
                                            ))}
                                        </div>
                                    ) : recentBookings.length === 0 ? (
                                        <div className="text-center py-16 text-slate-400">
                                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium">No bookings yet</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {recentBookings.map((booking) => (
                                                <div key={booking.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm",
                                                            booking.status === 'completed' ? "bg-green-500" :
                                                                booking.status === 'pending' ? "bg-amber-500" :
                                                                    "bg-blue-500"
                                                        )}>
                                                            {booking.serviceName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{booking.serviceName}</p>
                                                            <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded-full capitalize",
                                                                    booking.status === 'completed' ? "bg-green-100 text-green-700" :
                                                                        booking.status === 'pending' ? "bg-amber-100 text-amber-700" :
                                                                            "bg-blue-100 text-blue-700"
                                                                )}>
                                                                    {booking.status}
                                                                </span>
                                                                <span className="text-slate-400">•</span>
                                                                <span className="text-slate-500">ID: {booking.id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-slate-900">₹{booking.servicePrice}</p>
                                                        <p className="text-xs text-slate-400 font-medium">Today</p> {/* ideally use actual date */}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Quick Actions & Status */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 px-1">Quick Actions</h3>
                            <Card className="border-none shadow-sm bg-white overflow-hidden p-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <Link href="/admin/services">
                                        <div className="p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <Wrench className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">Manage Services</p>
                                                <p className="text-xs text-slate-500 font-medium">Add or edit offerings</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-blue-500" />
                                        </div>
                                    </Link>
                                    <Link href="/admin/partners">
                                        <div className="p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer flex items-center gap-4">
                                            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">Manage Partners</p>
                                                <p className="text-xs text-slate-500 font-medium">View partner network</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-cyan-500" />
                                        </div>
                                    </Link>
                                    <Link href="/">
                                        <div className="p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">View Website</p>
                                                <p className="text-xs text-slate-500 font-medium">Go to customer view</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-indigo-500" />
                                        </div>
                                    </Link>
                                </div>
                            </Card>
                        </div>

                        {/* System Health */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-bold text-slate-900">System Status</h3>
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100">Operational</Badge>
                            </div>
                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-4 space-y-3">
                                    {['Database', 'Authentication', 'Storage', 'Hosting'].map(service => (
                                        <div key={service} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                                <span className="text-sm font-bold text-slate-700">{service}</span>
                                            </div>
                                            <span className="text-xs font-bold text-green-600">Online</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
