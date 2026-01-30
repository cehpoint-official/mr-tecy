"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { BookingStatus } from "@/types";

interface FilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    statusFilter?: BookingStatus | "all";
    onStatusFilterChange?: (status: BookingStatus | "all") => void;
    paymentFilter?: "all" | "paid" | "pending";
    onPaymentFilterChange?: (payment: "all" | "paid" | "pending") => void;
    showFilters?: boolean;
}

export function FilterBar({
    searchValue,
    onSearchChange,
    statusFilter = "all",
    onStatusFilterChange,
    paymentFilter = "all",
    onPaymentFilterChange,
    showFilters = true
}: FilterBarProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const hasActiveFilters = statusFilter !== "all" || paymentFilter !== "all";

    const clearFilters = () => {
        onStatusFilterChange?.("all");
        onPaymentFilterChange?.("all");
        onSearchChange("");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search bookings..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-10 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                    />
                    {searchValue && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                {showFilters && (
                    <Button
                        variant={isFilterOpen || hasActiveFilters ? "default" : "outline"}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs bg-white text-blue-600 rounded-full">
                                {(statusFilter !== "all" ? 1 : 0) + (paymentFilter !== "all" ? 1 : 0)}
                            </span>
                        )}
                    </Button>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="text-slate-500">
                        Clear all
                    </Button>
                )}
            </div>

            {/* Filter Options */}
            {isFilterOpen && showFilters && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                    {onStatusFilterChange && (
                        <div className="flex-1">
                            <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                Status
                            </label>
                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[100]">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {onPaymentFilterChange && (
                        <div className="flex-1">
                            <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                Payment Status
                            </label>
                            <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[100]">
                                    <SelectItem value="all">All Payments</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
