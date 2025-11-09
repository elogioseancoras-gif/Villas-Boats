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
import { BookingService } from '@/lib/api/services/booking.service';
import type { BookingResponse, CustomerResponse } from '@/types/api';
import { User, Mail, Phone, Globe, Eye, Calendar, Anchor, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerWithBookings extends CustomerResponse {
  bookingCount: number;
  totalSpent: number;
  lastBookingDate: string;
}

export function CustomersTable() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithBookings | null>(null);
  const [customerBookings, setCustomerBookings] = useState<BookingResponse[]>([]);

  // Fetch all bookings to extract unique customers
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['all-bookings-for-customers'],
    queryFn: () => BookingService.getAll(),
  });

  // Extract unique customers from bookings
  const customers: CustomerWithBookings[] = bookings
    ? Object.values(
        bookings.reduce((acc, booking) => {
          const customerId = booking.customer.id;
          if (!acc[customerId]) {
            acc[customerId] = {
              ...booking.customer,
              bookingCount: 0,
              totalSpent: 0,
              lastBookingDate: booking.createdAt,
            };
          }
          acc[customerId].bookingCount += 1;
          acc[customerId].totalSpent += booking.totalPrice;
          if (new Date(booking.createdAt) > new Date(acc[customerId].lastBookingDate)) {
            acc[customerId].lastBookingDate = booking.createdAt;
          }
          return acc;
        }, {} as Record<string, CustomerWithBookings>)
      )
    : [];

  const handleViewDetails = (customer: CustomerWithBookings) => {
    setSelectedCustomer(customer);
    // Filter bookings for this customer
    const customerBookingList = bookings?.filter(
      (b) => b.customer.id === customer.id
    ) || [];
    setCustomerBookings(customerBookingList);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers Management</h2>
          <p className="text-gray-500 mt-1">View customer information and booking history</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Customers: <span className="font-semibold">{customers.length}</span>
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
              customers
                .sort((a, b) => new Date(b.lastBookingDate).getTime() - new Date(a.lastBookingDate).getTime())
                .map((customer) => (
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
                      {format(new Date(customer.lastBookingDate), 'MMM dd, yyyy')}
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
                <div className="space-y-3">
                  {customerBookings.map((booking) => (
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
