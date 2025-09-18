// src/app/page.js

"use client";

import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Komponen Ikon (tidak diubah)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.198C34.788 5.636 29.734 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l6.23-6.23C34.788 5.636 29.734 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.218 0-9.618-3.52-11.188-8.266l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.237 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);
const FacebookIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z"></path></svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cek sesi login saat komponen pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Jika token ditemukan, langsung arahkan ke dashboard
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isActive) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/login', {
        nik,
        password,
      });
      console.log('Login response:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      router.push('/dashboard');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'NIK atau Password salah.');
      } else {
        setError('Tidak dapat terhubung ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nik && password) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [nik, password]);

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 font-sans">
      <div className="md:max-w-md md:mx-auto md:min-h-screen md:bg-white md:shadow-lg">
        {/* Top Bar */}
        <div className="h-14 flex items-center p-4 border-b border-gray-200">
            <button onClick={() => router.back()} className="mr-4 text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="font-bold text-gray-800">Masuk</h1>
        </div>

        {/* Konten Utama */}
        <main className="p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">
              Masuk untuk mulai absen
            </h2>
            
            {/* Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                  <label htmlFor="nik" className="text-xs text-gray-500">Nomor Induk Karyawan (NIK)</label>
                  <input
                      type="text"
                      id="nik"
                      value={nik}
                      onChange={e => setNik(e.target.value)}
                      required
                      className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  />
              </div>
              <div>
                  <label htmlFor="password" className="text-xs text-gray-500">Password</label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  />
              </div>

              {/* <-- BLOK ALERT ERROR DITAMBAHKAN DI SINI --> */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md" role="alert">
                  <p>{error}</p>
                </div>
              )}
              {/* <-- BATAS BLOK ALERT --> */}
              
              <button
                  type="submit"
                  disabled={!isActive || loading}
                  className={`w-full py-3 font-semibold rounded-md transition-colors ${
                    isActive && !loading
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                  {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
            
            <div className="text-center mt-4">
                <Link href="/register" className="text-sm text-gray-600">
                Belum punya akun? <span className="font-semibold text-blue-600">Daftar</span>
                </Link>
            </div>
            
            {/* Separator */}
            <div className="flex items-center my-8">
                <hr className="flex-grow border-t border-gray-200" />
                <span className="px-4 text-xs text-gray-500">Atau lebih cepat</span>
                <hr className="flex-grow border-t border-gray-200" />
            </div>

            {/* Tombol Social Login */}
            <div className="space-y-3">
                <button className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <GoogleIcon />
                    <span className="font-semibold text-gray-700 text-sm">Masuk dengan Google</span>
                </button>
                <button className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <FacebookIcon />
                    <span className="font-semibold text-gray-700 text-sm">Masuk dengan Facebook</span>
                </button>
            </div>
        </main>
      </div>
    </div>
  );
}

