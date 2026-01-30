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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Plus, Pencil, Loader2, Users, MapPin } from "lucide-react";
import { partnerService } from "@/services/partner.service";
import { serviceService } from "@/services/service.service";
import { Partner, Service } from "@/types";
import { GeoPoint } from "firebase/firestore";

export default function PartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        contactInfo: "",
        availability: "offline" as "online" | "offline",
        selectedServices: [] as string[],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [partnersData, servicesData] = await Promise.all([
                partnerService.getPartners(),
                serviceService.getServices()
            ]);
            setPartners(partnersData);
            setServices(servicesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (partner?: Partner) => {
        if (partner) {
            setEditingId(partner.id);
            setFormData({
                name: partner.name,
                bio: partner.bio,
                contactInfo: partner.contactInfo || "",
                availability: partner.availability,
                selectedServices: partner.services,
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                bio: "",
                contactInfo: "",
                availability: "offline",
                selectedServices: [],
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dataToSave = {
                ...formData,
                services: formData.selectedServices,
                location: new GeoPoint(0, 0), // Placeholder
                isVerified: true
            };

            if (editingId) {
                await partnerService.updatePartner(editingId, dataToSave);
            } else {
                await partnerService.createPartner(dataToSave as any);
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving partner:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950">Partners & Technicians</h1>
                    <p className="text-slate-500">Manage your fleet of service providers.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Register Partner
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold">Partner Name</TableHead>
                            <TableHead className="font-bold">Skills</TableHead>
                            <TableHead className="font-bold">Rating</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="text-right font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : partners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                    No partners registered yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            partners.map((partner) => (
                                <TableRow key={partner.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                {partner.name.charAt(0)}
                                            </div>
                                            {partner.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {partner.services.slice(0, 2).map(s => {
                                                const service = services.find(sv => sv.id === s);
                                                return (
                                                    <span key={s} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                                        {service?.name || s}
                                                    </span>
                                                )
                                            })}
                                            {partner.services.length > 2 && <span className="text-[10px] text-slate-400">+{partner.services.length - 2} more</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                            <span>★</span> {partner.rating.toFixed(1)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${partner.availability === 'online' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {partner.availability}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-500"
                                            onClick={() => handleOpenDialog(partner)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Partner" : "Register Partner"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="pname">Full Name</Label>
                            <Input
                                id="pname"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Technician Name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Info</Label>
                            <Input
                                id="contact"
                                value={formData.contactInfo}
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                placeholder="Phone or Email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Availability</Label>
                            <Select
                                value={formData.availability}
                                onValueChange={(val: any) => setFormData({ ...formData, availability: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="z-[100]">
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Skills (Services)</Label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border p-2 rounded-md bg-slate-50">
                                {services.map(service => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => {
                                            const current = formData.selectedServices;
                                            const updated = current.includes(service.id)
                                                ? current.filter(id => id !== service.id)
                                                : [...current, service.id];
                                            setFormData({ ...formData, selectedServices: updated });
                                        }}
                                        className={`text-[10px] px-2 py-1 rounded-full font-bold transition-colors ${formData.selectedServices.includes(service.id)
                                            ? "bg-blue-600 text-white"
                                            : "bg-white border text-slate-500 hover:border-blue-300"
                                            }`}
                                    >
                                        {service.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio / Notes</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Experience, specialized tools, etc."
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full" disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingId ? "Update Partner" : "Register Partner"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
