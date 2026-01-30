"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    loading?: boolean;
}

export function StatCard({ title, value, icon: Icon, color, trend, loading }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;

    // Animated counter effect
    useEffect(() => {
        if (loading || isNaN(numericValue)) return;

        let start = 0;
        const end = numericValue;
        const duration = 1000; // 1 second
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [numericValue, loading]);

    const formattedValue = typeof value === 'string' && value.includes('₹')
        ? `₹${displayValue.toLocaleString()}`
        : displayValue.toLocaleString();

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {loading ? (
                        <div className="h-8 w-24 bg-slate-200 animate-pulse rounded" />
                    ) : (
                        <div className="text-2xl font-bold text-slate-900">
                            {typeof value === 'string' && value.includes('₹') ? formattedValue : value}
                        </div>
                    )}
                    {trend && !loading && (
                        <div className="flex items-center gap-1 text-xs">
                            <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-slate-500">vs last month</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
