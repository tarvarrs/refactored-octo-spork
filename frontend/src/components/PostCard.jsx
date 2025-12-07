import React from 'react';
import './PostCard.css';

const PostCard = ({ title, text, score = 0 }) => {
  const isViral = score >= 500;
  const isTrending = score >= 100 && score < 500;

  // Формируем классы
  let cardClass = 'post-card';
  if (isViral) cardClass += ' card-viral';
  else if (isTrending) cardClass += ' card-trending';

  // Цвет темы для карточки
  const themeColor = isViral ? 'var(--scream-color)' : isTrending ? 'var(--chill-color)' : '#555';

  return (
    <div className={cardClass}>
      <div className="card-header">
        <span 
          className="score-badge"
          style={{ 
            color: isViral ? '#fff' : themeColor,
            background: isViral ? themeColor : 'rgba(0,0,0,0.3)'
          }}
        >
          {isViral ? '🔥 VIRAL' : isTrending ? '⚡ TRENDING' : '💤 NORMAL'}
        </span>
        <span className="score-text">{score} PTS</span>
      </div>
      
      <div className="card-content">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <div className="hype-bar-container">
        <div 
          className="hype-bar-fill" 
          style={{ 
            width: `${Math.min(score / 10, 100)}%`, 
            backgroundColor: themeColor,
            boxShadow: `0 0 10px ${themeColor}`
          }} 
        />
      </div>
    </div>
  );
};

export default PostCard;
