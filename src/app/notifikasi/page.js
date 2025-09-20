"use client";
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { FiBell } from 'react-icons/fi'; // Icon untuk notifikasi

// Mock data untuk notifikasi. Di aplikasi nyata, ini akan berasal dari API.
const notifications = [
    { id: 1, title: 'Pengajuan Cuti Anda telah disetujui', time: '15 menit lalu', read: false },
    { id: 2, title: 'Slip Gaji untuk bulan Agustus telah tersedia', time: '2 jam lalu', read: false },
    { id: 3, title: 'Selamat! Klaim asuransi Anda berhasil diproses.', time: '1 hari lalu', read: true },
    { id: 4, title: 'Pembaruan Kebijakan Perusahaan', time: '3 hari lalu', read: true },
    { id: 5, title: 'Pengingat: Rapat tim mingguan besok pukul 10:00', time: '4 hari lalu', read: true },
];

export default function NotifikasiPage() {
  return (
    <AuthenticatedLayout>
      {/* Container utama dengan background, mobile-first */}
      <div className="min-h-screen bg-gray-50">
        
        {/* Header Halaman yang menempel di atas */}
        <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
            <h1 className="text-xl font-bold text-gray-800 text-center">Notifikasi</h1>
        </header>

        {/* Daftar Notifikasi */}
        <main className="p-4">
            <div className="w-full max-w-2xl mx-auto">
                {notifications.length > 0 ? (
                    <ul className="space-y-3">
                        {notifications.map(notif => (
                            <li 
                                key={notif.id} 
                                className={`p-4 rounded-lg flex items-start space-x-4 transition-colors ${
                                    notif.read 
                                    ? 'bg-white shadow-sm' 
                                    : 'bg-purple-50 border border-purple-200'
                                }`}
                            >
                                
                                {/* Ikon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                    notif.read ? 'bg-gray-100' : 'bg-purple-100'
                                }`}>
                                    <FiBell className={`${notif.read ? 'text-gray-400' : 'text-purple-600'}`} />
                                </div>
                                
                                {/* Konten Notifikasi */}
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                </div>

                                {/* Indikator Belum Dibaca */}
                                {!notif.read && (
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-20">
                        <FiBell className="mx-auto text-4xl text-gray-300" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-700">Tidak Ada Notifikasi</h2>
                        <p className="mt-1 text-sm text-gray-500">Semua notifikasi Anda akan muncul di sini.</p>
                    </div>
                )}
            </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}

