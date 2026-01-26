"use client"

import { ArrowLeft, ChevronDown, MapPin, Calendar, CheckSquare, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/BottomNavigation"

export default function BookingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen pb-32 bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-3.5 sticky top-0 z-40 shadow-sm">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-slate-700 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                    </Button>
                    <h1 className="text-base font-semibold text-slate-950">Book Service</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md mx-auto px-4 py-5 space-y-4">
                {/* Service Details Card */}
                <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Service Details</h2>
                        <Badge variant="secondary" className="text-xs">Car</Badge>
                    </div>

                    {/* Service Info */}
                    <div className="flex gap-3">
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&auto=format&fit=crop&q=80"
                                alt="Car"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-950 text-sm mb-0.5">Mechanical Service</h3>
                            <p className="text-xs text-slate-500 mb-2">Full service and repair</p>
                            <p className="text-sm text-blue-600 font-semibold">₹800 - ₹1,200</p>
                        </div>
                    </div>

                    {/* Vehicle Selection */}
                    <div>
                        <label className="text-xs font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 uppercase">
                            <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                            Vehicle Type
                        </label>
                        <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:bg-slate-50 transition-colors text-left">
                            <span className="text-sm text-slate-950">Select your vehicle</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                        </button>
                    </div>
                </section>

                {/* Issues Checklist */}
                <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Select Issues</h2>

                    <div className="space-y-2.5">
                        <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                            <input
                                type="checkbox"
                                className="checkbox-custom mt-0.5"
                                defaultChecked
                            />
                            <div className="flex-1">
                                <span className="text-sm text-slate-950 font-medium group-hover:text-blue-600 transition-colors">Engine coolant issue</span>
                                <p className="text-xs text-slate-500 mt-0.5">Pipe broke and needs replacement</p>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                            <input
                                type="checkbox"
                                className="checkbox-custom mt-0.5"
                            />
                            <div className="flex-1">
                                <span className="text-sm text-slate-950 font-medium group-hover:text-blue-600 transition-colors">Brake system check</span>
                                <p className="text-xs text-slate-500 mt-0.5">Inspect brake pads and fluid</p>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                            <input
                                type="checkbox"
                                className="checkbox-custom mt-0.5"
                            />
                            <div className="flex-1">
                                <span className="text-sm text-slate-950 font-medium group-hover:text-blue-600 transition-colors">Oil change</span>
                                <p className="text-xs text-slate-500 mt-0.5">Engine oil replacement</p>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Estimated Pricing */}
                <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Estimated Cost</h2>
                        <Badge variant="secondary" className="text-xs">Approximate</Badge>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Service charge</span>
                            <span className="font-medium text-slate-950">₹500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Parts & materials</span>
                            <span className="font-medium text-slate-950">₹350</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-950">Total</span>
                            <span className="text-lg font-bold text-blue-600">₹850</span>
                        </div>
                    </div>
                </section>

                {/* Engineers Map */}
                <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Engineers Nearby</h2>
                        <button className="text-xs text-blue-600 font-medium hover:text-blue-700">View All</button>
                    </div>

                    {/* Professional Map Placeholder */}
                    <div className="relative h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>

                        {/* Engineer Markers */}
                        <div className="absolute top-8 left-10 w-9 h-9 rounded-full bg-white shadow-md border-2 border-blue-600 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">RK</span>
                        </div>
                        <div className="absolute top-14 right-12 w-9 h-9 rounded-full bg-white shadow-md border-2 border-blue-600 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">AM</span>
                        </div>
                        <div className="absolute bottom-10 left-16 w-9 h-9 rounded-full bg-white shadow-md border-2 border-blue-600 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">SP</span>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-slate-200">
                                <p className="text-xs font-semibold text-slate-950">📍 3 engineers available</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Schedule */}
                <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Schedule Appointment</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:bg-slate-50 transition-colors">
                            <Calendar className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                            <span className="text-sm text-slate-950">Feb 15, 2025</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:bg-slate-50 transition-colors">
                            <span className="text-sm text-slate-950">10:30 AM</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent pt-6 z-30">
                <div className="max-w-md mx-auto">
                    <Button size="lg" className="w-full shadow-xl text-base font-bold h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Confirm Booking
                    </Button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    )
}
