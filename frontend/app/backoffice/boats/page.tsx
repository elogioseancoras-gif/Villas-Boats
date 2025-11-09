'use client';

import { BoatsTable } from '@/components/admin/BoatsTable';

export default function BoatsPage() {
  return (
    <div className="p-8">
      <BoatsTable locale="en" />
    </div>
  );
}
