"use client";

import React from "react";
import { Smartphone, MonitorOff } from "lucide-react";
import Link from "next/link";

const DesktopOnlyPage = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black text-white overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

            <div className="max-w-md w-full text-center space-y-8 relative z-10">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                        <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="flex -space-x-4 items-center justify-center">
                                <MonitorOff className="w-16 h-16 text-red-400 opacity-50" />
                                <Smartphone className="w-20 h-20 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-400">
                        Mobile Only App
                    </h1>
                    <p className="text-xl text-slate-300 font-medium">
                        Please open this app on mobile.
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto" />
                    <p className="text-slate-400 text-sm leading-relaxed">
                        To provide the best service experience, Mr. Tecy is exclusively designed for mobile and tablet devices.
                    </p>
                </div>

                <div className="pt-4">
                    {/* QR Code placeholder or helpful info */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Scan or Visit</p>
                        <div className="text-blue-400 font-mono text-lg">mrtecy.com</div>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-8 text-slate-500 text-xs font-medium">
                &copy; {new Date().getFullYear()} Mr. Tecy. All rights reserved.
            </footer>
        </div>
    );
};

export default DesktopOnlyPage;
