'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationService } from '@/lib/api/services/location.service';
import type { LocationResponse, CreateLocationRequest, UpdateLocationRequest } from '@/types/api';
import { Plus, Edit, Trash2, MapPin, Globe, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface LocationFormData {
  country: string;
  city: string;
  region: string;
  latitude: string;
  longitude: string;
  nameEn: string;
  descriptionEn: string;
  imageUrl: string;
  isActive: boolean;
}

export function LocationsTable() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationResponse | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<LocationResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<LocationFormData>({
    country: '',
    city: '',
    region: '',
    latitude: '',
    longitude: '',
    nameEn: '',
    descriptionEn: '',
    imageUrl: '',
    isActive: true,
  });

  // Fetch locations
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: () => LocationService.getAll(),
  });

  // Create location mutation
  const createMutation = useMutation({
    mutationFn: (request: CreateLocationRequest) => LocationService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSuccessMessage('Location created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsCreateModalOpen(false);
      resetForm();
    },
  });

  // Update location mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateLocationRequest }) =>
      LocationService.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSuccessMessage('Location updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingLocation(null);
      resetForm();
    },
  });

  // Delete location mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => LocationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSuccessMessage('Location deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setDeletingLocation(null);
    },
  });

  const resetForm = () => {
    setFormData({
      country: '',
      city: '',
      region: '',
      latitude: '',
      longitude: '',
      nameEn: '',
      descriptionEn: '',
      imageUrl: '',
      isActive: true,
    });
  };

  const handleCreate = () => {
    const request: CreateLocationRequest = {
      country: formData.country,
      city: formData.city,
      region: formData.region || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      nameI18n: formData.nameEn ? { en: formData.nameEn } : undefined,
      descriptionI18n: formData.descriptionEn ? { en: formData.descriptionEn } : undefined,
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive,
    };
    createMutation.mutate(request);
  };

  const handleEdit = (location: LocationResponse) => {
    setEditingLocation(location);
    setFormData({
      country: location.country,
      city: location.city,
      region: location.region || '',
      latitude: location.latitude?.toString() || '',
      longitude: location.longitude?.toString() || '',
      nameEn: location.nameI18n?.en || '',
      descriptionEn: location.descriptionI18n?.en || '',
      imageUrl: location.imageUrl || '',
      isActive: location.isActive,
    });
  };

  const handleUpdate = () => {
    if (!editingLocation) return;

    const request: UpdateLocationRequest = {
      country: formData.country,
      city: formData.city,
      region: formData.region || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      nameI18n: formData.nameEn ? { en: formData.nameEn } : undefined,
      descriptionI18n: formData.descriptionEn ? { en: formData.descriptionEn } : undefined,
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive,
    };
    updateMutation.mutate({ id: editingLocation.id, request });
  };

  const handleDelete = () => {
    if (!deletingLocation) return;
    deleteMutation.mutate(deletingLocation.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load locations. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Locations Management</h2>
          <p className="text-gray-500 mt-1">Manage boat rental locations</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations && locations.length > 0 ? (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {location.nameI18n?.en || `${location.city}, ${location.country}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {location.city}
                          {location.region && `, ${location.region}`}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span>{location.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {location.latitude && location.longitude ? (
                      <span className="text-sm text-gray-600">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        location.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    >
                      {location.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(location.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(location)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingLocation(location)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No locations found. Add your first location to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || editingLocation !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingLocation(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation
                ? 'Update the location information below.'
                : 'Fill in the details to create a new location.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Portugal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Lisbon"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Optional region or state"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="38.7223"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="-9.1393"
                />
              </div>
            </div>

            {/* I18n Fields */}
            <div className="space-y-2">
              <Label htmlFor="nameEn">Display Name (English)</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Lisbon Marina"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Description (English)</Label>
              <Input
                id="descriptionEn"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Beautiful marina in the heart of Lisbon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (visible to customers)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingLocation(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingLocation ? handleUpdate : handleCreate}
              disabled={
                !formData.country ||
                !formData.city ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingLocation ? 'Update Location' : 'Create Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deletingLocation !== null} onOpenChange={() => setDeletingLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                {deletingLocation?.nameI18n?.en ||
                  `${deletingLocation?.city}, ${deletingLocation?.country}`}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingLocation(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
