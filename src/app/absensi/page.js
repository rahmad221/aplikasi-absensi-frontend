// src/app/absensi/page.js
"use client";

import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import AbsensiKamera from '../../components/AbsensiKamera'; // <-- Import komponen

export default function AbsensiPage() {
  return (
    <AuthenticatedLayout>
      {/* Komponen kamera diletakkan di sini */}
      <AbsensiKamera />
    </AuthenticatedLayout>
  );
}