"use client";

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import api from '../lib/api';
import Image from 'next/image';

// Menerima props dari halaman induk
export default function AbsensiKamera({ statusAbsensi, onSuccess }) {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { next_action, data_absensi, user } = statusAbsensi;

  // Membuat teks tombol lebih dinamis
  const getButtonText = () => {
    switch (next_action) {
      case 'masuk': return 'Absen Masuk';
      case 'mulai_istirahat': return 'Mulai Istirahat';
      case 'selesai_istirahat': return 'Selesai Istirahat';
      case 'pulang': return 'Absen Pulang';
      default: return 'Selesai';
    }
  };

  const capture = useCallback(() => {
    // FIX 2: Menambahkan pengecekan untuk memastikan webcamRef sudah siap
    if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    } else {
        console.error("Referensi webcam belum siap.");
    }
  }, [webcamRef, setImgSrc]);

  const kirimAbsensi = async () => {
    if (!imgSrc) return;
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/absensi/rekam', { foto: imgSrc });
      onSuccess(response.data.message); // Kirim pesan sukses ke halaman induk
      setImgSrc(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim absensi.');
    } finally {
      setLoading(false);
    }
  };

  // Tampilan jika absensi sudah selesai
  if (next_action === 'selesai') {
    return (
      <div className="w-full max-w-sm mx-auto text-center bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-green-600">Terima Kasih!</h2>
        <p className="text-gray-600 mt-2">Anda sudah menyelesaikan semua absensi untuk hari ini.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-700 mb-2">{getButtonText()}</h2>
      <p className="text-sm text-gray-500 mb-4">NIK: {user?.nik || '...'}</p>

      {/* FIX 3: Menambahkan `relative` pada container Image */}
      <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
        {imgSrc ? (
          // FIX 3: Menggunakan prop `fill` untuk Image
          <Image 
            src={imgSrc} 
            alt="Hasil capture" 
            fill
            className="object-cover" 
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "user" }}
            // FIX 1: Menambahkan prop `mirrored={false}`
            mirrored={false}
          />
        )}
      </div>

      {error && <div className="p-3 mb-4 w-full text-sm text-center text-red-800 bg-red-100 rounded-lg">{error}</div>}

      <div className="w-full flex justify-center gap-4">
        {imgSrc ? (
          <>
            <button onClick={() => setImgSrc(null)} className="w-full py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Ulangi
            </button>
            <button onClick={kirimAbsensi} disabled={loading} className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>
          </>
        ) : (
          <button onClick={capture} className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Ambil Foto
          </button>
        )}
      </div>
    </div>
  );
}
