// src/app/absensi/page.js
"use client";

import { useEffect, useState, useCallback } from 'react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import AbsensiKamera from '../../components/AbsensiKamera';
import api from '../../lib/api';

export default function AbsensiPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fungsi untuk mengambil status absensi
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await api.get('/api/absensi/status');
      setStatus({ ...response.data, user: userData });
      setError('');
    } catch (err) {
      setError('Gagal memuat status absensi.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil status saat halaman pertama kali dimuat
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Fungsi yang dipanggil setelah absensi berhasil
  const handleSuccess = (message) => {
    setSuccess(message);
    fetchStatus(); // Ambil ulang status terbaru
  };

  // Fungsi untuk memformat waktu
  const formatTime = (time) => time ? time.substring(0, 5) : '-';

  return (
    <AuthenticatedLayout>
      {success && (
        <div 
          className="p-4 mb-4 text-sm text-green-800 bg-green-100 rounded-lg"
          onClick={() => setSuccess('')}
        >
          {success}
        </div>
      )}

      {loading && <p>Loading data absensi...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {status && (
        <>
          {/* Komponen Kamera */}
          <div className="mb-8">
            <AbsensiKamera statusAbsensi={status} onSuccess={handleSuccess} />
          </div>

          {/* Tampilan Riwayat Absensi Hari Ini */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Rekam Jejak Hari Ini</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-500">Masuk</p>
                <p className="font-bold text-lg">{formatTime(status.data_absensi?.jam_masuk)}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-500">Pulang</p>
                <p className="font-bold text-lg">{formatTime(status.data_absensi?.jam_pulang)}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-500">Mulai Istirahat</p>
                <p className="font-bold text-lg">{formatTime(status.data_absensi?.jam_mulai_istirahat)}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-500">Selesai Istirahat</p>
                <p className="font-bold text-lg">{formatTime(status.data_absensi?.jam_selesai_istirahat)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthenticatedLayout>
  );
}