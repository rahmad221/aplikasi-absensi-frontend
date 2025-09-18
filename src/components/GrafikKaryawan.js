// src/components/GrafikKaryawan.js
"use client";

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GrafikKaryawan() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        const response = await api.get('/api/statistik');
        const totalKaryawan = response.data?.data?.total_karyawan ?? 0;

        setChartData({
          labels: ['Karyawan'],
          datasets: [
            {
              label: 'Total Karyawan',
              data: [totalKaryawan],
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
        setError("Tidak dapat memuat data. Silakan coba lagi nanti."); 
      } finally {
        setLoading(false);
      }
    };

    fetchStatistik();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statistik Karyawan',
      },
    },
  };

  if (loading) {
    return <div className="text-center p-4">Memuat data grafik...</div>;
  }

  return <Bar options={options} data={chartData} />;
}