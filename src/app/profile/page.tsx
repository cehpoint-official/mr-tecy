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
            console.log("Profile data:", {
                profilePhotoURL: profile.photoURL,
                userPhotoURL: user?.photoURL,
                finalPhotoURL: photoURL
            });

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
            const userRef = doc(db, "user", user.uid); // Changed from "users" to "user"
            await updateDoc(userRef, {
                displayName: formData.displayName,
                phoneNumber: formData.phone, // Use phoneNumber field for Firestore
                photoURL: formData.photoURL,
            });

            // Refresh the profile data from Firestore
            if (typeof window !== 'undefined') {
                window.location.reload(); // Simple refresh to get updated data
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
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-[#A1F6FB] via-[#DBFDFC] to-slate-50 pointer-events-none" />

            {/* Header */}
            <div className="bg-transparent px-4 py-4 sticky top-0 z-30 backdrop-blur-sm">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-white/50"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-extrabold text-slate-900">Profile</h1>
                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="hover:bg-white/50"
                        >
                            <Edit2 className="w-5 h-5 text-blue-600" />
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="hover:bg-red-50"
                                disabled={saving}
                            >
                                <X className="w-5 h-5 text-red-600" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSave}
                                className="hover:bg-green-50"
                                disabled={saving}
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                                ) : (
                                    <Check className="w-5 h-5 text-green-600" />
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-4 space-y-6 relative z-10">
                {/* Profile Picture */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-blue-100">
                            {formData.photoURL ? (
                                <img
                                    src={formData.photoURL}
                                    alt={formData.displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
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
                </div>

                {/* Role Badge */}
                {profile.role === "admin" && (
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
                            <Shield className="w-4 h-4" />
                            Admin Account
                        </div>
                    </div>
                )}

                {/* Profile Info */}
                <Card className="border-none shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">
                            Personal Information
                        </h2>

                        <div className="space-y-4">
                            {/* Display Name */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Full Name
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.displayName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, displayName: e.target.value })
                                        }
                                        placeholder="Enter your name"
                                        className="border-2 border-slate-200 focus:border-blue-400 rounded-xl"
                                    />
                                ) : (
                                    <p className="text-slate-900 font-medium px-3 py-2">
                                        {formData.displayName || "Not set"}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Email
                                </Label>
                                <p className="text-slate-600 font-medium px-3 py-2 bg-slate-50 rounded-xl">
                                    {user.email}
                                </p>
                                <p className="text-xs text-slate-400 px-3">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Phone className="w-4 h-4 text-blue-600" />
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
                                        className="border-2 border-slate-200 focus:border-blue-400 rounded-xl"
                                    />
                                ) : (
                                    <p className="text-slate-900 font-medium px-3 py-2">
                                        {formData.phone || "Not set"}
                                    </p>
                                )}
                            </div>

                            {/* Member Since */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    Member Since
                                </Label>
                                <p className="text-slate-600 font-medium px-3 py-2">
                                    {profile.createdAt
                                        ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString(
                                            "en-US",
                                            { month: "long", year: "numeric" }
                                        )
                                        : "Recently"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-none shadow-md">
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">
                            Quick Actions
                        </h2>

                        <Link href="/history">
                            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <History className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Booking History</p>
                                        <p className="text-xs text-slate-500">View past bookings</p>
                                    </div>
                                </div>
                                <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
                            </button>
                        </Link>

                        {profile.role === "admin" && (
                            <Link href="/admin">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Shield className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Admin Dashboard</p>
                                            <p className="text-xs text-slate-500">Manage platform</p>
                                        </div>
                                    </div>
                                    <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
                                </button>
                            </Link>
                        )}

                        {/* Partner Application */}
                        {profile.role === "customer" && !loadingPartnerStatus && !partnerApp && (
                            <Link href="/partner/apply">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group border-2 border-transparent hover:border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Become a Partner</p>
                                            <p className="text-xs text-slate-500">Join our network of professionals</p>
                                        </div>
                                    </div>
                                    <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
                                </button>
                            </Link>
                        )}

                        {/* Partner Status (if already applied) */}
                        {profile.role === "partner" && !loadingPartnerStatus && partnerApp && (
                            <Link href="/partner/status">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                            <Briefcase className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Partner Application</p>
                                            <p className="text-xs text-slate-500">
                                                Status: <span className="font-semibold capitalize">{partnerApp.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
                                </button>
                            </Link>
                        )}
                    </CardContent>
                </Card>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold transition-all"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Log Out
                </Button>

                {/* Spacer for bottom nav */}
                <div className="h-8" />
            </main>
        </div>
    );
}
