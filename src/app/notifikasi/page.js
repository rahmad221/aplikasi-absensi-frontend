// src/app/notifikasi/page.js
"use client";
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
export default function NotifikasiPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
        <p className="mt-4 text-gray-600">Anda belum memiliki notifikasi baru.</p>
      </div>
    </AuthenticatedLayout>
  );
}