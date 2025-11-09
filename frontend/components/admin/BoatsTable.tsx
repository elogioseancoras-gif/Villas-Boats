'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Ship,
  MapPin,
  Users,
  Ruler,
  DollarSign,
} from 'lucide-react';
import { Boat, BoatStatus } from '@/types';
import { BoatService } from '@/lib/api/services/boat.service';
import { adaptBoats } from '@/lib/api/adapters/boat.adapter';
import type { CreateBoatRequest, UpdateBoatRequest, BoatType } from '@/types/api';

interface BoatsTableProps {
  locale?: 'en' | 'pt-BR' | 'pt-PT' | 'es';
}

export function BoatsTable({ locale = 'en' }: BoatsTableProps) {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalBoats, setTotalBoats] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<BoatType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BoatStatus | 'all'>('all');

  // Dialogs
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
    slug: '',
    type: 'SAILBOAT' as BoatType,
    status: BoatStatus.ACTIVE,
    description: { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
    shortDescription: { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
    make: '',
    model: '',
    year: new Date().getFullYear(),
    length: 0,
    capacity: 0,
    cabins: 0,
    bathrooms: 0,
    locationId: '',
    priceUSD: 0,
    priceEUR: 0,
    priceGBP: 0,
    priceBRL: 0,
    captainRequired: false,
    captainPriceUSD: 0,
    captainPriceEUR: 0,
    captainPriceGBP: 0,
    captainPriceBRL: 0,
    primaryImageUrl: '',
  });

  useEffect(() => {
    fetchBoats();
  }, [currentPage, pageSize, searchQuery, typeFilter, statusFilter]);

  const fetchBoats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build search params for BoatService
      const params: any = {
        page: currentPage - 1, // API uses 0-based indexing
        size: pageSize,
      };

      if (typeFilter !== 'all') params.type = typeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      // Note: BoatSearchParams doesn't include a search/query field
      // If search is needed, would need to use BoatService.search() instead
      // For now, using getPage() with type and status filters

      const response = await BoatService.getPage(params);
      const adaptedBoats = adaptBoats(response.content);

      setBoats(adaptedBoats);
      setTotalBoats(response.page.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load boats');
      console.error('Error fetching boats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (boat: Boat) => {
    setSelectedBoat(boat);
    setIsDetailsOpen(true);
  };

  const handleEdit = (boat: Boat) => {
    setSelectedBoat(boat);
    setFormData({
      name: boat.name,
      slug: boat.slug,
      type: boat.type as unknown as BoatType,  // Cast to API BoatType
      status: boat.status,
      description: boat.description,
      shortDescription: boat.shortDescription || { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
      make: boat.make || '',
      model: boat.model || '',
      year: boat.year || new Date().getFullYear(),
      length: boat.length,
      capacity: boat.capacity,
      cabins: boat.cabins || 0,
      bathrooms: boat.bathrooms || 0,
      locationId: boat.location?.id || '',
      priceUSD: boat.priceUSD,
      priceEUR: boat.priceEUR || 0,
      priceGBP: boat.priceGBP || 0,
      priceBRL: boat.priceBRL || 0,
      captainRequired: false, // Not available in current Boat type
      captainPriceUSD: boat.captainPricePerDayUsd || 0,
      captainPriceEUR: boat.captainPricePerDayEur || 0,
      captainPriceGBP: boat.captainPricePerDayGbp || 0,
      captainPriceBRL: boat.captainPricePerDayBrl || 0,
      primaryImageUrl: boat.images?.[0]?.url || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (boat: Boat) => {
    setSelectedBoat(boat);
    setIsDeleteOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
      slug: '',
      type: 'SAILBOAT' as BoatType,
      status: BoatStatus.ACTIVE,
      description: { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
      shortDescription: { en: '', 'pt-BR': '', 'pt-PT': '', es: '' },
      make: '',
      model: '',
      year: new Date().getFullYear(),
      length: 0,
      capacity: 0,
      cabins: 0,
      bathrooms: 0,
      locationId: '',
      priceUSD: 0,
      priceEUR: 0,
      priceGBP: 0,
      priceBRL: 0,
      captainRequired: false,
      captainPriceUSD: 0,
      captainPriceEUR: 0,
      captainPriceGBP: 0,
      captainPriceBRL: 0,
      primaryImageUrl: '',
    });
    setIsCreateOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBoat) return;

    try {
      await BoatService.delete(selectedBoat.id);
      await fetchBoats();
      setIsDeleteOpen(false);
      setSelectedBoat(null);
    } catch (err) {
      console.error('Error deleting boat:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete boat');
    }
  };

  // Map formData to API request format
  const mapFormDataToCreateRequest = (data: typeof formData): CreateBoatRequest => ({
    nameI18n: data.name,
    descriptionI18n: data.description,
    shortDescriptionI18n: data.shortDescription,
    type: data.type,
    status: data.status,
    make: data.make || undefined,
    model: data.model || undefined,
    year: data.year || undefined,
    lengthFeet: data.length || undefined,
    capacity: data.capacity,
    cabins: data.cabins || undefined,
    bathrooms: data.bathrooms || undefined,
    locationId: data.locationId,
    pricePerDayUsd: data.priceUSD,
    pricePerDayEur: data.priceEUR,
    pricePerDayGbp: data.priceGBP,
    pricePerDayBrl: data.priceBRL,
    captainRequired: data.captainRequired,
    captainPricePerDayUsd: data.captainPriceUSD || undefined,
    captainPricePerDayEur: data.captainPriceEUR || undefined,
    captainPricePerDayGbp: data.captainPriceGBP || undefined,
    captainPricePerDayBrl: data.captainPriceBRL || undefined,
    primaryImageUrl: data.primaryImageUrl || undefined,
  });

  const mapFormDataToUpdateRequest = (data: typeof formData): UpdateBoatRequest => ({
    nameI18n: data.name,
    descriptionI18n: data.description,
    shortDescriptionI18n: data.shortDescription,
    type: data.type,
    status: data.status,
    make: data.make || undefined,
    model: data.model || undefined,
    year: data.year || undefined,
    lengthFeet: data.length || undefined,
    capacity: data.capacity,
    cabins: data.cabins || undefined,
    bathrooms: data.bathrooms || undefined,
    locationId: data.locationId,
    pricePerDayUsd: data.priceUSD,
    pricePerDayEur: data.priceEUR,
    pricePerDayGbp: data.priceGBP,
    pricePerDayBrl: data.priceBRL,
    captainRequired: data.captainRequired,
    captainPricePerDayUsd: data.captainPriceUSD || undefined,
    captainPricePerDayEur: data.captainPriceEUR || undefined,
    captainPricePerDayGbp: data.captainPriceGBP || undefined,
    captainPricePerDayBrl: data.captainPriceBRL || undefined,
    primaryImageUrl: data.primaryImageUrl || undefined,
  });

  const handleSave = async () => {
    try {
      if (selectedBoat) {
        const updateRequest = mapFormDataToUpdateRequest(formData);
        await BoatService.update(selectedBoat.id, updateRequest);
      } else {
        const createRequest = mapFormDataToCreateRequest(formData);
        await BoatService.create(createRequest);
      }

      await fetchBoats();
      setIsEditOpen(false);
      setIsCreateOpen(false);
      setSelectedBoat(null);
    } catch (err) {
      console.error('Error saving boat:', err);
      setError(err instanceof Error ? err.message : 'Failed to save boat');
    }
  };

  const getStatusBadgeVariant = (status: BoatStatus) => {
    switch (status) {
      case BoatStatus.ACTIVE:
        return 'default';
      case BoatStatus.INACTIVE:
        return 'secondary';
      case BoatStatus.MAINTENANCE:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'SAILBOAT':
        return 'default';
      case 'CATAMARAN':
        return 'secondary';
      case 'MOTOR_YACHT':
      case 'YACHT':  // Legacy frontend enum value
        return 'outline';
      case 'GULET':
        return 'destructive';
      case 'MOTORBOAT':  // Legacy frontend enum value
      case 'JETSKI':  // Legacy frontend enum value
      case 'FISHING_BOAT':  // Legacy frontend enum value
      case 'SPEEDBOAT':  // Legacy frontend enum value
      case 'OTHER':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const totalPages = Math.ceil(totalBoats / pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Boats Management</h2>
          <p className="text-muted-foreground">
            Manage your fleet of boats and their availability
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Boat
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, make, or model..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value: BoatType | 'all') => {
            setTypeFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="SAILBOAT">Sailboat</SelectItem>
            <SelectItem value="CATAMARAN">Catamaran</SelectItem>
            <SelectItem value="MOTOR_YACHT">Motor Yacht</SelectItem>
            <SelectItem value="GULET">Gulet</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value: BoatStatus | 'all') => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={BoatStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={BoatStatus.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={BoatStatus.MAINTENANCE}>Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boat</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading boats...
                </TableCell>
              </TableRow>
            ) : boats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No boats found
                </TableCell>
              </TableRow>
            ) : (
              boats.map((boat) => (
                <TableRow key={boat.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Ship className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{boat.name[locale] || boat.name.en}</div>
                        <div className="text-sm text-muted-foreground">
                          {boat.make} {boat.model}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(boat.type)}>
                      {boat.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(boat.status)}>
                      {boat.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-3 w-3 text-muted-foreground" />
                        <span>{boat.length}m</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{boat.capacity} guests</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{boat.location.city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{boat.priceUSD.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(boat)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(boat)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(boat)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({totalBoats} total boats)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Boat Details</DialogTitle>
            <DialogDescription>
              Complete information about this boat
            </DialogDescription>
          </DialogHeader>
          {selectedBoat && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedBoat.name[locale] || selectedBoat.name.en}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedBoat.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium">{selectedBoat.status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Make & Model</Label>
                  <p className="font-medium">{selectedBoat.make} {selectedBoat.model}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Year</Label>
                  <p className="font-medium">{selectedBoat.year}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Length</Label>
                  <p className="font-medium">{selectedBoat.length}m</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Capacity</Label>
                  <p className="font-medium">{selectedBoat.capacity} guests</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cabins</Label>
                  <p className="font-medium">{selectedBoat.cabins}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Bathrooms</Label>
                  <p className="font-medium">{selectedBoat.bathrooms}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedBoat.location.city}, {selectedBoat.location.country}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedBoat.description[locale] || selectedBoat.description.en}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Price (USD)</Label>
                  <p className="font-medium">${selectedBoat.priceUSD.toLocaleString()}/day</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price (EUR)</Label>
                  <p className="font-medium">€{selectedBoat.priceEUR?.toLocaleString()}/day</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price (GBP)</Label>
                  <p className="font-medium">£{selectedBoat.priceGBP?.toLocaleString()}/day</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price (BRL)</Label>
                  <p className="font-medium">R${selectedBoat.priceBRL?.toLocaleString()}/day</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Boat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this boat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBoat && (
            <div className="rounded-md bg-muted p-4">
              <p className="font-medium">{selectedBoat.name[locale] || selectedBoat.name.en}</p>
              <p className="text-sm text-muted-foreground">
                {selectedBoat.make} {selectedBoat.model} - {selectedBoat.type}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isEditOpen || isCreateOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        setIsCreateOpen(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBoat ? 'Edit Boat' : 'Create New Boat'}</DialogTitle>
            <DialogDescription>
              {selectedBoat ? 'Update boat information' : 'Add a new boat to your fleet'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <h3 className="font-medium">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name-en">Name (English)</Label>
                  <Input
                    id="name-en"
                    value={formData.name.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: { ...formData.name, en: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="boat-name-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: BoatType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAILBOAT">Sailboat</SelectItem>
                      <SelectItem value="CATAMARAN">Catamaran</SelectItem>
                      <SelectItem value="MOTOR_YACHT">Motor Yacht</SelectItem>
                      <SelectItem value="GULET">Gulet</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: BoatStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BoatStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={BoatStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={BoatStatus.MAINTENANCE}>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <h3 className="font-medium">Specifications</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="cabins">Cabins</Label>
                  <Input
                    id="cabins"
                    type="number"
                    value={formData.cabins}
                    onChange={(e) => setFormData({ ...formData, cabins: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <h3 className="font-medium">Pricing (per day)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="priceUSD">USD</Label>
                  <Input
                    id="priceUSD"
                    type="number"
                    step="0.01"
                    value={formData.priceUSD}
                    onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="priceEUR">EUR</Label>
                  <Input
                    id="priceEUR"
                    type="number"
                    step="0.01"
                    value={formData.priceEUR}
                    onChange={(e) => setFormData({ ...formData, priceEUR: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="priceGBP">GBP</Label>
                  <Input
                    id="priceGBP"
                    type="number"
                    step="0.01"
                    value={formData.priceGBP}
                    onChange={(e) => setFormData({ ...formData, priceGBP: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="priceBRL">BRL</Label>
                  <Input
                    id="priceBRL"
                    type="number"
                    step="0.01"
                    value={formData.priceBRL}
                    onChange={(e) => setFormData({ ...formData, priceBRL: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <h3 className="font-medium">Descriptions</h3>
              <div>
                <Label htmlFor="desc-en">Description (English)</Label>
                <Textarea
                  id="desc-en"
                  value={formData.description.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    description: { ...formData.description, en: e.target.value }
                  })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="short-desc-en">Short Description (English)</Label>
                <Textarea
                  id="short-desc-en"
                  value={formData.shortDescription.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    shortDescription: { ...formData.shortDescription, en: e.target.value }
                  })}
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditOpen(false);
              setIsCreateOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedBoat ? 'Update' : 'Create'} Boat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
