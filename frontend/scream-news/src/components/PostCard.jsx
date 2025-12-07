import React from 'react';
import './PostCard.css';

const PostCard = ({ title, text, score = 0 }) => {
  const isViral = score >= 500;
  const isTrending = score >= 100 && score < 500;
  
  // Вычисляем размер карточки на основе pts
  const getCardSize = (pts) => {
    if (pts >= 500) return 'size-xl';      // Viral - огромные
    if (pts >= 300) return 'size-large';   // Большие
    if (pts >= 150) return 'size-medium';  // Средние
    if (pts >= 50) return 'size-normal';   // Обычные
    return 'size-small';                    // Маленькие
  };

  // Формируем классы
  let cardClass = `post-card ${getCardSize(score)}`;
  if (isViral) cardClass += ' card-viral';
  else if (isTrending) cardClass += ' card-trending';

  // Цвет темы для карточки
  const themeColor = isViral 
    ? 'var(--scream-color)' 
    : isTrending 
    ? 'var(--chill-color)' 
    : '#555';

  return (
    <div className={cardClass}>
      <div className="card-header">
        <span className="score-text" style={{ color: themeColor }}>
          {score} pts {isViral ? 'VIRAL' : isTrending ? 'TRENDING' : ''}
        </span>
      </div>

      <h3>{text}</h3>

      {/* Прогресс бар */}
      <div className="hype-bar-container">
        <div 
          className="hype-bar-fill" 
          style={{
            width: `${Math.min((score / 500) * 100, 100)}%`,
            background: themeColor
          }}
        />
      </div>
    </div>
  );
};

export default PostCard;
