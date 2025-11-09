'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Calendar, Anchor, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';
import { BookingService } from '@/lib/api/services/booking.service';
import { BoatService } from '@/lib/api/services/boat.service';
import { LocationService } from '@/lib/api/services/location.service';
import { Skeleton } from '@/components/ui/skeleton';
import type { BookingResponse } from '@/types/api';
import { BoatStatus } from '@/types';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

function StatsCard({ title, value, icon: Icon, iconColor, iconBg, trend, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export function DashboardStats() {
  // Fetch all bookings for statistics
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['dashboard-bookings'],
    queryFn: () => BookingService.getAll(),
  });

  // Fetch all boats for statistics
  const { data: boatsData, isLoading: boatsLoading } = useQuery({
    queryKey: ['dashboard-boats'],
    queryFn: () => BoatService.getAll({ status: BoatStatus.ACTIVE }),
  });

  // Fetch all locations for statistics
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['dashboard-locations'],
    queryFn: () => LocationService.getAll(),
  });

  // Calculate statistics
  const stats = {
    totalBookings: bookingsData?.length || 0,
    pendingBookings: bookingsData?.filter(b => b.status === 'PENDING').length || 0,
    confirmedBookings: bookingsData?.filter(b => b.status === 'CONFIRMED').length || 0,
    activeBoats: boatsData?.length || 0,
    totalLocations: locationsData?.length || 0,
    totalRevenue: bookingsData?.reduce((sum, booking) => {
      if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
        return sum + (booking.totalPrice || 0);
      }
      return sum;
    }, 0) || 0,
    // Calculate unique customers (using email as unique identifier)
    uniqueCustomers: new Set(bookingsData?.map(b => b.customer?.email).filter(Boolean)).size || 0,
  };

  // Calculate trend for bookings (last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentBookings = bookingsData?.filter(b =>
    new Date(b.createdAt) >= thirtyDaysAgo
  ).length || 0;

  const previousBookings = bookingsData?.filter(b => {
    const created = new Date(b.createdAt);
    return created >= sixtyDaysAgo && created < thirtyDaysAgo;
  }).length || 0;

  const bookingsTrend = previousBookings > 0
    ? Math.round(((recentBookings - previousBookings) / previousBookings) * 100)
    : recentBookings > 0 ? 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isLoading = bookingsLoading || boatsLoading || locationsLoading;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Bookings"
        value={stats.totalBookings}
        icon={Calendar}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        trend={{
          value: `${bookingsTrend > 0 ? '+' : ''}${bookingsTrend}%`,
          isPositive: bookingsTrend >= 0,
        }}
        isLoading={isLoading}
      />

      <StatsCard
        title="Active Boats"
        value={stats.activeBoats}
        icon={Anchor}
        iconColor="text-green-600"
        iconBg="bg-green-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Locations"
        value={stats.totalLocations}
        icon={MapPin}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Customers"
        value={stats.uniqueCustomers}
        icon={Users}
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={DollarSign}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Pending Bookings"
        value={stats.pendingBookings}
        icon={Calendar}
        iconColor="text-yellow-600"
        iconBg="bg-yellow-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Confirmed Bookings"
        value={stats.confirmedBookings}
        icon={Calendar}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        isLoading={isLoading}
      />
    </div>
  );
}
