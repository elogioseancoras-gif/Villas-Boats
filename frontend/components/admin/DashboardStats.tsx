'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Calendar, Anchor, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';
import { AdminStatsService } from '@/lib/api/services/admin-stats.service';
import { Skeleton } from '@/components/ui/skeleton';

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

/**
 * Optimized dashboard statistics component using server-side aggregation.
 * Fetches pre-calculated statistics from backend to minimize network payload
 * and improve performance for large datasets.
 */
export function DashboardStats() {
  // Fetch aggregated statistics from backend
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => AdminStatsService.getStatistics(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const bookingsTrend = stats?.bookingsTrend?.percentChange ?? 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Bookings"
        value={stats?.totalBookings ?? 0}
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
        value={stats?.activeBoats ?? 0}
        icon={Anchor}
        iconColor="text-green-600"
        iconBg="bg-green-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Locations"
        value={stats?.totalLocations ?? 0}
        icon={MapPin}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Customers"
        value={stats?.uniqueCustomers ?? 0}
        icon={Users}
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats?.totalRevenue ?? 0)}
        icon={DollarSign}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Pending Bookings"
        value={stats?.pendingBookings ?? 0}
        icon={Calendar}
        iconColor="text-yellow-600"
        iconBg="bg-yellow-50"
        isLoading={isLoading}
      />

      <StatsCard
        title="Confirmed Bookings"
        value={stats?.confirmedBookings ?? 0}
        icon={Calendar}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        isLoading={isLoading}
      />
    </div>
  );
}
