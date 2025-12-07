import React, { useEffect, useState } from 'react';
import { useAudioInput } from './hooks/useAudioInput';
import { useScreamScroll } from './hooks/useScreamScroll';
import { api } from './api/client';
import ScreamScrollNews from './ScreamScrollNews'; 

function App() {
  const { 
    volume, 
    isListening, 
    isCalibrating, // Новый флаг
    startCalibration, // Новая функция запуска
    stopListening, 
    error 
  } = useAudioInput();
  useScreamScroll(volume, isListening && !isCalibrating, 5);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const data = await api.fetchPosts();
      setPosts(data);
    };
    loadData();
  }, []);
  return (
    <div className="App" style={{ padding: 20 }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#222', color: 'white', padding: 15, zIndex: 9999, display: 'flex', justifyContent: 'space-between' }}>
        
        <div>
          {/* Логика кнопки меняется в зависимости от статуса */}
          {!isListening ? (
            <button onClick={startCalibration} style={{ padding: '10px 20px', background: '#0f0' }}>
              НАЧАТЬ (Калибровка)
            </button>
          ) : isCalibrating ? (
            <span style={{ color: 'yellow', fontWeight: 'bold' }}>🤫 ТССС! ИЗМЕРЯЕМ ТИШИНУ...</span>
          ) : (
            <button onClick={stopListening} style={{ padding: '10px 20px', background: 'red', color: 'white' }}>
              СТОП
            </button>
          )}
        </div>

        <div>Volume: {volume}%</div>
      </div>
      
      {error && <div style={{ color: 'red', marginTop: 60 }}>{error}</div>}

      <div style={{ marginTop: 100 }}>
        {posts.map(post => (
           <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: 20 }}>
             <h3>{post.content}</h3>
             <small>Громкость поста: {post.volumeLevel}</small>
           </div>
        ))}
        {/* Добавим много текста чтобы было куда скроллить */}
        {Array.from({length: 20}).map((_, i) => (
            <div key={i} style={{height: 100, background: '#eee', margin: 10}}>Пустое место {i}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
