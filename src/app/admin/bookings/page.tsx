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
import { Loader2, Download, Eye } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { Booking, BookingStatus } from "@/types";
import { format } from "date-fns";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
import { FilterBar } from "@/components/admin/FilterBar";
import { useDebounce } from "@/hooks/useDebounce";
import { RealtimeIndicator } from "@/components/admin/RealtimeIndicator";
import { BookingDetailsModal } from "@/components/admin/BookingDetailsModal";

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
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-indigo-100 text-indigo-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Bookings Management</h1>
                    <p className="text-slate-500 mt-1">Track and update all service requests in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <RealtimeIndicator />
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <FilterBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                paymentFilter={paymentFilter}
                onPaymentFilterChange={setPaymentFilter}
            />

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total", count: bookings.length, color: "text-slate-700" },
                    { label: "Pending", count: bookings.filter(b => b.status === 'pending').length, color: "text-amber-600" },
                    { label: "In Progress", count: bookings.filter(b => b.status === 'in_progress').length, color: "text-indigo-600" },
                    { label: "Completed", count: bookings.filter(b => b.status === 'completed').length, color: "text-green-600" },
                    { label: "Cancelled", count: bookings.filter(b => b.status === 'cancelled').length, color: "text-red-600" },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold">Date</TableHead>
                                <TableHead className="font-bold">Service</TableHead>
                                <TableHead className="font-bold">Customer</TableHead>
                                <TableHead className="font-bold">Price</TableHead>
                                <TableHead className="font-bold">Payment</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="text-right font-bold">Actions</TableHead>
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
                                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                                        {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                                            ? "No bookings match your filters."
                                            : "No bookings found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <TableRow key={booking.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="text-sm">
                                            {booking.createdAt ? format(booking.createdAt.toDate(), "MMM dd, hh:mm a") : "Just now"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{booking.serviceName}</span>
                                                <span className="text-xs text-slate-400">ID: {booking.id.slice(-8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-600">{booking.customerId.slice(-8)}</span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">₹{booking.servicePrice}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-600">{booking.paymentMethod}</span>
                                                <span className={`text-xs font-bold uppercase ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                                                    }`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(booking)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Select
                                                    value={booking.status}
                                                    onValueChange={(val: BookingStatus) => handleStatusChange(booking.id, val)}
                                                >
                                                    <SelectTrigger className="w-[140px] h-8 text-xs font-semibold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="z-[100]">
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="accepted">Accepted</SelectItem>
                                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Results Count */}
            {!loading && filteredBookings.length > 0 && (
                <p className="text-sm text-slate-500 text-center">
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
    );
}
