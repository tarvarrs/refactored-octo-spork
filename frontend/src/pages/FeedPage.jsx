import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreamScroll } from '../hooks/useScreamScroll';
import { useScreamSocket } from '../hooks/useScreamSocket';
import { api } from '../api/client';
import PostCard from '../components/PostCard';

export const FeedPage = ({ 
  volume, 
  isListening, 
  isCalibrating, 
  isRecording,
  startRecording,
  stopRecording,
  recordingTime,
  isFormOpen,
  setIsFormOpen 
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchPosts();
      console.log('📦 Posts loaded:', data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('❌ Error loading posts:', e);
      setError(e.message || 'Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useScreamSocket(setPosts);

  useScreamScroll(volume, isListening && !isCalibrating && !isRecording, 5);

  const handlePostCreation = async () => {
    if (!draftTitle.trim() || !draftDescription.trim()) {
      return alert("Заполни заголовок и описание!");
    }
    
    const finalVolume = stopRecording();
    
    try {
      await api.createPost(draftTitle, draftDescription, finalVolume);
      
      setDraftTitle("");
      setDraftDescription("");
      setIsFormOpen(false);
      loadPosts(); 
    } catch (e) {
      console.error("Error creating post:", e);
      alert("Не удалось создать пост :(");
    }
  };

  return (
    <div className="feed-page" style={{ 
        paddingTop: '250px', 
        maxWidth: '600px',
        margin: '0 auto',
        paddingLeft: '20px',
        paddingRight: '20px'  
    }}>
      
      {isFormOpen && (
        <div className="post-creator" style={{
            background: '#222',
            padding: '20px',
            marginBottom: '30px',
            border: '2px solid #ff4444',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 10
        }}>
           <h3 style={{margin: 0, color: '#ff4444'}}>Новый Крик</h3>
           
           <input
             type="text"
             placeholder="Заголовок (коротко и ясно)"
             value={draftTitle}
             onChange={(e) => setDraftTitle(e.target.value)}
             style={{
                 width: '100%',
                 padding: '12px',
                 borderRadius: '5px',
                 border: '1px solid #444',
                 background: '#333',
                 color: 'white',
                 fontSize: '16px',
                 fontWeight: 'bold'
             }}
           />

           <textarea
             placeholder="Описание (подробности крика)"
             value={draftDescription}
             onChange={(e) => setDraftDescription(e.target.value)}
             rows={4}
             style={{
                 width: '100%',
                 padding: '12px',
                 borderRadius: '5px',
                 border: '1px solid #444',
                 background: '#333',
                 color: 'white',
                 fontFamily: 'inherit',
                 fontSize: '14px',
                 resize: 'vertical'
             }}
           />

           <button
             className={`record-btn ${isRecording ? 'recording' : ''}`}
             onMouseDown={startRecording}
             onMouseUp={handlePostCreation}
             onMouseLeave={() => isRecording && stopRecording()} 
             style={{
                 padding: '15px',
                 background: isRecording ? '#d32f2f' : '#555',
                 color: 'white',
                 border: 'none',
                 borderRadius: '5px',
                 fontWeight: '900',
                 cursor: isRecording ? 'grabbing' : 'pointer',
                 transition: '0.2s',
                 marginTop: '10px',
                 textTransform: 'uppercase',
                 letterSpacing: '1px'
             }}
           >
             {isRecording ? `🔥 ГРОМКОСТЬ: ${Math.round(volume)}% (${recordingTime}s)` : '🎤 ЗАЖМИ И ОРИ ЧТОБЫ ОТПРАВИТЬ'}
           </button>
           
           {isRecording && (
             <div style={{height: 5, background: '#d32f2f', width: `${volume}%`, transition: 'width 0.1s'}} />
           )}
        </div>
      )}

      <h2 style={{ marginBottom: 20 }}>📢 ЛЕНТА</h2>

      {loading && <p>Загрузка постов...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">Тишина...</div>
      )}

      {!loading && !error && posts.map(post => (
        <div 
          key={post.id} 
          className="post-card-item"
          onClick={() => navigate(`/post/${post.id}`)} 
          style={{ cursor: 'pointer', marginBottom: 20 }}
        >
          <PostCard 
            title={post.title || 'Без заголовка'}
            text={post.description || ''} 
            score={post.support_score || 0}
            volumeLevel={post.initial_volume || 0} 
            isShaking={post.is_shaking_remote || false} 
          />
        </div>
      ))}
      
      {!loading && !error && posts.length > 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
          📢 КОНЕЦ ЭФИРА
        </div>
      )}
    </div>
  );
};
