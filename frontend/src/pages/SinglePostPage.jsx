import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import { useScreamSocket } from '../hooks/useScreamSocket';

export const SinglePostPage = ({ volume, isListening }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [localScore, setLocalScore] = useState(0); // Визуальный счетчик
  const [postsForSocket, setPostsForSocket] = useState([]);
  // Порог для буста
  const BOOST_THRESHOLD = 30;
  const { sendScream } = useScreamSocket(setPostsForSocket); 
  // Имитация WebSocket отправки (пока)
  useEffect(() => {
    if (!isListening || volume < BOOST_THRESHOLD || !post) return;

    // 1. Визуально крутим счетчик сразу
    setLocalScore(prev => prev + 1);

    if (volume > 30) {
       const interval = setInterval(() => {
       sendScream(post.id, volume);
    }, 200);
       
       // Визуально тоже обновляем сразу, для плавности
       setLocalScore(prev => prev + 1); 
    }
  }, [volume, isListening, post]);

  useEffect(() => {
    // Загружаем инфо о посте (в реальности fetchPostById)
    api.fetchPosts().then(posts => {
      const found = posts.find(p => p.id === Number(id));
      if (found) {
        setPost(found);
        setLocalScore(found.score || 0);
      }
    });
  }, [id]);

  if (!post) return <div>Загрузка...</div>;

  const isScreaming = volume > BOOST_THRESHOLD;

  return (
    <div className="single-post-page" style={{ padding: 20, textAlign: 'center' }}>
      <button onClick={() => navigate('/')}>← Назад в ленту</button>
      
      <div style={{ marginTop: 50, transform: isScreaming ? 'scale(1.1)' : 'scale(1)', transition: '0.1s' }}>
        <PostCard 
          title={post.content}
          text="ОРИ НА МЕНЯ! ПОДДЕРЖИ МЕНЯ!"
          score={localScore}
          isShaking={isScreaming} // Трясется, когда орешь
        />
      </div>

      <div style={{ marginTop: 20, color: isScreaming ? 'red' : 'gray' }}>
        {isScreaming ? `🔥 МОЩНОСТЬ: ${volume}%` : 'Кричи, чтобы поддержать!'}
      </div>
    </div>
  );
};
