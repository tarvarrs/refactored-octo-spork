import { useEffect } from 'react';

export const useScreamScroll = (volume, isListening, threshold = 25, speedMultiplier = 0.5) => {
  useEffect(() => {
    if (!isListening) return;

    // Если громкость выше порога — скроллим
    if (volume > threshold) {
      // Формула: (Текущая громкость - Порог) * Коэффициент скорости
      const scrollSpeed = (volume - threshold) * speedMultiplier;
      window.scrollBy({
        top: scrollSpeed,
        behavior: 'auto' // 'smooth' может тормозить при частом вызове
      });
    }
  }, [volume, isListening, threshold, speedMultiplier]);
};
    