import React, { useEffect, useState } from 'react';
import { useAudioInput } from './hooks/useAudioInput';
import { useScreamScroll } from './hooks/useScreamScroll';
import { api } from './api/client';
import ScreamScrollNews from './ScreamScrollNews'; 
import './App.css';
import PostCard from './components/PostCard';
import VolumeMeter from './components/VolumeMeter';

const generateMockPosts = () => {
  const titles = [
    "КОТЫ ЗАХВАТИЛИ ВЛАСТЬ!", "Почему молчание убивает?", "БИТКОИН УПАЛ ОТ КРИКА", 
    "Соседи вызвали полицию", "Ученые: ор продлевает жизнь", "Громкость 1000%!",
    "Кто украл твой голос?", "Сенсация: тишина запрещена", "Как правильно орать?",
    "Микрофон плавится"
  ];
  
  return Array.from({ length: 15 }).map((_, i) => {
    // Делаем так, чтобы первый пост был слабым, а последние - мощными
    const baseScore = i * 80; 
    const randomBoost = Math.floor(Math.random() * 100);
    
    return {
      id: i + 1,
      title: titles[i % titles.length] + ` #${i+1}`,
      text: "Поддержите этот пост своим голосом! Чем громче вы кричите, тем выше он поднимается.",
      score: baseScore + randomBoost, 
    };
  });
};

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
  const [mockVolume, setMockVolume] = useState(0); 
  const [posts] = useState(generateMockPosts());

  return (
    <div className="App">
      <header className="sticky-header">
        {/* 🔥 ВОТ ЗДЕСЬ ИЗМЕНЕНИЕ: */}
        <h1>ORALO</h1>
        
        <div className="dev-tools">
          <p>🚀 Скорость: {mockVolume}%</p>
          <input 
            type="range" min="0" max="100" 
            value={mockVolume} 
            onChange={(e) => setMockVolume(Number(e.target.value))}
            style={{ accentColor: 'var(--scream-color)', cursor: 'pointer' }}
          />
        </div>

        <VolumeMeter volume={mockVolume} />
      </header>

      <main className="feed">
        {posts.map(post => (
          <PostCard 
            key={post.id}
            title={post.title}
            text={post.text}
            score={post.score}
          />
        ))}
        
        <div style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
          📢 КОНЕЦ ЭФИРА
        </div>
      </main>
    </div>
  );
}

export default App;
