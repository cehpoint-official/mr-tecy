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
import { Loader2, Users, CheckCircle2, XCircle, ShieldCheck, ShieldOff } from "lucide-react";
import { partnerApplicationService } from "@/services/partner.service";
import { userService } from "@/services/user.service";
import { UserProfile, PartnerApplication } from "@/types";
import { MobileDataCard } from "@/components/admin/MobileDataCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Badge } from "@/components/ui/badge";

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
    const stats = {
        total: partners.length,
        active: partners.filter(p => (p.status || 'active') === 'active').length,
        suspended: partners.filter(p => p.status === 'suspended').length,
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                        Partners & Technicians
                    </h1>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">Manage approved service partners.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 group">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-extrabold tracking-wider">Total Partners</p>
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform">{stats.total}</p>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 group">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <p className="text-[10px] sm:text-xs text-green-700 uppercase font-extrabold tracking-wider">Active</p>
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-green-700 group-hover:scale-105 transition-transform">{stats.active}</p>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-100 group">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <p className="text-[10px] sm:text-xs text-red-700 uppercase font-extrabold tracking-wider">Suspended</p>
                        <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-red-700 group-hover:scale-105 transition-transform">{stats.suspended}</p>
                </div>
            </div>

            {/* Mobile Card View / Desktop Table View */}
            {isMobile ? (
                <div className="space-y-3">
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
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold">Partner Name</TableHead>
                                <TableHead className="font-bold">Contact</TableHead>
                                <TableHead className="font-bold">Skills</TableHead>
                                <TableHead className="font-bold">Service Area</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="text-right font-bold">Actions</TableHead>
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
                                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                        No partners approved yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                partners.map((partner) => {
                                    const isProcessing = processingIds.has(partner.uid);
                                    const isActive = (partner.status || 'active') === 'active';

                                    return (
                                        <TableRow key={partner.uid}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                        {partner.displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{partner.displayName}</div>
                                                        <div className="text-[10px] text-slate-500">{partner.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-600">
                                                    {partner.phone || partner.phoneNumber || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                    {partner.skills && partner.skills.length > 0 ? (
                                                        <>
                                                            {partner.skills.slice(0, 2).map(skill => (
                                                                <Badge key={skill} variant="secondary" className="text-[10px]">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {partner.skills.length > 2 && (
                                                                <span className="text-[10px] text-slate-400">+{partner.skills.length - 2}</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">N/A</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-600">
                                                    {partner.serviceArea || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={isActive ? "default" : "destructive"}
                                                    className="font-bold uppercase text-[10px]"
                                                >
                                                    {isActive ? 'Active' : 'Suspended'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant={isActive ? "destructive" : "default"}
                                                    size="sm"
                                                    onClick={() => isActive ? handleSuspend(partner.uid) : handleActivate(partner.uid)}
                                                    disabled={isProcessing}
                                                    className="gap-1.5 font-bold"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : isActive ? (
                                                        <>
                                                            <ShieldOff className="h-4 w-4" />
                                                            Suspend
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck className="h-4 w-4" />
                                                            Activate
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
            )}
        </div>
    );
}
