'use client';

import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function LocationsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Locations Management</h1>
        <p className="text-gray-500 mt-2">
          Manage boat pickup and dropoff locations
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Locations Management Coming Soon
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Locations data table with CRUD operations will be implemented in Phase 5
          </p>
        </div>
      </Card>
    </div>
  );
}
