"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, User, Menu, X } from "lucide-react";
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
    const { profile, user, loading, logout } = useAuth();
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
                {/* Header - Mobile Optimized */}
                <header className="bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden p-0 h-9 w-9 rounded-full hover:bg-blue-100"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? (
                                    <X className="h-5 w-5 text-slate-700" />
                                ) : (
                                    <Menu className="h-5 w-5 text-slate-700" />
                                )}
                            </Button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">Admin Panel</h1>
                                <p className="text-xs text-slate-500 hidden sm:block font-medium">Manage your business operations</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* User Menu - Mobile Optimized */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 w-9 sm:h-auto sm:w-auto rounded-full sm:rounded-xl p-0 sm:px-3 sm:gap-2">
                                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-blue-100">
                                            {profile?.photoURL ? (
                                                <img
                                                    src={profile.photoURL}
                                                    alt={profile.displayName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left hidden md:block">
                                            <p className="text-sm font-bold">{profile.displayName}</p>
                                            <p className="text-xs text-slate-500">Administrator</p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profile Settings</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/")}>Go to Website</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-600 font-bold">
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
