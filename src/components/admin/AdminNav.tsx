"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Wrench,
    Users,
    Calendar,
    ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/services", label: "Services", icon: Wrench },
        { href: "/admin/partners", label: "Partners", icon: Users },
        { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    ];

    return (
        <div className="bg-white border-b sticky top-16 z-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex space-x-8 h-12">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors",
                                pathname === link.href
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            <link.icon className="w-4 h-4 mr-2" />
                            {link.label}
                        </Link>
                    ))}
                </div>
                <Link href="/">
                    <Button variant="ghost" size="sm" className="text-slate-500 font-bold text-xs">
                        <ArrowLeft className="w-3 h-3 mr-1" /> Back to App
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// Helper Button wrap since it's used inside
import { Button } from "@/components/ui/button";
