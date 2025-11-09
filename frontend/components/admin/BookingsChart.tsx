'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingService } from '@/lib/api/services/booking.service';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DayData {
  date: Date;
  label: string;
  bookings: number;
}

export function BookingsChart() {
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['chart-bookings'],
    queryFn: () => BookingService.getAll(),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  // Prepare data for last 7 days
  const days: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    days.push({
      date,
      label: format(date, 'EEE'),
      bookings: 0,
    });
  }

  // Count bookings by day
  bookingsData?.forEach((booking) => {
    const bookingDate = startOfDay(new Date(booking.createdAt));
    const dayData = days.find((d) =>
      startOfDay(d.date).getTime() === bookingDate.getTime()
    );
    if (dayData) {
      dayData.bookings++;
    }
  });

  // Calculate max for scaling
  const maxBookings = Math.max(...days.map((d) => d.bookings), 1);

  // Calculate trend
  const recentBookings = days.slice(4, 7).reduce((sum, d) => sum + d.bookings, 0);
  const olderBookings = days.slice(0, 3).reduce((sum, d) => sum + d.bookings, 0);
  const trend = olderBookings > 0
    ? Math.round(((recentBookings - olderBookings) / olderBookings) * 100)
    : recentBookings > 0 ? 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bookings Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Last 7 days activity</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
          trend >= 0
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between gap-3 h-64">
        {days.map((day, index) => {
          const height = maxBookings > 0
            ? (day.bookings / maxBookings) * 100
            : 0;
          const isToday = index === days.length - 1;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="w-full flex flex-col justify-end items-center h-56">
                <div
                  className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                    isToday
                      ? 'bg-blue-500'
                      : 'bg-blue-200'
                  }`}
                  style={{
                    height: `${height}%`,
                    minHeight: day.bookings > 0 ? '8px' : '0px',
                  }}
                  title={`${day.bookings} booking${day.bookings !== 1 ? 's' : ''}`}
                />
                {/* Value label */}
                {day.bookings > 0 && (
                  <div className="mt-2 text-sm font-semibold text-gray-900">
                    {day.bookings}
                  </div>
                )}
              </div>

              {/* Day label */}
              <div className={`text-xs font-medium ${
                isToday ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {day.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {days.reduce((sum, d) => sum + d.bookings, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average/Day</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(days.reduce((sum, d) => sum + d.bookings, 0) / 7)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peak Day</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(...days.map((d) => d.bookings))}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
