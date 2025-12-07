import React, { useEffect, useState } from 'react';
import './FloatingStickers.css';

// Импорты стикеров (положи их в папку src/assets/stickers/)
import sticker1 from '../assets/stickers/sticker_1.png';
import sticker2 from '../assets/stickers/sticker_2.png';
import sticker3 from '../assets/stickers/sticker_3.png';
import sticker4 from '../assets/stickers/sticker_4.png';
import sticker5 from '../assets/stickers/sticker_5.png';
import sticker6 from '../assets/stickers/sticker_6.png';
import sticker7 from '../assets/stickers/sticker_7.png';
import sticker8 from '../assets/stickers/sticker_8.png';

const STICKERS = [
  sticker1, sticker2, sticker3, sticker4, 
  sticker5, sticker6, sticker7, sticker8
];

function FloatingStickers() {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    // Создаем 15 случайных стикеров для фона
    const generateStickers = () => {
      return Array.from({ length: 15 }, (_, i) => ({
        id: i,
        src: STICKERS[Math.floor(Math.random() * STICKERS.length)],
        // Случайная позиция
        left: Math.random() * 100,
        top: Math.random() * 100,
        // Случайный размер (от 40px до 100px)
        size: 40 + Math.random() * 60,
        // Случайная длительность анимации (15-40 секунд)
        duration: 15 + Math.random() * 25,
        // Случайная задержка старта
        delay: Math.random() * 5,
        // Случайное направление движения
        direction: Math.random() > 0.5 ? 1 : -1,
        // Случайная непрозрачность (0.1 - 0.3)
        opacity: 0.1 + Math.random() * 0.2
      }));
    };

    setStickers(generateStickers());
  }, []);

  return (
    <div className="floating-stickers-container">
      {stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.src}
          alt="floating sticker"
          className="floating-sticker"
          style={{
            left: `${sticker.left}%`,
            top: `${sticker.top}%`,
            width: `${sticker.size}px`,
            height: `${sticker.size}px`,
            opacity: sticker.opacity,
            animationDuration: `${sticker.duration}s`,
            animationDelay: `${sticker.delay}s`,
            '--float-x': `${sticker.direction * (50 + Math.random() * 100)}px`,
            '--float-y': `${-100 - Math.random() * 100}px`
          }}
        />
      ))}
    </div>
  );
}

export default FloatingStickers;
