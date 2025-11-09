'use client';

import { BookingsTable } from '@/components/admin/BookingsTable';

export default function BookingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-500 mt-2">
          Manage boat bookings and reservations
        </p>
      </div>

      <BookingsTable />
    </div>
  );
}
