"use client";

import { useState } from "react";
import api from "../../lib/api"; // path ke api.js
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    no_hp: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await api.post("/api/register", formData);

      setSuccessMessage("Registrasi berhasil! Anda akan diarahkan ke login...");
      console.log("Register success:", response.data);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setLoading(false);
      console.error("Register error:", err.response ? err.response.data : err.message);

      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          general: "Registrasi gagal. Silakan coba lagi nanti.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 font-sans">
      <div className="md:max-w-md md:mx-auto md:min-h-screen md:bg-white md:shadow-lg">
        {/* Top Bar */}
        <div className="h-14 flex items-center p-4 border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="mr-4 text-blue-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="font-bold text-gray-800">Daftar Akun Baru</h1>
        </div>

        {/* Konten Utama */}
        <main className="p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-6">
            Lengkapi data diri Anda
          </h2>

          {/* Pesan Sukses / Error */}
          {successMessage && (
            <div className="p-3 mb-4 text-sm text-center text-green-800 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}
          {errors.general && (
            <div className="p-3 mb-4 text-sm text-center text-red-800 bg-red-100 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="nik" className="text-xs text-gray-500">
                Nomor Induk Karyawan (NIK)
              </label>
              <input
                type="text"
                id="nik"
                name="nik"
                onChange={handleChange}
                required
                className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.nik && (
                <p className="mt-1 text-xs text-red-600">{errors.nik[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="nama" className="text-xs text-gray-500">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                onChange={handleChange}
                required
                className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.nama && (
                <p className="mt-1 text-xs text-red-600">{errors.nama[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="no_hp" className="text-xs text-gray-500">
                Nomor HP
              </label>
              <input
                type="tel"
                id="no_hp"
                name="no_hp"
                onChange={handleChange}
                required
                className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.no_hp && (
                <p className="mt-1 text-xs text-red-600">{errors.no_hp[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-xs text-gray-500">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                required
                className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="text-xs text-gray-500"
              >
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                onChange={handleChange}
                required
                className="w-full pt-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-md transition-colors ${
                loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href="/" className="text-sm text-gray-600">
              Sudah punya akun?{" "}
              <span className="font-semibold text-blue-600">Masuk</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
