"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Users, CheckCircle2, XCircle, ShieldCheck, ShieldOff, AlertCircle } from "lucide-react";
import { partnerApplicationService } from "@/services/partner.service";
import { userService } from "@/services/user.service";
import { UserProfile, PartnerApplication } from "@/types";
import { MobileDataCard } from "@/components/admin/MobileDataCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RealtimeIndicator } from "@/components/admin/RealtimeIndicator";

type PartnerWithDetails = UserProfile & Partial<PartnerApplication>;

export default function PartnersPage() {
    const [partners, setPartners] = useState<PartnerWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const partnersData = await partnerApplicationService.getApprovedPartnersWithDetails();
            setPartners(partnersData);
        } catch (error) {
            console.error("Error fetching partners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (userId: string) => {
        setProcessingIds(prev => new Set(prev).add(userId));
        try {
            await userService.suspendPartner(userId);
            await fetchPartners();
        } catch (error) {
            console.error("Error suspending partner:", error);
            alert("Failed to suspend partner");
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleActivate = async (userId: string) => {
        setProcessingIds(prev => new Set(prev).add(userId));
        try {
            await userService.activatePartner(userId);
            await fetchPartners();
        } catch (error) {
            console.error("Error activating partner:", error);
            alert("Failed to activate partner");
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    // Calculate stats
    const stats = [
        { label: "Total Partners", value: partners.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active", value: partners.filter(p => (p.status || 'active') === 'active').length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: "Suspended", value: partners.filter(p => p.status === 'suspended').length, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    ];

    return (
        <div className="min-h-screen pb-12 overflow-x-hidden">
            {/* Premium Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-blue-100/30 via-cyan-50/20 to-transparent pointer-events-none" />

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6 pt-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Partners
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Manage approved service partners and technicians.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RealtimeIndicator />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {stats.map((stat) => (
                        <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-extrabold tracking-wider">{stat.label}</p>
                                    <p className={`text-2xl sm:text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Mobile Card View / Desktop Table View */}
                {isMobile ? (
                    <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-xl" />
                            ))
                        ) : partners.length === 0 ? (
                            <div className="text-center py-12 bg-white/95 backdrop-blur-md rounded-xl shadow-md">
                                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-slate-400">No partners approved yet.</p>
                            </div>
                        ) : (
                            partners.map((partner) => {
                                const isProcessing = processingIds.has(partner.uid);
                                const isActive = (partner.status || 'active') === 'active';

                                return (
                                    <MobileDataCard
                                        key={partner.uid}
                                        title={partner.displayName}
                                        subtitle={partner.email}
                                        status={{
                                            label: isActive ? 'Active' : 'Suspended',
                                            variant: isActive ? 'default' : 'destructive'
                                        }}
                                        metadata={[
                                            { label: "Phone", value: partner.phone || partner.phoneNumber || 'N/A' },
                                            { label: "Skills", value: partner.skills?.join(', ') || 'N/A' },
                                            { label: "Service Area", value: partner.serviceArea || 'N/A' },
                                            { label: "Experience", value: partner.experience ? `${partner.experience} years` : 'N/A' }
                                        ]}
                                        actions={[
                                            {
                                                label: isActive ? "Suspend" : "Activate",
                                                icon: isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                                    isActive ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />,
                                                onClick: () => isActive ? handleSuspend(partner.uid) : handleActivate(partner.uid)
                                            }
                                        ]}
                                    />
                                );
                            })
                        )}
                    </div>
                ) : (
                    <Card className="border-none shadow-md bg-white/90 backdrop-blur-md overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-b-slate-100">
                                        <TableHead className="font-bold text-slate-700">Partner Details</TableHead>
                                        <TableHead className="font-bold text-slate-700">Contact Info</TableHead>
                                        <TableHead className="font-bold text-slate-700">Skills & Expertise</TableHead>
                                        <TableHead className="font-bold text-slate-700">Service Area</TableHead>
                                        <TableHead className="font-bold text-slate-700">Status</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12">
                                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ) : partners.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                                    <p className="font-medium">No partners approved yet</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        partners.map((partner) => {
                                            const isProcessing = processingIds.has(partner.uid);
                                            const isActive = (partner.status || 'active') === 'active';

                                            return (
                                                <TableRow key={partner.uid} className="hover:bg-blue-50/30 transition-colors border-b-slate-50">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-black text-sm shadow-sm">
                                                                {partner.displayName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900">{partner.displayName}</span>
                                                                <span className="text-xs text-slate-400">Since {new Date().getFullYear()}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-medium text-slate-700">{partner.email}</span>
                                                            <span className="text-xs text-slate-500">{partner.phone || partner.phoneNumber || 'N/A'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                            {partner.skills && partner.skills.length > 0 ? (
                                                                <>
                                                                    {partner.skills.slice(0, 2).map(skill => (
                                                                        <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] hover:bg-slate-200">
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                    {partner.skills.length > 2 && (
                                                                        <Badge variant="outline" className="text-[10px] text-slate-400 border-dashed">
                                                                            +{partner.skills.length - 2}
                                                                        </Badge>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-sm text-slate-400 italic">No skills listed</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm font-medium text-slate-600">
                                                            {partner.serviceArea || 'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={isActive ? "default" : "destructive"}
                                                            className={`font-bold uppercase text-[10px] ${isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} shadow-none`}
                                                        >
                                                            {isActive ? 'Active' : 'Suspended'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant={isActive ? "ghost" : "default"}
                                                            size="sm"
                                                            onClick={() => isActive ? handleSuspend(partner.uid) : handleActivate(partner.uid)}
                                                            disabled={isProcessing}
                                                            className={`gap-1.5 font-bold h-8 ${isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                                        >
                                                            {isProcessing ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : isActive ? (
                                                                <>
                                                                    <ShieldOff className="h-3.5 w-3.5" />
                                                                    <span className="text-xs">Suspend</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                                    <span className="text-xs">Activate</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
