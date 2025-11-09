'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { CustomerService } from '@/lib/api/services/customer.service';
import type { BookingResponse, CustomerWithStatsResponse } from '@/types/api';
import { User, Mail, Phone, Globe, Eye, Calendar, Anchor, CheckCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { format } from 'date-fns';

/**
 * Optimized customers table with server-side pagination and search.
 * Uses backend aggregation for statistics to handle large datasets efficiently.
 */
export function CustomersTable() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithStatsResponse | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;

  // Fetch paginated customers with statistics
  const { data: customersData, isLoading, error } = useQuery({
    queryKey: ['customers', page, searchQuery],
    queryFn: () => CustomerService.getCustomers({
      search: searchQuery,
      page,
      size: pageSize,
      sortBy: 'lastBookingDate',
      direction: 'DESC',
    }),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  // Fetch customer bookings when viewing details
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['customer-bookings', selectedCustomer?.id],
    queryFn: () => selectedCustomer ? CustomerService.getCustomerBookings(selectedCustomer.id) : Promise.resolve(null),
    enabled: selectedCustomer !== null,
  });

  const handleViewDetails = (customer: CustomerWithStatsResponse) => {
    setSelectedCustomer(customer);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(0); // Reset to first page on new search
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
        <AlertDescription>Failed to load customers. Please try again.</AlertDescription>
      </Alert>
    );
  }

  const customers = customersData?.content ?? [];
  const totalCustomers = customersData?.page?.totalElements ?? 0;
  const totalPages = customersData?.page?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers Management</h2>
          <p className="text-gray-500 mt-1">View customer information and booking history</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Customers: <span className="font-semibold">{totalCustomers}</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Booking</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.fullName}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{customer.email}</span>
                        </div>
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{customer.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline" className="text-xs">
                          {customer.preferredLanguage.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{customer.bookingCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('pt-PT', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(customer.totalSpent)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {customer.lastBookingDate ? format(new Date(customer.lastBookingDate), 'MMM dd, yyyy') : 'No bookings'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(customer)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No customers found. Customers will appear here after they make bookings.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      <Dialog open={selectedCustomer !== null} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information and booking history
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-gray-900">{selectedCustomer.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  {selectedCustomer.phoneNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-gray-900">{selectedCustomer.phoneNumber}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Preferred Language</label>
                    <p className="mt-1">
                      <Badge variant="outline">{selectedCustomer.preferredLanguage.toUpperCase()}</Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Bookings</label>
                    <p className="mt-1 text-gray-900 font-semibold">{selectedCustomer.bookingCount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Spent</label>
                    <p className="mt-1 text-gray-900 font-semibold">
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
                {bookingsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : bookingsData && bookingsData.content.length > 0 ? (
                  <div className="space-y-3">
                    {bookingsData.content.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Icon */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {booking.bookingReference}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Anchor className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {booking.boat?.nameI18n?.en || 'Boat'}
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={
                              booking.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : booking.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : booking.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }
                            variant="outline"
                          >
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 opacity-50" />
                            <span>
                              {format(new Date(booking.startDatetime), 'MMM dd')} -{' '}
                              {format(new Date(booking.endDatetime), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {new Intl.NumberFormat('pt-PT', {
                                style: 'currency',
                                currency: 'EUR',
                              }).format(booking.totalPrice)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({booking.daysCount} days)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No bookings found for this customer.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
