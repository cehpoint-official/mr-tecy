"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
    const pathname = usePathname()

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/booking", icon: Plus, label: "Book", isFloating: true },
        { href: "/history", icon: History, label: "History" },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
            <div className="max-w-md mx-auto glass-nav border-t border-slate-200/50">
                <div className="flex items-center justify-around h-16 px-4 relative">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        if (item.isFloating) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="absolute left-1/2 -translate-x-1/2 -top-6"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-14 h-14 rounded-full bg-blue-600 shadow-lg hover:shadow-xl hover:bg-blue-700 flex items-center justify-center transition-all active:scale-95">
                                            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600 mt-0.5">
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            )
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors",
                                    isActive
                                        ? "text-blue-600"
                                        : "text-slate-500 hover:text-blue-600"
                                )}
                            >
                                <Icon
                                    className="w-5 h-5"
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
