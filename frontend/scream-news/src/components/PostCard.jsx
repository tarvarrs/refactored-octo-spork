import React from 'react';
import './PostCard.css'; // Сейчас создадим стили

const PostCard = ({ title, text, volumeLevel = 0, hp = 100 }) => {
  // Логика стилей: чем громче крик (volumeLevel), тем крупнее текст (масштаб до 1.1x)
  const dynamicStyle = {
    transform: `scale(${1 + volumeLevel / 500})`, // Легкое увеличение
    fontWeight: volumeLevel > 50 ? 'bold' : 'normal',
  };

  return (
    <div className={`post-card ${hp < 50 ? 'shaking' : ''}`}>
      <div className="card-header">
        <span className="hp-badge">HP: {hp}%</span>
      </div>
      <div className="card-content" style={dynamicStyle}>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      {/* Визуальная полоска жизни поста */}
      <div className="hp-bar">
        <div 
          className="hp-fill" 
          style={{ width: `${hp}%`, backgroundColor: hp < 30 ? 'red' : '#4caf50' }} 
        />
      </div>
    </div>
  );
};

export default PostCard;
