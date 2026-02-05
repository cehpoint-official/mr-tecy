"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/BottomNavigation";
import Link from "next/link";
import { Bell, Check, Info, AlertTriangle, XCircle, ChevronRight, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { Notification as NotificationModel, NotificationType } from "@/types";

// Mock Data Source
// Mock Data Removed

export default function NotificationsPage() {
    const { user, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Subscribe to in-app notifications
        const { notificationService } = require("@/services/notification.service");
        const unsubscribe = notificationService.subscribeToNotifications(user.uid, (data: NotificationModel[]) => {
            setNotifications(data);
        });

        // Request permission on mount (or check if already granted)
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                setPermissionGranted(true);
            }
        }

        return () => unsubscribe();
    }, [user]);

    const requestPermission = async () => {
        const { notificationService } = await import("@/services/notification.service");
        if (user) {
            await notificationService.requestPermission(user.uid);
            setPermissionGranted(true);
        }
    };

    const markAsRead = async (id: string) => {
        const { notificationService } = await import("@/services/notification.service");
        await notificationService.markAsRead(id);
    };

    const markAllAsRead = async () => {
        const { notificationService } = await import("@/services/notification.service");
        notifications.forEach(n => {
            if (!n.read) notificationService.markAsRead(n.id);
        });
    };

    const deleteNotification = (id: string) => {
        // notificationService.deleteNotification(id); // TODO: Implement delete in service if needed
        // For now just hide valid ones or implement delete in service
        console.log("Delete not implemented in service yet");
    };

    const clearAll = () => {
        if (confirm("Are you sure you want to clear all notifications?")) {
            setNotifications([]);
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "success": return <Check className="w-5 h-5 text-green-600" />;
            case "error": return <XCircle className="w-5 h-5 text-red-600" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            case "promotion": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">%</Badge>;
            case "booking_update": return <Clock className="w-5 h-5 text-blue-600" />;
            default: return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getTypeColor = (type: NotificationType) => {
        switch (type) {
            case "success": return "bg-green-50 border-green-100";
            case "error": return "bg-red-50 border-red-100";
            case "warning": return "bg-amber-50 border-amber-100";
            case "promotion": return "bg-purple-50 border-purple-100";
            default: return "bg-white border-slate-100";
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 bg-slate-50">
            {/* Header */}
            <header className="px-6 pt-8 pb-6 bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Notifications
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Updates, alerts, and promotions
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!permissionGranted && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={requestPermission}
                                className="text-blue-600 hover:bg-blue-50"
                            >
                                Enable Push
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-blue-600 hover:bg-blue-50 font-semibold"
                            >
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-4 pt-6">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No notifications</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                            You're all caught up! We'll notify you when there's an update on your bookings or special offers.
                        </p>
                        <Link href="/">
                            <Button className="bg-blue-600 hover:bg-blue-700 font-bold rounded-full px-8">
                                Browse Services
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={cn(
                                    "relative group flex gap-4 p-4 rounded-xl border transition-all duration-200",
                                    getTypeColor(notification.type),
                                    !notification.read ? "border-l-4 border-l-blue-600 shadow-sm bg-white" : "opacity-80 hover:opacity-100"
                                )}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        "bg-white shadow-sm border border-slate-100"
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={cn(
                                            "text-sm font-bold truncate pr-2",
                                            !notification.read ? "text-slate-900" : "text-slate-700"
                                        )}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                                            {format(notification.createdAt.toDate(), "MMM d, h:mm a")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                        {notification.message}
                                    </p>

                                    {notification.link && (
                                        <div className="mt-3">
                                            <Link href={notification.link}>
                                                <Button
                                                    size="sm"
                                                    variant="link"
                                                    className="p-0 h-auto font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    View Details <ChevronRight className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Delete Action (Visible on Hover/Focus) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Delete notification"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {notifications.length > 0 && (
                    <div className="flex justify-center pt-4 pb-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                            Clear all notifications
                        </Button>
                    </div>
                )}
            </main>

            <BottomNavigation />
        </div>
    );
}
