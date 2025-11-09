'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingService } from '@/lib/api/services/booking.service';
import { format } from 'date-fns';
import { Calendar, User, Anchor, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import type { BookingStatus } from '@/types/api';

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

export function RecentBookings() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: () =>
      BookingService.getPage({
        page: 0,
        size: 5,
        sort: 'createdAt,desc',
      }),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-6">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const bookings = data?.content || [];

  if (bookings.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Bookings</h2>
        <p className="text-gray-500 mb-6">Latest booking activity</p>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No bookings yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          <p className="text-gray-500 text-sm mt-1">Latest booking activity</p>
        </div>
        <Link href="/backoffice/bookings">
          <Button variant="ghost" size="sm" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-900">
                  {booking.bookingReference}
                </p>
                <Badge className={statusColors[booking.status]} variant="outline">
                  {statusLabels[booking.status]}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 opacity-50" />
                  <span>{booking.customer?.fullName || booking.customer?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Anchor className="h-4 w-4 opacity-50" />
                  <span>{booking.boat?.nameI18n?.en || 'Boat name'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-50" />
                  <span>
                    {format(new Date(booking.startDatetime), 'MMM dd')} -{' '}
                    {format(new Date(booking.endDatetime), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(booking.totalPrice || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(booking.createdAt), 'MMM dd, HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {data && data.page.totalElements > 5 && (
        <div className="mt-4 pt-4 border-t text-center">
          <Link href="/backoffice/bookings">
            <Button variant="outline" className="w-full">
              View All {data.page.totalElements} Bookings
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
