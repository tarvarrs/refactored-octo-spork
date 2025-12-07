import { useState, useRef, useEffect } from 'react';

export const useScreamRecorder = (currentVolume) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Храним все замеры громкости за сессию записи
  const volumeHistory = useRef([]);
  const timerRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    volumeHistory.current = []; // Очищаем историю
    setRecordingTime(0);

    // Запускаем таймер просто для визуала (сколько сек орем)
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 0.1);
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);

    // Считаем результат
    const history = volumeHistory.current;
    if (history.length === 0) return 0;

    // Считаем среднюю громкость (или максимальную, как решим)
    const sum = history.reduce((a, b) => a + b, 0);
    const avgVolume = Math.round(sum / history.length);
    
    // Возвращаем результат
    return avgVolume; 
  };

  // Пока идет запись, пушим текущую громкость в массив
  useEffect(() => {
    if (isRecording) {
      volumeHistory.current.push(currentVolume);
    }
  }, [currentVolume, isRecording]);

  return {
    isRecording,
    recordingTime: recordingTime.toFixed(1),
    startRecording,
    stopRecording
  };
};
