// src/components/AbsensiKamera.js
"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import api from '../lib/api';

export default function AbsensiKamera() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ambil data user dari localStorage saat komponen dimuat
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Fungsi untuk mengambil gambar
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  // Fungsi untuk mengirim absensi ke backend
  const kirimAbsensi = async () => {
    if (!imgSrc) {
      setError('Silakan ambil foto terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // API endpoint untuk absensi (akan kita buat di backend)
      const response = await api.post('/api/absensi/masuk', {
        foto: imgSrc, // Mengirim gambar dalam format base64
      });
      
      setSuccess(response.data.message);
      setImgSrc(null); // Reset gambar setelah berhasil

    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim absensi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-700 mb-2">Absen Masuk</h2>
      <p className="text-sm text-gray-500 mb-4">NIK: {user?.nik || 'Loading...'}</p>

      <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
        {imgSrc ? (
          <img src={imgSrc} alt="Hasil capture" className="w-full h-full object-cover" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "user" }}
          />
        )}
      </div>

      {/* Menampilkan pesan error atau sukses */}
      {error && <div className="p-3 mb-4 w-full text-sm text-center text-red-800 bg-red-100 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 w-full text-sm text-center text-green-800 bg-green-100 rounded-lg">{success}</div>}

      {/* Tombol Aksi */}
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