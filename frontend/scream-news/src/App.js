import React, { useState } from 'react';
import './App.css';
// Импортируем компоненты из новой папки
import PostCard from './components/PostCard';
import VolumeMeter from './components/VolumeMeter';

function App() {
  // --- MOCK DATA (Имитация логики для верстки) ---
  const [mockVolume, setMockVolume] = useState(30); // Фейковая громкость
  
  const mockPosts = [
    { id: 1, title: "Доброе утро", text: "Это обычный пост, с ним всё хорошо.", hp: 100 },
    { id: 2, title: "ПОСТ ТРЯСЕТСЯ!", text: "У этого поста мало HP и он получает урон!", hp: 20 },
    { id: 3, title: "Скролль вниз", text: "А тут просто текст для проверки.", hp: 80 },
  ];
  // -----------------------------------------------

  return (
    <div className="App">
      {/* Хедер с управлением */}
      <header className="sticky-header">
        <h1>🗣 ScreamNews UI</h1>
        
        {/* ВРЕМЕННЫЙ ползунок для теста верстки */}
        <div className="dev-tools">
          <p>🔧 Тест громкости:</p>
          <input 
            type="range" min="0" max="100" 
            value={mockVolume} 
            onChange={(e) => setMockVolume(Number(e.target.value))} 
          />
        </div>

        <VolumeMeter volume={mockVolume} />
      </header>

      {/* Лента постов */}
      <main className="feed">
        {mockPosts.map(post => (
          <PostCard 
            key={post.id}
            title={post.title}
            text={post.text}
            hp={post.hp}
            // Трясем пост, если громко и мало HP
            isShaking={mockVolume > 50 && post.hp < 50} 
          />
        ))}
      </main>
    </div>
  );
}

export default App;
