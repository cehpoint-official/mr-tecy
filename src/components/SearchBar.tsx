"use client"

import { Search, Mic } from "lucide-react"

export function SearchBar() {
    return (
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <input
                type="search"
                placeholder="Search for engineering services"
                className="w-full h-11 pl-11 pr-11 rounded-full border border-slate-200 bg-white text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
            />
            <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                aria-label="Voice search"
            >
                <Mic className="w-4 h-4" strokeWidth={1.5} />
            </button>
        </div>
    )
}
