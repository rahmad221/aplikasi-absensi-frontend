// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://dimensiv2.abatagroup.co.id/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
