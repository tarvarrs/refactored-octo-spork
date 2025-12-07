import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAudioInput } from './hooks/useAudioInput';
import { useScreamScroll } from './hooks/useScreamScroll';
import { useScreamRecorder } from './hooks/useScreamRecorder';
import './App.css';
import VolumeMeter from './components/VolumeMeter';
import FloatingStickers from './components/FloatingStickers';
import { FeedPage } from './pages/FeedPage';
import { SinglePostPage } from './pages/SinglePostPage';
import { api } from './api/client';

const getRandomName = () => `Screamer_${Math.floor(Math.random() * 10000)}`;

function App() {
  // --- 1. АУДИО И МИКРОФОН ---
  const {
    volume,
    isListening,
    isCalibrating,
    startCalibration,
    stopListening,
    error,
  } = useAudioInput();

  // --- 2. ЗАПИСЬ ПОСТА ---
  const { isRecording, recordingTime, startRecording, stopRecording } = useScreamRecorder(volume);

  // --- 3. СТРЕСС-СЛАЙДЕР ---
  const [stressLevel, setStressLevel] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // --- 4. ФОРМА СОЗДАНИЯ ПОСТА ---
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Скроллинг от громкости
  useScreamScroll(volume, isListening && !isCalibrating && !isRecording, 5);

  // Автологин при запуске
  useEffect(() => {
    const initAuth = async () => {
      if (!api.isLoggedIn()) {
        try {
          const name = getRandomName();
          await api.login(name);
          console.log(`✅ Logged in as ${name}`);
        } catch (e) {
          console.error("Login failed", e);
        }
      }
    };
    initAuth();
  }, []);

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
            disabled={isRecording || isCalibrating}
          >
            {isFormOpen ? '✖' : '➕ ОРАТЬ'}
          </button>
        </div>

        {/* Индикатор громкости */}
        <div style={{ flex: 1, margin: '0 20px', maxWidth: '300px' }}>
          <VolumeMeter volume={volume} />
        </div>
      </header>

      {/* СТРЕСС-СЛАЙДЕР - СПРАВА СБОКУ */}
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

      {/* РОУТИНГ */}
      <Routes>
        <Route
          path="/"
          element={
            <FeedPage
              volume={volume}
              isListening={isListening}
              isCalibrating={isCalibrating}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              recordingTime={recordingTime}
              isFormOpen={isFormOpen}
              setIsFormOpen={setIsFormOpen}
            />
          }
        />
        <Route
          path="/post/:id"
          element={
            <SinglePostPage
              volume={volume}
              isListening={isListening}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;