import React, { useEffect, useState } from 'react';
import { useAudioInput } from './hooks/useAudioInput';
import { useScreamScroll } from './hooks/useScreamScroll';
import { useScreamRecorder } from './hooks/useScreamRecorder';
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
  const { isRecording, recordingTime, startRecording, stopRecording } = useScreamRecorder(volume);
  useScreamScroll(volume, isListening && !isCalibrating && !isRecording, 5);
  const [posts, setPosts] = useState([]);
  const [draftText, setDraftText] = useState("");
  
  const loadData = async () => {
    const data = await api.fetchPosts();
    setPosts(data);
  }

  useEffect(() => { loadData(); }, []);

  const handlePostCreation = async () => {
    if (!draftText.trim()) return alert("Напиши хоть что-то!");
    
    const finalVolume = stopRecording();
    
    await api.createPost(draftText, finalVolume);
    
    setDraftText("");
    loadData();
    alert(`Пост создан! Громкость (размер): ${finalVolume}%`);
  };

  return (
    <div className="App" style={{ padding: 20, paddingBottom: 500 }}>
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div style={{ position: 'sticky', top: 0, background: '#222', color: 'white', padding: 15, zIndex: 9999, borderBottom: '2px solid red' }}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 10}}>
           <div>
             {!isListening ? (
               <button onClick={startCalibration} style={{background: '#0f0'}}>ВКЛ МИКРОФОН</button>
             ) : isCalibrating ? (
               <span>🤫 КАЛИБРОВКА...</span>
             ) : (
               <span>🟢 МИКРОФОН АКТИВЕН (Шум: {volume}%)</span>
             )}
           </div>
        </div>

        {/* ФОРМА СОЗДАНИЯ ПОСТА */}
        {isListening && !isCalibrating && (
          <div style={{ background: '#333', padding: 10, marginTop: 10 }}>
            <input 
              type="text" 
              placeholder="Напиши текст и ЗАЖМИ кнопку..." 
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              style={{ width: '70%', padding: 5 }}
            />
            
            {/* Кнопка с логикой зажатия */}
            <button
              onMouseDown={startRecording}
              onMouseUp={handlePostCreation}
              onMouseLeave={() => isRecording && stopRecording()} // Если увел мышку
              style={{ 
                marginLeft: 10, 
                padding: '5px 15px',
                background: isRecording ? 'red' : '#ddd',
                color: isRecording ? 'white' : 'black',
                fontWeight: 'bold'
              }}
            >
              {isRecording ? `ОРЁМ! ${recordingTime}s` : 'УДЕРЖИВАЙ И ОРИ'}
            </button>
          </div>
        )}
      </div>

      {/* ЛЕНТА */}
      <div style={{ marginTop: 20 }}>
        {posts.map(post => (
           <div key={post.id} style={{ 
             border: '1px solid #ccc', 
             margin: '20px 0', 
             padding: 20,
             // Здесь магия: размер шрифта зависит от громкости при создании!
             fontSize: `${Math.max(12, post.volumeLevel)}px`, 
             fontWeight: post.volumeLevel > 80 ? 'bold' : 'normal',
             color: post.volumeLevel > 80 ? 'red' : 'black'
           }}>
             {post.content}
             <div style={{fontSize: 12, color: 'gray', marginTop: 5}}>
                Power: {post.volumeLevel}%
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}

export default App;
