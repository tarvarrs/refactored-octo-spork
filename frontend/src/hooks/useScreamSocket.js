import { useEffect, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:8084/ws';

export const useScreamSocket = (setPosts) => {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const setPostsRef = useRef(setPosts);

  // Обновляем ref при изменении setPosts
  useEffect(() => {
    setPostsRef.current = setPosts;
  }, [setPosts]);

  useEffect(() => {
    // Если уже подключены, не подключаемся снова
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return;
    }

    // Закрываем предыдущее соединение, если есть
    if (ws.current) {
      ws.current.close();
    }

    // Подключаемся к сокету
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      console.log('🔌 WS Connected');
      setIsConnected(true);
    };

    socket.onerror = (error) => {
      console.error('🔌 WS Error:', error);
      setIsConnected(false);
    };

    socket.onclose = (event) => {
      console.log('🔌 WS Disconnected', event.code, event.reason);
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // Обработка обновления счета (Server -> Client)
        if (msg.event === 'support_update') {
          setPostsRef.current((prevPosts) => 
            prevPosts.map((post) => {
              if (post.id === msg.post_id) {
                return {
                  ...post,
                  support_score: msg.new_support_score,
                  // Флаг для анимации, если сервер сказал "тряси!"
                  is_shaking_remote: msg.is_shaking 
                };
              }
              return post;
            })
          );
        }
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    // Чистим при размонтировании
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []); // Пустой массив зависимостей - подключаемся один раз при монтировании

  // Функция для отправки крика (вызывается из компонента)
  const sendScream = (postId, volume) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        action: 'scream_support',
        post_id: postId,
        volume: volume
      }));
    }
  };

  return { isConnected, sendScream };
};
