// src/app/laporan/page.js
"use client";

import { useState } from 'react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import api from '../../lib/api';

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [tanggalMulai, setTanggalMulai] = useState(oneMonthAgo.toISOString().split('T')[0]);
  const [tanggalSelesai, setTanggalSelesai] = useState(today.toISOString().split('T')[0]);
  
  const fetchLaporan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    // setLaporan([]); // Opsional: hapus jika ingin data lama tetap tampil saat loading

    try {
      const response = await api.get('/api/laporan', {
        params: {
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
        }
      });
      setLaporan(response.data.data);
    } catch (err) {
      setError('Gagal mengambil data laporan.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => time ? time.substring(0, 5) : '-';
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AuthenticatedLayout>
      <div className="bg-blue-600 p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-white text-center">Laporan Absensi</h1>
      </div>
      
      <form onSubmit={fetchLaporan} className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label htmlFor="tanggal_mulai" className="text-sm font-medium text-gray-700">Dari Tanggal</label>
            <input 
              type="date" 
              id="tanggal_mulai" 
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-full">
            <label htmlFor="tanggal_selesai" className="text-sm font-medium text-gray-700">Sampai Tanggal</label>
            <input 
              type="date" 
              id="tanggal_selesai" 
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Mencari...' : 'Tampilkan Laporan'}
        </button>
      </form>

      {/* Tambahkan pb-24 di sini agar data tidak tertutup navigasi bawah */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-20 pb-24"> 
        {error && <p className="text-red-500 text-center">{error}</p>}
        {laporan.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            {'Silakan pilih rentang tanggal dan klik "Tampilkan Laporan".'}
          </p>
        )}
        
        <div className="space-y-3">
          {laporan.map((item) => (
            <div key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
            {/* Ukuran teks tanggal dibuat standar (text-base) */}
            <p className="text-base font-bold text-gray-800">{formatDate(item.tanggal)}</p>
            
            {/* Grid 2 kolom, jarak antar baris dikecilkan (gap-y-1) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              {/* Gunakan Flexbox untuk mensejajarkan label dan jam */}
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-medium text-gray-500 w-24">Masuk</p>
                {/* Ukuran teks jam diperkecil (text-sm) dan warnanya dipertegas */}
                <p className="text-sm font-semibold text-gray-900">{formatTime(item.jam_masuk)}</p>
              </div>
              
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-medium text-gray-500 w-24">Pulang</p>
                <p className="text-sm font-semibold text-gray-900">{formatTime(item.jam_pulang)}</p>
              </div>
              
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-medium text-gray-500 w-24">Mulai Istirahat</p>
                <p className="text-sm font-semibold text-gray-900">{formatTime(item.jam_mulai)}</p>
              </div>
              
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-medium text-gray-500 w-24">Selesai Istirahat</p>
                <p className="text-sm font-semibold text-gray-900">{formatTime(item.jam_selesai)}</p>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}