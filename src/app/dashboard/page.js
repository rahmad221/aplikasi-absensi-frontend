// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import GrafikKaryawan from '../../components/GrafikKaryawan';
import Swal from 'sweetalert2'; // Opsional: Instal dengan 'npm install sweetalert2'
import { 
  FiFileText, FiClock, FiActivity, FiCheckSquare, 
  FiCalendar, FiDollarSign, FiUser, FiHelpCircle 
} from 'react-icons/fi';

const menuItems = [
  { label: 'Slip Gaji', icon: <FiFileText size={28} className="text-purple-600" />, href: '/slip-gaji', isReady: false },
  { label: 'Lembur', icon: <FiClock size={28} className="text-blue-500" />, href: '/lembur', isReady: false },
  { label: 'Riwayat', icon: <FiActivity size={28} className="text-green-500" />, href: '/riwayat', isReady: false },
  { label: 'Absensi', icon: <FiCheckSquare size={28} className="text-red-500" />, href: '/absensi', isReady: true },
  { label: 'Cuti', icon: <FiCalendar size={28} className="text-yellow-500" />, href: '/cuti', isReady: false },
  { label: 'Klaim', icon: <FiDollarSign size={28} className="text-indigo-500" />, href: '/klaim', isReady: false },
  { label: 'Data Diri', icon: <FiUser size={28} className="text-pink-500" />, href: '/profile', isReady: true },
  { label: 'Bantuan', icon: <FiHelpCircle size={28} className="text-gray-500" />, href: '/bantuan', isReady: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/');
    }
  }, [router]);

  // Fungsi untuk menangani klik menu
  const handleMenuClick = (item) => {
    if (!item.isReady) {
      // Menggunakan SweetAlert2 agar lebih cantik, atau cukup alert() biasa
      Swal.fire({
        title: 'Sabar ya!',
        text: `Fitur ${item.label} masih dalam tahap pengembangan.`,
        icon: 'info',
        confirmButtonColor: '#7e22ce', // Warna ungu sesuai tema Anda
        confirmButtonText: 'Oke'
      });
      return;
    }
    router.push(item.href);
  };

  if (!user) return null;

  const dataKaryawan = user.karyawan || {};

  return (
    <AuthenticatedLayout>
      {/* 1. Judul "Dashboard" yang terpisah dihapus dari sini */}
      
      {/* 2. Header dibuat agar menempel di atas tanpa lengkungan atas */}
      <header className="bg-gradient-to-b from-purple-700 to-purple-800 p-6 rounded-b-[40px]">
        <div className="flex items-center space-x-4">
          {/* ↓↓↓ UBAH BAGIAN INI ↓↓↓ */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
            <img
              src={user.imageUrl || 'https://i.pravatar.cc/150'}  // Pastikan path gambar Anda benar
              alt={user.name}
              layout="fill" // Ini akan membuat gambar mengisi penuh wadah
              objectFit="cover" // Ini akan memastikan gambar menutupi area tanpa distorsi, bisa saja terpotong sedikit
              className="rounded-full" // Tetap berikan rounded-full pada gambar itu sendiri
            />
          </div>
          {/* ↑↑↑ AKHIR BAGIAN PERUBAHAN ↑↑↑ */}

          <div>
            <h1 className="text-xl font-bold text-white">{dataKaryawan.name || user.name}</h1> 
            <p className="text-sm text-purple-200">NIK: {dataKaryawan.nik || user.nik} | {user.email || 'Email'}</p>
          </div>
        </div>
      </header>

      {/* 3. Semua konten lain masuk ke dalam <main> */}
      <main className="p-0 -mt-4"> 
        {/* Atur ulang padding main menjadi 0 karena konten di dalamnya sudah punya margin/padding sendiri */}
        <div className="px-4"> {/* Tambahkan padding horizontal di sini */}
          {/* Grid Menu HR */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {menuItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => handleMenuClick(item)}
                className="flex flex-col items-center p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all outline-none"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-purple-50 rounded-full mb-2">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold text-center text-gray-600 leading-tight">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Bagian Info & Promo */}
          <div className="mb-6"> {/* Beri margin-bottom agar tidak terlalu dekat dengan grafik */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Info dan Promo</h2>
              <a href="#" className="text-sm font-semibold text-purple-600">Lihat Semua</a>
            </div>
            <div className="bg-purple-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg">
              <div>
                <h3 className="font-bold text-lg">Klaim Asuransi Mudah</h3>
                <p className="text-xs text-purple-200">Diskon premi 30%</p>
              </div>
              <div className="w-20 h-20 bg-purple-500 rounded-lg flex items-center justify-center">
                <FiDollarSign size={40} className="text-white opacity-70" />
              </div>
            </div>
          </div>
        </div>
        {/* Komponen grafik tetap di dalam main, tapi di luar container padding */}
        <div className="bg-white p-4 rounded-lg shadow-md mx-6 mb-6">
          <GrafikKaryawan />
        </div>
      </main>
    </AuthenticatedLayout>
  );
}