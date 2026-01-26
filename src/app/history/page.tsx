"use client"

import { ArrowLeft, Star, CheckCircle2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/BottomNavigation"

export default function HistoryPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen pb-24 bg-slate-50">
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
                    <h1 className="text-base font-semibold text-slate-950">Service History</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md mx-auto px-4 py-5 space-y-4">
                {/* Success Banner */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-center shadow-md">
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2} />
                        </div>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1">Service Completed</h2>
                    <p className="text-sm text-blue-100">Your vehicle is ready</p>
                </div>

                {/* Technician Rating Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                    <div className="text-center">
                        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">
                            Rate Your Technician
                        </h2>
                        <p className="text-xs text-slate-500">How was your experience?</p>
                    </div>

                    {/* Technician Info */}
                    <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-base font-bold">RK</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-950 text-sm">Ravi Kumar</h3>
                            <p className="text-xs text-slate-500">Certified Mechanic</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" strokeWidth={0} />
                                <span className="text-xs font-medium text-slate-700">4.8</span>
                                <span className="text-xs text-slate-400">(124 reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform rounded-full hover:bg-slate-50"
                            >
                                <Star
                                    className="w-7 h-7 fill-yellow-400 text-yellow-400"
                                    strokeWidth={0}
                                />
                            </button>
                        ))}
                    </div>

                    <p className="text-center text-xs text-slate-500">
                        You rated <span className="font-semibold text-slate-950">5 stars</span>
                    </p>
                </section>

                {/* Service Summary */}
                <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Service Details</h2>

                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-950">Engine Repair</p>
                                <p className="text-xs text-slate-500 mt-0.5">Coolant pipe replaced and system tested</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-950">Brake Service</p>
                                <p className="text-xs text-slate-500 mt-0.5">Brake pads replaced and aligned</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Service charge</span>
                            <span className="font-medium text-slate-950">₹1,200</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Parts & materials</span>
                            <span className="font-medium text-slate-950">₹450</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tax (GST 18%)</span>
                            <span className="font-medium text-slate-950">₹297</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span className="font-medium">Discount applied</span>
                            <span className="font-semibold">-₹387</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-950">Total Paid</span>
                            <span className="text-xl font-bold text-blue-600">₹1,560</span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3.5 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-700">
                                Payment Successful
                            </p>
                            <p className="text-xs text-green-600 mt-0.5">Paid via UPI • 9% savings applied</p>
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="secondary" size="lg" className="h-12 text-sm">
                        <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        Invoice
                    </Button>
                    <Button size="lg" className="h-12 text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Book Again
                    </Button>
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    )
}
