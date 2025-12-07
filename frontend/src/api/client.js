import axios from 'axios';

const API_BASE = 'http://localhost:8084';

// Создаем инстанс axios
const http = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // --- POSTS ---
  fetchPosts: async () => {
    const { data } = await http.get('/posts');
    return data;
  },

  createPost: async (title, description, initialVolume) => {
    const { data } = await http.post('/posts', {
      title,
      description,
      initial_volume: initialVolume,
    });
    return data;
  },
};
