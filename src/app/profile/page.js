// src/app/profile/page.js
"use client";
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
        <p className="mt-4 text-gray-600">Informasi profil akan ditampilkan di sini.</p>
      </div>
    </AuthenticatedLayout>
  );
}