// src/components/AuthenticatedLayout.js
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from './icons/HomeIcon';
import CameraIcon from './icons/CameraIcon';
import DocumentIcon from './icons/DocumentIcon';

export default function AuthenticatedLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { href: '/absensi', icon: CameraIcon, label: 'Absensi' },
    { href: '/laporan', icon: DocumentIcon, label: 'Laporan' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="md:max-w-md md:mx-auto md:min-h-screen md:bg-slate-50 md:shadow-lg flex flex-col">
        {/* Konten Utama */}
        <main className="flex-grow p-6 pb-24">
          {children}
        </main>

        {/* Navbar Bawah */}
        <nav className="fixed bottom-0 left-0 right-0 md:max-w-md md:mx-auto bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-full transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                  <Icon className="w-7 h-7" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}