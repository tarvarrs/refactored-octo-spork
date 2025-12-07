import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreamScroll } from '../hooks/useScreamScroll';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import { useScreamSocket } from '../hooks/useScreamSocket'; // Импорт

export const FeedPage = ({ volume, isListening }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Логика скролла живет ТОЛЬКО здесь
  useScreamScroll(volume, isListening, 10);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.fetchPosts()
      .then(posts => {
        console.log('📦 Posts loaded:', posts);
        setPosts(Array.isArray(posts) ? posts : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('❌ Error loading posts:', error);
        setError(error.message || 'Ошибка загрузки постов');
        setLoading(false);
      });
  }, []);
  useScreamSocket(setPosts);

  return (
    <div className="feed-page">
      <h2>📢 ЛЕНТА (ОРИ ЧТОБЫ ЛИСТАТЬ)</h2>
      {loading && <p>Загрузка постов...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p>Нет постов. Создайте первый пост!</p>
      )}
      {!loading && !error && posts.map(post => (
        <div key={post.id} onClick={() => navigate(`/post/${post.id}`)} style={{ cursor: 'pointer' }}>
          <PostCard 
            title={post.title || 'Без заголовка'} 
            text={post.description || ''}
            score={post.support_score || 0}
            // В ленте посты не трясутся и не активны
            isShaking={false} 
          />
        </div>
      ))}
    </div>
  );
};
