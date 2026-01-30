"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Bell, User, Menu } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile, loading, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!profile || profile.role !== "admin")) {
            router.push("/");
        }
    }, [profile, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!profile || profile.role !== "admin") {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b sticky top-0 z-40">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden p-0 h-8 w-8"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6 text-slate-600" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                                <p className="text-sm text-slate-500 hidden sm:block">Manage your business operations</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="text-left hidden md:block">
                                            <p className="text-sm font-medium">{profile.displayName}</p>
                                            <p className="text-xs text-slate-500">Administrator</p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-600">
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

