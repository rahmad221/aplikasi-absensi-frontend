// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://abatagrup.com/",
  // baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token.trim()}`; // Tambahkan .trim()
  config.headers.Accept = 'application/json'; // Tambahkan ini agar Laravel tahu ini API
}
  return config;
});

export default api;
