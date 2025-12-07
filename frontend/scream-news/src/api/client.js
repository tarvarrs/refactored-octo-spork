import axios from 'axios';

const API_BASE = 'http://localhost:8084/api'; // Убедись, что бэкенд запущен на этом порту

// Создаем инстанс axios
const http = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('scream_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // --- AUTH ---
  login: async (username) => {
    const { data } = await http.post('/auth/login', { username });
    if (data.token) {
      localStorage.setItem('scream_token', data.token);
      localStorage.setItem('scream_username', username);
    }
    return data;
  },

  // --- POSTS ---
  fetchPosts: async () => {
    const { data } = await http.get('/posts');
    return data;
  },

  createPost: async (content, initialVolume) => {
    const { data } = await http.post('/posts', {
      content,
      initial_volume: initialVolume,
    });
    return data;
  },

  // --- HELPER ---
  isLoggedIn: () => !!localStorage.getItem('scream_token'),
  getUsername: () => localStorage.getItem('scream_username'),
};
