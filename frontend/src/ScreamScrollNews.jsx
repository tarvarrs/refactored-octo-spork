import React, { useState, useEffect, useRef } from 'react';

// Компонент одной новости (для заполнения контента)
const NewsCard = ({ id }) => (
  <div style={styles.card}>
    <div style={styles.cardImage}>Новость #{id}</div>
    <h2 style={styles.cardTitle}>Срочные новости: Событие номер {id}</h2>
    <p style={styles.cardText}>
      Это текст-рыба для демонстрации интерфейса. Здесь описываются невероятные события,
      которые требуют вашего внимания. Продолжайте кричать, чтобы узнать, что случилось дальше!
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
  </div>
);

const ScreamScrollNews = () => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [permissionError, setPermissionError] = useState(null);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIdRef = useRef(null);

  // Константы для настройки чувствительности
  const MIN_VOLUME_THRESHOLD = 1000; // Минимальная громкость (0-255) для начала скролла
  const SCROLL_MULTIPLIER = 0.5;   // Множитель скорости скролла

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Инициализация AudioContext
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      // Настройка анализатора
      analyserRef.current.fftSize = 256;
      sourceRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      setPermissionError(null);
      
      analyzeAudio();
    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
      setPermissionError("Не удалось получить доступ к микрофону. Пожалуйста, разрешите доступ.");
    }
  };

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setIsListening(false);
    setVolume(0);
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Вычисляем среднюю громкость
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const averageVolume = sum / dataArray.length;
    
    setVolume(Math.round(averageVolume));

    // Логика скролла
    if (averageVolume > MIN_VOLUME_THRESHOLD) {
      // Чем громче, тем быстрее скролл
      const scrollSpeed = (averageVolume - MIN_VOLUME_THRESHOLD) * SCROLL_MULTIPLIER;
      window.scrollBy(0, scrollSpeed);
    }

    rafIdRef.current = requestAnimationFrame(analyzeAudio);
  };

  useEffect(() => {
    return () => stopListening(); // Очистка при размонтировании
  }, []);

  return (
    <div style={styles.container}>
      {/* Плавающая панель управления */}
      <div style={styles.controlPanel}>
        <h1 style={styles.headerTitle}>ScreamNews 😱</h1>
        <div style={styles.statusBlock}>
          <div style={styles.meterContainer}>
            <div 
              style={{
                ...styles.meterFill,
                width: `${Math.min(volume, 100)}%`,
                backgroundColor: volume > MIN_VOLUME_THRESHOLD ? '#ff4444' : '#4caf50'
              }} 
            />
          </div>
          <span style={styles.volText}>Громкость: {volume}</span>
        </div>

        {!isListening ? (
          <button style={styles.button} onClick={startListening}>
            Включить микрофон
          </button>
        ) : (
          <button style={{...styles.button, ...styles.stopButton}} onClick={stopListening}>
            Остановить
          </button>
        )}
        
        {permissionError && <p style={styles.error}>{permissionError}</p>}
        <p style={styles.hint}>
          {isListening ? "Кричите или шумите, чтобы листать вниз!" : "Нажмите кнопку, чтобы начать"}
        </p>
      </div>

      {/* Лента новостей */}
      <div style={styles.feed}>
        {Array.from({ length: 20 }).map((_, i) => (
          <NewsCard key={i} id={i + 1} />
        ))}
      </div>
    </div>
  );
};

// Простые стили в объекте JS
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
  },
  controlPanel: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '15px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
  },
  headerTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    color: '#333',
  },
  statusBlock: {
    width: '100%',
    maxWidth: '400px',
    marginBottom: '10px',
  },
  meterContainer: {
    height: '20px',
    backgroundColor: '#ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  meterFill: {
    height: '100%',
    transition: 'width 0.1s linear, background-color 0.2s',
  },
  volText: {
    fontSize: '12px',
    color: '#666',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
  },
  hint: {
    fontSize: '12px',
    color: '#888',
    marginTop: '5px',
  },
  feed: {
    paddingTop: '180px', // Отступ для фиксированной шапки
    paddingBottom: '50px',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '20px',
    marginBottom: '15px',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
  },
  cardText: {
    color: '#555',
    lineHeight: '1.5',
  },
};

export default ScreamScrollNews;
