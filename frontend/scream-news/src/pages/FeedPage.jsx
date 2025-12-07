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
  
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  const loadPosts = async () => {
    try {
      const data = await api.fetchPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
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
    
    // Собираем контент: "ЗАГОЛОВОК\n\nТекст"
    // (Потому что на бэке поле content одно, но если нужно два поля в API — скажи, разделим)
    const combinedContent = `${draftTitle}\n\n${draftDescription}`;

    try {
      await api.createPost(combinedContent, finalVolume);
      
      setDraftTitle("");
      setDraftDescription("");
      setIsFormOpen(false);
      loadPosts(); 
    } catch (e) {
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

      {posts.length === 0 && (
        <div className="empty-state">Тишина...</div>
      )}

      {posts.map(post => {
        // Пытаемся разделить контент обратно на Title и Description для отображения
        const [title, ...descParts] = (post.content || "").split("\n\n");
        const description = descParts.join("\n\n") || post.content;
        
        // Если разделение не сработало (старый пост), используем content как description
        const displayTitle = descParts.length > 0 ? title : `Крик #${post.id}`;
        const displayDesc = descParts.length > 0 ? description : post.content;

        return (
            <div 
            key={post.id} 
            className="post-card-item"
            onClick={() => navigate(`/post/${post.id}`)} 
            style={{ cursor: 'pointer', marginBottom: 20 }}
            >
            <PostCard 
                title={displayTitle}
                text={displayDesc} 
                score={post.support_score || post.score || 0}
                volumeLevel={post.initial_volume || post.volumeLevel} 
                isShaking={post.is_shaking_remote || false} 
            />
            </div>
        );
      })}
      
      <div style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
        📢 КОНЕЦ ЭФИРА
      </div>
    </div>
  );
};
