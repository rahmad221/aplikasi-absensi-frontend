"use client";
import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import api from '../lib/api';

export default function AbsensiKamera({ statusAbsensi, onSuccess }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState('');

  const { next_action, user_info } = statusAbsensi;

  // Load Models saat mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelLoaded(true);
      setLoading(false);
    };
    loadModels();
  }, []);

  const handleProcessFace = async () => {
    if (!webcamRef.current) return;
    setProcessing(true);
    setError('');

    const imageSrc = webcamRef.current.getScreenshot();
    const img = await faceapi.fetchImage(imageSrc);

    // Deteksi wajah dan ambil descriptor
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setError("Wajah tidak terdeteksi. Pastikan pencahayaan cukup.");
      setProcessing(false);
      return;
    }

    try {
      // Kirim foto untuk arsip dan descriptor untuk verifikasi/registrasi
      const response = await api.post('/api/absensi/rekam', {
        foto: imageSrc,
        descriptor: Array.from(detection.descriptor) // Ubah Float32Array ke Array biasa
      });

      onSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memproses absensi.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Memuat AI Face Recognition...</p>;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Absensi Face ID</h2>
      
      <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          mirrored={true}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button 
        onClick={handleProcessFace} 
        disabled={processing}
        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md disabled:bg-gray-400"
      >
        {processing ? 'Mencocokkan Wajah...' : 'Scan Wajah & Absen'}
      </button>
    </div>
  );
}