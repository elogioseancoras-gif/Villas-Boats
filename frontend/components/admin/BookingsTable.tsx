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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookingService } from '@/lib/api/services/booking.service';
import type { BookingResponse, BookingStatus } from '@/types/api';
import { format } from 'date-fns';
import { Search, Eye, Check, X, Loader2 } from 'lucide-react';

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export function BookingsTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch bookings
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', page, statusFilter],
    queryFn: () =>
      BookingService.getPage({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page,
        size: 10,
        sort: 'createdAt,desc',
      }),
  });

  // Confirm booking mutation
  const confirmMutation = useMutation({
    mutationFn: (bookingId: string) => BookingService.confirm(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSuccessMessage('Booking confirmed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedBooking(null);
    },
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => BookingService.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSuccessMessage('Booking cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedBooking(null);
    },
  });

  // Update admin notes mutation
  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      BookingService.update(id, { adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSuccessMessage('Admin notes updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
  });

  const handleViewDetails = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.adminNotes || '');
  };

  const handleConfirm = () => {
    if (selectedBooking) {
      confirmMutation.mutate(selectedBooking.id);
    }
  };

  const handleCancel = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking.id);
    }
  };

  const handleUpdateNotes = () => {
    if (selectedBooking) {
      updateNotesMutation.mutate({
        id: selectedBooking.id,
        notes: adminNotes,
      });
    }
  };

  const filteredData = data?.content.filter((booking) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      booking.bookingReference.toLowerCase().includes(term) ||
      booking.customer.fullName.toLowerCase().includes(term) ||
      booking.customer.email.toLowerCase().includes(term)
    );
  });

  const totalPages = data?.page?.totalPages || 0;

  return (
    <div className="space-y-4">
      {/* Success Alert */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by reference or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus | 'ALL')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            Failed to load bookings. Please try again.
          </AlertDescription>
        </Alert>
      ) : filteredData && filteredData.length > 0 ? (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Boat</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingReference}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer.fullName}</div>
                        <div className="text-sm text-gray-500">{booking.customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.boat.nameI18n?.en || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(booking.startDatetime), 'MMM dd, yyyy')}</div>
                        <div className="text-gray-500">
                          to {format(new Date(booking.endDatetime), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.guestCount}</TableCell>
                    <TableCell>
                      {booking.currency} {booking.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[booking.status]}>
                        {statusLabels[booking.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(0, page - 1))}
                    className={page === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.floor(page / 5) * 5 + i;
                  if (pageNum >= totalPages) return null;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No bookings found matching your search.' : 'No bookings found.'}
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Reference: {selectedBooking?.bookingReference}</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="outline" className={statusColors[selectedBooking.status]}>
                  {statusLabels[selectedBooking.status]}
                </Badge>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium">{selectedBooking.customer.fullName}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium">{selectedBooking.customer.email}</div>
                  </div>
                  {selectedBooking.customer.phoneNumber && (
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <div className="font-medium">{selectedBooking.customer.phoneNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Boat Info */}
              <div>
                <h3 className="font-semibold mb-2">Boat Information</h3>
                <div className="text-sm">
                  <span className="text-gray-500">Boat:</span>
                  <div className="font-medium">{selectedBooking.boat.nameI18n?.en || 'N/A'}</div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start Date:</span>
                    <div className="font-medium">
                      {format(new Date(selectedBooking.startDatetime), 'PPP')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">End Date:</span>
                    <div className="font-medium">
                      {format(new Date(selectedBooking.endDatetime), 'PPP')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Days:</span>
                    <div className="font-medium">{selectedBooking.daysCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Guests:</span>
                    <div className="font-medium">{selectedBooking.guestCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Captain:</span>
                    <div className="font-medium">{selectedBooking.needsCaptain ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Boat ({selectedBooking.daysCount} days):</span>
                    <span>
                      {selectedBooking.currency}{' '}
                      {(selectedBooking.boatPricePerDay * selectedBooking.daysCount).toFixed(2)}
                    </span>
                  </div>
                  {selectedBooking.needsCaptain && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Captain ({selectedBooking.daysCount} days):</span>
                      <span>
                        {selectedBooking.currency}{' '}
                        {(selectedBooking.captainPricePerDay * selectedBooking.daysCount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {selectedBooking.extrasTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Extras:</span>
                      <span>
                        {selectedBooking.currency} {selectedBooking.extrasTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span>
                      {selectedBooking.currency} {selectedBooking.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax ({selectedBooking.taxPercentage}%):</span>
                    <span>
                      {selectedBooking.currency} {selectedBooking.taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>
                      {selectedBooking.currency} {selectedBooking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedBooking.customerNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Customer Notes</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.customerNotes}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <h3 className="font-semibold mb-2">Admin Notes</h3>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this booking..."
                  rows={3}
                />
                <Button
                  onClick={handleUpdateNotes}
                  disabled={updateNotesMutation.isPending}
                  className="mt-2"
                  size="sm"
                >
                  {updateNotesMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Notes'
                  )}
                </Button>
              </div>

              {/* Actions */}
              {selectedBooking.status === 'PENDING' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={handleConfirm}
                    disabled={confirmMutation.isPending}
                    className="flex-1"
                  >
                    {confirmMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    {cancelMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </>
                    )}
                  </Button>
                </div>
              )}

              {selectedBooking.status === 'CONFIRMED' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    {cancelMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
