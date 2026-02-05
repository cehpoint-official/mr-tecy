"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ChevronLeft,
    Edit2,
    Check,
    X,
    Camera,
    Loader2,
    Shield,
    LogOut,
    History,
    Bell,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { cloudinaryUploadService } from "@/services/cloudinary-upload.service";
import { partnerApplicationService } from "@/services/partner.service";
import { PartnerApplication } from "@/types";
import { Briefcase } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function ProfilePage() {
    const router = useRouter();
    const { user, profile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [partnerApp, setPartnerApp] = useState<PartnerApplication | null>(null);
    const [loadingPartnerStatus, setLoadingPartnerStatus] = useState(true);

    const [formData, setFormData] = useState({
        displayName: "",
        phone: "",
        photoURL: "",
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
        if (profile) {
            const photoURL = profile.photoURL || user?.photoURL || "";
            setFormData({
                displayName: profile.displayName || "",
                phone: profile.phoneNumber || profile.phone || "",
                photoURL: photoURL,
            });
        }
    }, [user, profile, loading, router]);

    // Fetch partner application status
    useEffect(() => {
        async function fetchPartnerStatus() {
            if (!user || !profile) return;

            setLoadingPartnerStatus(true);
            try {
                const app = await partnerApplicationService.getPartnerStatus(user.uid);
                setPartnerApp(app);
            } catch (error) {
                console.error("Error fetching partner status:", error);
            } finally {
                setLoadingPartnerStatus(false);
            }
        }

        fetchPartnerStatus();
    }, [user, profile]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await cloudinaryUploadService.uploadImage(file, "profiles");
            setFormData({ ...formData, photoURL: result.url });
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user || !profile) return;

        setSaving(true);
        try {
            const userRef = doc(db, "user", user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                phoneNumber: formData.phone,
                photoURL: formData.photoURL,
            });

            // Refresh the profile data from Firestore
            if (typeof window !== 'undefined') {
                window.location.reload();
            }

            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            const errorMessage = error?.message || "Unknown error occurred";
            alert(`Failed to update profile: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || "",
                phone: profile.phoneNumber || profile.phone || "",
                photoURL: profile.photoURL || user?.photoURL || "",
            });
        }
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await authService.logout();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!user || !profile) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-slate-50 pb-24">
            {/* Premium Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-blue-100/40 via-indigo-50/30 to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 px-4 py-6">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-white/50 rounded-full"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </Button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">My Profile</h1>
                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="hover:bg-white/50 rounded-full text-blue-600"
                        >
                            <Edit2 className="w-5 h-5" />
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="hover:bg-red-50 rounded-full text-red-600"
                                disabled={saving}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                                className="hover:bg-green-50 rounded-full text-green-600"
                                disabled={saving}
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Check className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <main className="relative z-10 max-w-md mx-auto px-4 space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center justify-center pt-2 pb-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-[4px] border-white shadow-2xl ring-4 ring-blue-500/10 transition-transform duration-300 hover:scale-105">
                            {formData.photoURL ? (
                                <img
                                    src={formData.photoURL}
                                    alt={formData.displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 transition-all border-2 border-white">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5 text-white" />
                                )}
                            </label>
                        )}
                    </div>

                    <div className="mt-4 text-center">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {formData.displayName || "Guest User"}
                        </h2>
                        {profile.role === "admin" && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/50 border border-blue-200 rounded-full">
                                <Shield className="w-3.5 h-3.5 text-blue-700" />
                                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Admin Access</span>
                            </div>
                        )}
                        {profile.role === "partner" && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100/50 border border-purple-200 rounded-full">
                                <Briefcase className="w-3.5 h-3.5 text-purple-700" />
                                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Service Partner</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Personal Info</h3>
                    </div>

                    <div className="space-y-5">
                        {/* Display Name */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Full Name
                            </Label>
                            {isEditing ? (
                                <Input
                                    value={formData.displayName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, displayName: e.target.value })
                                    }
                                    placeholder="Enter your name"
                                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all"
                                />
                            ) : (
                                <div className="p-3.5 bg-white/50 rounded-xl border border-slate-100 font-bold text-slate-800">
                                    {formData.displayName || "Not set"}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Email Address
                            </Label>
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 font-medium text-slate-600 flex items-center justify-between">
                                <span className="truncate">{user.email}</span>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Phone Number
                            </Label>
                            {isEditing ? (
                                <Input
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder="Enter your phone number"
                                    type="tel"
                                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all"
                                />
                            ) : (
                                <div className="p-3.5 bg-white/50 rounded-xl border border-slate-100 font-bold text-slate-800">
                                    {formData.phone || "Not set"}
                                </div>
                            )}
                        </div>

                        {/* Member Since */}
                        <div className="pt-2 border-t border-slate-100/50 flex items-center justify-between text-sm text-slate-500 px-1">
                            <span className="font-medium">Member Since</span>
                            <span className="font-bold text-slate-700">
                                {profile.createdAt
                                    ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString(
                                        "en-US",
                                        { month: "long", year: "numeric" }
                                    )
                                    : "Recently"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <Check className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                    </div>

                    <div className="space-y-3">
                        <Link href="/history">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white shadow-sm hover:shadow-md hover:bg-white/80 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-lg group-hover:scale-110 transition-transform">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900 text-lg leading-tight">Booking History</p>
                                        <p className="text-xs font-medium text-slate-500">View past and active bookings</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <ChevronLeft className="w-4 h-4 rotate-180" />
                                </div>
                            </button>
                        </Link>

                        {profile.role === "admin" && (
                            <Link href="/admin">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white shadow-sm hover:shadow-md hover:bg-white/80 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900 text-lg leading-tight">Admin Dashboard</p>
                                            <p className="text-xs font-medium text-slate-500">Manage platform and users</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        <ChevronLeft className="w-4 h-4 rotate-180" />
                                    </div>
                                </button>
                            </Link>
                        )}

                        {/* Partner Application */}
                        {profile.role === "customer" && !loadingPartnerStatus && !partnerApp && (
                            <Link href="/partner/apply">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-purple-200 shadow-lg group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900 text-lg leading-tight">Become a Partner</p>
                                            <p className="text-xs font-medium text-slate-500">Join our professional network</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                        <ChevronLeft className="w-4 h-4 rotate-180" />
                                    </div>
                                </button>
                            </Link>
                        )}

                        {/* Partner Status (if already applied) */}
                        {profile.role === "partner" && !loadingPartnerStatus && partnerApp && (
                            <Link href="/partner/status">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white shadow-sm hover:shadow-md hover:bg-white/80 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-amber-200 shadow-lg group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900 text-lg leading-tight">Partner Application</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-xs font-medium text-slate-500">Status:</span>
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${partnerApp.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    partnerApp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {partnerApp.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                        <ChevronLeft className="w-4 h-4 rotate-180" />
                                    </div>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full h-14 rounded-2xl border border-red-100 text-red-600 bg-red-50/50 hover:bg-red-100/50 hover:border-red-200 font-bold transition-all"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </Button>

                {/* Spacer for bottom nav */}
                <div className="h-8" />
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}
