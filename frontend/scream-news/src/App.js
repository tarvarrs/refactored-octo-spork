import React, { useEffect, useState } from 'react';
import { useAudioInput } from './hooks/useAudioInput';
import { useScreamScroll } from './hooks/useScreamScroll';
import { useScreamRecorder } from './hooks/useScreamRecorder';
import { api } from './api/client';
import './App.css';
import PostCard from './components/PostCard';
import VolumeMeter from './components/VolumeMeter';
import FloatingStickers from './components/FloatingStickers';

function App() {
  // --- 1. ЛОГИКА АУДИО И СКРОЛЛА ---
  const { 
    volume, 
    isListening, 
    isCalibrating, 
    startCalibration, 
    stopListening, 
    error 
  } = useAudioInput();

  // --- 2. ЛОГИКА ЗАПИСИ ПОСТА (НОВОЕ) ---
  const { isRecording, recordingTime, startRecording, stopRecording } = useScreamRecorder(volume);

  // --- 3. СТРЕСС-СЛАЙДЕР (НОВОЕ) ---
  const [stressLevel, setStressLevel] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Скроллим только если слушаем, не калибруемся и НЕ записываем пост прямо сейчас
  useScreamScroll(volume, isListening && !isCalibrating && !isRecording, 5);

  // --- 4. ДАННЫЕ И ФОРМЫ ---
  const [posts, setPosts] = useState([]);
  const [draftText, setDraftText] = useState(""); // Текст нового поста (будет Title)
  const [isFormOpen, setIsFormOpen] = useState(false); // Открыть/закрыть форму

  const loadData = async () => {
    try {
      const data = await api.fetchPosts();
      setPosts(data);
    } catch (e) {
      console.error("Не удалось загрузить посты", e);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Обработчик создания поста
  const handlePostCreation = async () => {
    if (!draftText.trim()) return alert("Напиши хоть слово перед тем как орать!");

    // Получаем громкость крика
    const finalVolume = stopRecording();

    // Отправляем: draftText -> title, description генерируется в client.js или можно передать пустой
    await api.createPost(draftText, finalVolume);

    // Сброс UI
    setDraftText("");
    setIsFormOpen(false);
    loadData(); // Обновляем ленту
  };

  return (
    <div className="App">
      <FloatingStickers isPaused={isDragging} />

      <header className="sticky-header">
        <h1>ORALO</h1>

        {/* Контейнер для кнопок справа */}
        <div className="header-controls-right">
          {/* КНОПКА ВКЛЮЧЕНИЯ МИКРОФОНА */}
          <button 
            onClick={!isListening ? startCalibration : stopListening}
            className={`mic-button ${isCalibrating ? 'calibrating' : ''} ${isListening ? 'active' : ''}`}
          >
            {!isListening ? '🎙️ ВКЛ' : isCalibrating ? '🤫 ТССС...' : '🛑 СТОП'}
          </button>

          {/* Кнопка создания поста */}
          <button 
            className="create-btn"
            onClick={() => setIsFormOpen(!isFormOpen)}
            disabled={true}
          >
            {isFormOpen ? '✖' : '➕ ОРАТЬ'}
          </button>
        </div>

        {/* Индикатор громкости (Реальный!) */}
        <div style={{ flex: 1, margin: '0 20px', maxWidth: '300px' }}>
           <VolumeMeter volume={volume} />
        </div>
      </header>

      {/* СТРЕСС-СЛАЙДЕР - ТЕПЕРЬ СПРАВА СБОКУ */}
      <div className="stress-slider-sidebar">
        <label className="stress-label">
          ПОДЕРГАЙ<br/>ЧТОБЫ СНЯТЬ<br/>НАПРЯЖЕНИЕ
        </label>
        <div className="stress-slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={stressLevel}
            onChange={(e) => setStressLevel(e.target.value)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className={`stress-slider ${isDragging ? 'dragging' : ''}`}
            style={{
              '--slider-value': stressLevel,
              '--slider-color': stressLevel > 70 ? 'var(--scream-color)' : 
                                stressLevel > 30 ? '#ff8800' : 'var(--neon-blue)'
            }}
          />
        </div>
      </div>

      {/* ОШИБКИ */}
      {error && <div className="error-banner">{error}</div>}

      {/* ФОРМА СОЗДАНИЯ ПОСТА (ВЫЕЗЖАЕТ ИЛИ ПОЯВЛЯЕТСЯ) */}
      {isFormOpen && (
        <div className="post-creator">
           <textarea
             placeholder="Заголовок твоего крика..."
             value={draftText}
             onChange={(e) => setDraftText(e.target.value)}
             rows={3}
           />
           <button
             className={`record-btn ${isRecording ? 'recording' : ''}`}
             onMouseDown={startRecording}
             onMouseUp={handlePostCreation}
             onMouseLeave={() => isRecording && stopRecording()} 
           >
             {isRecording ? `ГРОМЧЕ! (${recordingTime}s)` : '🎤 ЗАЖМИ И ОРИ'}
           </button>
        </div>
      )}

      <main className="feed">
        {/* ПУСТОЕ СОСТОЯНИЕ: Стилизованная плашка */}
        {posts.length === 0 && !isListening && (
           <div className="empty-state">
             🎙️ ВКЛЮЧИ МИКРОФОН, <br/> ЧТОБЫ УСЛЫШАТЬ ЭТОТ МИР...
           </div>
        )}

        {posts.map(post => (
          <PostCard 
            key={post.id}
            title={post.title} 
            text={post.description}
            score={post.hp || 1000} 
            volumeLevel={post.volumeLevel}
          />
        ))}

        {/* КОНЕЦ ЛЕНТЫ: С бегущей строкой */}
        {posts.length > 0 && (
          <div className="end-of-feed">
            <div className="marquee-container">
              <div className="marquee-content">
                ААААААААА ААААААААА ААААААААА ААААААААА ААААААААА ААААААААА
              </div>
            </div>
            <div className="end-text">
              ☠️ ВЫ ДОСТИГЛИ ДНА
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;