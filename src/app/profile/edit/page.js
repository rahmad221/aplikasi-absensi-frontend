"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import AuthenticatedLayout from "../../../components/AuthenticatedLayout";
import { FiCamera, FiArrowLeft } from "react-icons/fi";

export default function EditProfilePage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [no_hp, setNoHp] = useState("");
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  // Ambil user dari localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
    //   console.log(userDataString);
      setNama(userData.nama || "");
      setNoHp(userData.no_hp || "");
      setProfileImage(
        userData.imageUrl && userData.imageUrl !== ""
          ? userData.imageUrl
          : "https://i.pravatar.cc/150"
      );
    }
  }, []);

  // Preview gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file)); // preview
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("no_hp", no_hp);
    if (imageFile instanceof File) {
      formData.append("profileImage", imageFile);
    }

    try {
      const response = await api.post("/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const result = response.data;

      // Update localStorage user dengan data terbaru
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...result.updatedData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profil berhasil diperbarui!");
      router.push("/profile");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Terjadi kesalahan:", error);
      }
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="relative flex items-center justify-center mb-6">
            <button
              onClick={() => router.back()}
              className="absolute left-0 p-2"
            >
              <FiArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Edit Profil</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Foto Profil */}
              <div className="flex justify-center mb-6">
                <div
                  onClick={handleImageClick}
                  className="relative w-28 h-28 cursor-pointer group"
                >
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera className="text-white w-8 h-8" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Input Nama */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      errors.nama ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.nama && (
                    <p className="mt-1 text-xs text-red-600">{errors.nama[0]}</p>
                  )}
                </div>

                {/* Input No HP */}
                <div>
                  <label
                    htmlFor="no_hp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nomor HP
                  </label>
                  <input
                    type="tel"
                    id="no_hp"
                    value={no_hp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      errors.no_hp ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.no_hp && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.no_hp[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
