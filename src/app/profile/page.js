"use client";
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiKey, FiBell, FiLogOut, FiChevronRight } from 'react-icons/fi';

const profileMenuItems = [
    { label: 'Edit Profile', icon: <FiUser className="text-gray-500" />, href: '/profile/edit' },
    { label: 'Ubah Kata Sandi', icon: <FiKey className="text-gray-500" />, href: '/profile/change-password' },
    { label: 'Notifikasi', icon: <FiBell className="text-gray-500" />, href: '/notifikasi' },
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Mengambil data user dari localStorage
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      setUser(JSON.parse(userDataString));
    } else {
      // Jika tidak ada data user, kembali ke halaman login
      // Anda bisa juga memasukkan mock data di sini untuk development
      // setUser({ nama: 'Budi Santoso', email: 'budi.santoso@example.com', imageUrl: 'https://i.pravatar.cc/150' });
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  // Tampilkan loading state sampai data user siap
  if (!user) {
    return (
        <AuthenticatedLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>Loading...</p>
            </div>
        </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      {/* Container utama dengan background dan padding responsif */}
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        
        {/* Kartu Profil Utama */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center mb-6">
          <div className="flex flex-col items-center space-y-3">
            
            <div className="relative">
              <img 
                src={user.imageUrl || 'https://i.pravatar.cc/150'} 
                alt="Profile" 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-purple-200"
              />
              <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
            </div>
            <div>
              {/* Menampilkan nama dan email dari state user */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.nama || 'Nama Pengguna'}</h1>
              <p className="text-sm sm:text-md text-gray-500">{user.no_hp || '0987654321'}</p>
            </div>
          </div>
        </div>

        {/* Menu Pengaturan Akun */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
            <h2 className="text-lg font-bold text-gray-800 p-4 border-b border-gray-200">Pengaturan Akun</h2>
            <ul className="divide-y divide-gray-200">
                {profileMenuItems.map(item => (
                    <li key={item.label} onClick={() => router.push(item.href)} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 p-2 rounded-full">
                                {item.icon}
                            </div>
                            <span className="font-semibold text-gray-700">{item.label}</span>
                        </div>
                        <FiChevronRight className="text-gray-400" />
                    </li>
                ))}
            </ul>
        </div>

        {/* Tombol Logout dengan margin atas, bukan mt-auto */}
        <div className="w-full max-w-md mt-8 pb-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-md"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

