import axios from 'axios';

const API_URL = 'http://localhost:8084/api';

const getMockPosts = () => {
  return [
    { id: 1, content: "ТИШИНА В БИБЛИОТЕКЕ!", volumeLevel: 95, hp: 100 },
    { id: 2, content: "Я просто шепнул...", volumeLevel: 10, hp: 800 },
    { id: 3, content: "СРОЧНЫЕ НОВОСТИ", volumeLevel: 60, hp: 500 },
  ];
};

export const api = {
  // Получить посты
  fetchPosts: async () => {
    try {
      // Пока бэк не работает, раскомментируй следующую строку:
      return getMockPosts(); 
      
    //   const response = await axios.get(`${API_URL}/posts`);
    //   return response.data;
    } catch (error) {
      console.warn("Бэк недоступен, отдаю моки");
      return getMockPosts();
    }
  },

  // Отправить пост
  createPost: async (content, volumeLevel) => {
    return axios.post(`${API_URL}/posts`, { 
      content, 
      initial_volume: volumeLevel 
    });
  }
};
