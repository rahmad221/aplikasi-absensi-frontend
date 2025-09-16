// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Jika tidak ada data user (belum login), redirect ke halaman login
      router.push('/');
    }
  }, [router]);
  
  const handleLogout = () => {
    // Hapus data dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Arahkan ke halaman login
    router.push('/');
  };

  // Tampilkan loading jika data user belum termuat
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Selamat Datang,</p>
        <h2 className="text-3xl font-bold text-blue-600 mt-1">{user.nama}</h2>
        <hr className="my-4"/>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>NIK:</strong> {user.nik}</p>
          <p><strong>No. HP:</strong> {user.no_hp}</p>
        </div>
      </div>

      {/* Placeholder untuk fitur lain */}
      <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Menu Cepat</h3>
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="font-bold text-blue-800">Absen Masuk</p>
              </div>
               <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="font-bold text-green-800">Lihat Laporan</p>
              </div>
          </div>
      </div>
    </AuthenticatedLayout>
  );
}