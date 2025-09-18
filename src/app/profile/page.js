"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Data user korup:", error);
        localStorage.removeItem("user");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center py-8">
      {/* Header */}
      <h1 className="text-white text-lg font-bold mb-6">PROFILE</h1>

      {/* Card Utama */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-md">
        {/* Foto + Nama */}
        <div className="flex flex-col items-center">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
          />
          <h2 className="mt-4 text-xl font-bold text-gray-800">{user.nama}</h2>
          <p className="text-gray-500">NIK: {user.nik}</p>
          <p className="text-gray-400 text-center mt-2">
            {user.bio || "Sebagai Profesional Programmer"}
          </p>
        </div>

        {/* Kontak */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <span className="text-gray-500 mr-3">📞</span>
            <span className="text-gray-800">{user.phone || "+62 81234567890"}</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <span className="text-gray-500 mr-3">✉️</span>
            <span className="text-gray-800">{user.email || "dumy@gmail.com"}</span>
          </div>
        </div>

        {/* Tombol */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex justify-between items-center bg-red-500 text-white px-4 py-3 rounded-lg shadow hover:bg-red-600 transition"
          >
            <span>Logout</span>
            <span>➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
