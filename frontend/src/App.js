import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAudioInput } from './hooks/useAudioInput';
import { useScreamRecorder } from './hooks/useScreamRecorder';
import './App.css';
import VolumeMeter from './components/VolumeMeter';
import FloatingStickers from './components/FloatingStickers'; // ← ДОБАВЬ ЭТУ СТРОКУ

import { FeedPage } from './pages/FeedPage';
import { SinglePostPage } from './pages/SinglePostPage';

function App() {
  const {
    volume,
    isListening,
    isCalibrating,
    startCalibration,
    stopListening,
    error,
  } = useAudioInput();

  const { isRecording, recordingTime, startRecording, stopRecording } = useScreamRecorder(volume);
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Компонент FeedPage с нужными пропсами
  const feedPageElement = (
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
  );

  return (
    <div className="App">
      <FloatingStickers />
      <header className="sticky-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>ORALO</h1>
          <button
            onClick={!isListening ? startCalibration : stopListening}
            className={`mic-button ${isCalibrating ? 'calibrating' : ''} ${isListening ? 'active' : ''}`}
          >
            {!isListening ? '🎙️ ВКЛ' : isCalibrating ? '🤫 ТССС...' : '🛑 СТОП'}
          </button>
        </div>

        <div style={{ flex: 1, margin: '0 20px', maxWidth: '300px' }}>
          <VolumeMeter volume={volume} />
        </div>

        {/* Кнопка создания поста */}
        <button 
          className="create-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
          disabled={isRecording || isCalibrating} // <--- Теперь кнопка активна если есть микрофон
        >
          {isFormOpen ? '✖' : '➕ ОРАТЬ'}
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <Routes>
        <Route
          path="/"
          element={feedPageElement}
        />
        <Route
          path="/posts"
          element={feedPageElement}
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
