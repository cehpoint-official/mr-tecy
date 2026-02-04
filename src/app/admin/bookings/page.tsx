"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Eye, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Lock } from "lucide-react";
import { getStatusDropdownOptions, isStatusLocked } from "@/lib/booking-status";
import { bookingService } from "@/services/booking.service";
import { Booking, BookingStatus } from "@/types";
import { format } from "date-fns";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
import { FilterBar } from "@/components/admin/FilterBar";
import { useDebounce } from "@/hooks/useDebounce";
import { RealtimeIndicator } from "@/components/admin/RealtimeIndicator";
import { BookingDetailsModal } from "@/components/admin/BookingDetailsModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminBookingsPage() {
    const { bookings, loading } = useRealtimeBookings();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "pending">("all");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filter bookings
    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.serviceName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            booking.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            booking.customerId.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
        const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
        try {
            await bookingService.updateBookingStatus(bookingId, newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200';
            case 'accepted': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
            case 'in_progress': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200';
            case 'completed': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
        }
    };

    const stats = [
        { label: "Total", count: bookings.length, color: "text-slate-700", bg: "bg-slate-50", icon: Calendar },
        { label: "Pending", count: bookings.filter(b => b.status === 'pending').length, color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
        { label: "In Progress", count: bookings.filter(b => b.status === 'in_progress').length, color: "text-indigo-600", bg: "bg-indigo-50", icon: Loader2 },
        { label: "Completed", count: bookings.filter(b => b.status === 'completed').length, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
        { label: "Cancelled", count: bookings.filter(b => b.status === 'cancelled').length, color: "text-red-600", bg: "bg-red-50", icon: XCircle },
    ];

    return (
        <div className="min-h-screen pb-12 overflow-x-hidden">
            {/* Premium Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-blue-100/30 via-cyan-50/20 to-transparent pointer-events-none" />

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6 pt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bookings</h1>
                        <p className="text-slate-500 mt-1 font-medium">Track and manage service requests.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RealtimeIndicator />
                        <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white shadow-sm font-bold">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-1">
                    <FilterBar
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        paymentFilter={paymentFilter}
                        onPaymentFilterChange={setPaymentFilter}
                    />
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {stats.map((stat) => (
                        <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <div className={`p-2 rounded-full mb-3 ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color} mt-0.5`}>{stat.count}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Table */}
                <Card className="border-none shadow-md bg-white/90 backdrop-blur-md overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-b-slate-100">
                                    <TableHead className="font-bold text-slate-700">Date & Time</TableHead>
                                    <TableHead className="font-bold text-slate-700">Service Info</TableHead>
                                    <TableHead className="font-bold text-slate-700">Customer</TableHead>
                                    <TableHead className="font-bold text-slate-700">Amount</TableHead>
                                    <TableHead className="font-bold text-slate-700">Payment</TableHead>
                                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                                    <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredBookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                                <p className="font-medium">No bookings found</p>
                                                <p className="text-xs mt-1">Try adjusting your filters</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <TableRow key={booking.id} className="hover:bg-blue-50/30 transition-colors border-b-slate-50">
                                            <TableCell className="text-sm font-medium text-slate-600">
                                                {booking.createdAt ? format(booking.createdAt.toDate(), "MMM dd, hh:mm a") : "Just now"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{booking.serviceName}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">#{booking.id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                        {booking.customerId.slice(-2)}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">Customer</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-black text-slate-900">₹{booking.servicePrice}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-slate-500 font-medium">{booking.paymentMethod}</span>
                                                    <Badge variant="outline" className={`w-fit text-[10px] px-1.5 py-0 h-5 border-none ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {booking.paymentStatus}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`border px-2.5 py-0.5 rounded-full font-bold shadow-none ${getStatusColor(booking.status)}`}>
                                                    {booking.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(booking)}
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {isStatusLocked(booking.status) ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-md text-xs font-bold text-slate-500">
                                                            <Lock className="h-3 w-3" />
                                                            Locked
                                                        </div>
                                                    ) : (
                                                        <Select
                                                            value={booking.status}
                                                            onValueChange={(val: BookingStatus) => handleStatusChange(booking.id, val)}
                                                        >
                                                            <SelectTrigger className="w-[130px] h-8 text-xs font-bold border-slate-200 bg-white shadow-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="z-[100]">
                                                                {getStatusDropdownOptions(booking.status).map((status) => (
                                                                    <SelectItem key={status} value={status}>
                                                                        {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Results Count */}
                {!loading && filteredBookings.length > 0 && (
                    <p className="text-xs text-slate-400 text-center font-medium">
                        Showing {filteredBookings.length} of {bookings.length} bookings
                    </p>
                )}

                {/* Booking Details Modal */}
                <BookingDetailsModal
                    booking={selectedBooking}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                />
            </div>
        </div>
    );
}
