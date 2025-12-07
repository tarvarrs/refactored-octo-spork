import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreamScroll } from '../hooks/useScreamScroll';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import { useScreamSocket } from '../hooks/useScreamSocket'; // Импорт

export const FeedPage = ({ volume, isListening }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // Логика скролла живет ТОЛЬКО здесь
  useScreamScroll(volume, isListening, 10);

  useEffect(() => {
    api.fetchPosts().then(setPosts);
  }, []);
  useScreamSocket(setPosts);

  return (
    <div className="feed-page">
      <h2>📢 ЛЕНТА (ОРИ ЧТОБЫ ЛИСТАТЬ)</h2>
      {posts.map(post => (
        <div key={post.id} onClick={() => navigate(`/post/${post.id}`)} style={{ cursor: 'pointer' }}>
          <PostCard 
            title={post.content} 
            score={post.score || 0}
            // В ленте посты не трясутся и не активны
            isShaking={false} 
          />
        </div>
      ))}
    </div>
  );
};
