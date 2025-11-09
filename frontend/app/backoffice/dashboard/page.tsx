'use client';

import { DashboardStats } from '@/components/admin/DashboardStats';
import { BookingsChart } from '@/components/admin/BookingsChart';
import { RecentBookings } from '@/components/admin/RecentBookings';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Overview of your boat rental business
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts and Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings Chart */}
        <BookingsChart />

        {/* Recent Bookings */}
        <RecentBookings />
      </div>
    </div>
  );
}
