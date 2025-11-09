'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Anchor,
  MapPin,
  Users,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  {
    title: 'Dashboard',
    href: '/backoffice/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    href: '/backoffice/bookings',
    icon: Calendar,
  },
  {
    title: 'Boats',
    href: '/backoffice/boats',
    icon: Anchor,
  },
  {
    title: 'Locations',
    href: '/backoffice/locations',
    icon: MapPin,
  },
  {
    title: 'Customers',
    href: '/backoffice/customers',
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = '/backoffice/login';
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      {/* Logo/Brand */}
      <div className="p-6">
        <Link href="/backoffice/dashboard" className="flex items-center gap-2">
          <Anchor className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Villas Boats</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
