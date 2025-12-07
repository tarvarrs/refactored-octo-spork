import axios from 'axios';

const API_URL = 'http://localhost:8084/api';

const getMockPosts = () => {
  return [
    { id: 1, content: "ТИШИНА В БИБЛИОТЕКЕ!", volumeLevel: 95, hp: 100 },
    { id: 2, content: "Я просто шепнул...", volumeLevel: 10, hp: 800 },
    { id: 3, content: "СРОЧНЫЕ НОВОСТИ", volumeLevel: 60, hp: 500 },
  ];
};

let localPosts = [
  { id: 1, content: "ТИШИНА В БИБЛИОТЕКЕ!", volumeLevel: 95, hp: 100 },
  { id: 2, content: "Я просто шепнул...", volumeLevel: 10, hp: 800 },
  { id: 3, content: "СРОЧНЫЕ НОВОСТИ", volumeLevel: 60, hp: 500 },
];

export const api = {
  // Получить посты
  fetchPosts: async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...localPosts]), 300);
    });
  },

  createPost: async (text, volumeLevel) => {
    const newPost = {
        id: Date.now(),
        content: text,
        volumeLevel: volumeLevel,
        hp: 1000
    };
    localPosts = [newPost, ...localPosts];
    return new Promise((resolve) => {
      setTimeout(() => resolve(newPost), 300);
    });
  }
};
