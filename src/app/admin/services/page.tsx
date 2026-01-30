"use client";

import { useState } from "react";
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
import { Plus, Pencil, Trash2, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { serviceService } from "@/services/service.service";
import { Service, ServiceCategory } from "@/types";
import { useRealtimeServices } from "@/hooks/useRealtimeServices";
import { RealtimeIndicator } from "@/components/admin/RealtimeIndicator";

export default function ServicesPage() {
    const { services, loading } = useRealtimeServices({ onlyActive: false });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "Appliance" as ServiceCategory,
        description: "",
        price: "",
        durationMinutes: "60",
    });

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingId(service.id);
            setFormData({
                name: service.name,
                category: service.category,
                description: service.description,
                price: service.price.toString(),
                durationMinutes: service.durationMinutes.toString(),
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                category: "Appliance",
                description: "",
                price: "",
                durationMinutes: "60",
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
                price: parseFloat(formData.price),
                durationMinutes: parseInt(formData.durationMinutes),
                active: true,
            };

            if (editingId) {
                await serviceService.updateService(editingId, dataToSave);
            } else {
                await serviceService.createService(dataToSave);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving service:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (service: Service) => {
        try {
            await serviceService.updateService(service.id, { active: !service.active });
        } catch (error) {
            console.error("Error toggling service status:", error);
        }
    };

    // Calculate stats
    const stats = {
        total: services.length,
        active: services.filter(s => s.active).length,
        inactive: services.filter(s => !s.active).length,
        avgPrice: services.length > 0
            ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
            : 0,
    };

    return (
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Service Catalog</h1>
                    <p className="text-slate-500 mt-1">Manage your automotive and appliance services.</p>
                </div>
                <div className="flex items-center gap-3">
                    <RealtimeIndicator />
                    <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
                        <Plus className="h-4 w-4" />
                        Add Service
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-medium">Total Services</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-green-700 uppercase font-medium">Active</p>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-700 mt-1">{stats.active}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 uppercase font-medium">Inactive</p>
                        <TrendingDown className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-600 mt-1">{stats.inactive}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 uppercase font-medium">Avg Price</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">₹{stats.avgPrice}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold">Service Name</TableHead>
                                <TableHead className="font-bold">Category</TableHead>
                                <TableHead className="font-bold">Base Price</TableHead>
                                <TableHead className="font-bold">Duration</TableHead>
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
                            ) : services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                        No services found. Add your first service to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{service.name}</span>
                                                <span className="text-xs text-slate-400 line-clamp-1">{service.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                                {service.category}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">₹{service.price}</TableCell>
                                        <TableCell className="text-sm text-slate-600">{service.durationMinutes} min</TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleToggleStatus(service)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${service.active
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {service.active ? 'Active' : 'Inactive'}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
                                                    onClick={() => handleOpenDialog(service)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 ${service.active
                                                        ? "text-slate-500 hover:text-red-600"
                                                        : "text-slate-500 hover:text-green-600"
                                                        }`}
                                                    onClick={() => handleToggleStatus(service)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingId ? "Edit Service" : "Add New Service"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Full Car Maintenance"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[100]">
                                        <SelectItem value="Vehicle">Vehicle</SelectItem>
                                        <SelectItem value="Appliance">Appliance</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Base Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="299"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what's included in this service..."
                                rows={3}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.durationMinutes}
                                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                                placeholder="60"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    editingId ? "Update Service" : "Create Service"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
