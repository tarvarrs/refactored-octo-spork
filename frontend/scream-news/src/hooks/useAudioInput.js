import { useState, useEffect, useRef } from 'react';

export const useAudioInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false); // Флаг калибровки
  const [volume, setVolume] = useState(0);
  const [noiseFloor, setNoiseFloor] = useState(10); // Шум комнаты (по дефолту 10)
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);
  const sourceRef = useRef(null);

  // Массив для сбора данных во время калибровки
  const calibrationDataRef = useRef([]); 

  const initAudio = async () => {
    if (audioContextRef.current) return; // Уже инициализирован

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
    } catch (err) {
      setError("Нет доступа к микрофону");
      console.error(err);
      throw err;
    }
  };

  const analyze = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Считаем среднюю сырую громкость
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const rawAverage = sum / dataArray.length;

    if (isCalibrating) {
      // Если идет калибровка — просто собираем данные
      calibrationDataRef.current.push(rawAverage);
    } else {
      // Обычный режим: Вычитаем шум комнаты из сигнала
      // Если (Звук - Шум) < 0, то ставим 0
      const cleanVolume = Math.max(0, rawAverage - noiseFloor);
      
      // Умножаем на 2, чтобы легче достигать 100% (gain boost)
      const normalizedVolume = Math.min(Math.round(cleanVolume * 2), 100);
      setVolume(normalizedVolume);
    }

    rafIdRef.current = requestAnimationFrame(analyze);
  };

  const startCalibration = async () => {
    await initAudio(); // Убеждаемся, что микрофон включен
    
    setIsListening(true);
    setIsCalibrating(true);
    calibrationDataRef.current = []; // Очищаем буфер
    
    analyze(); // Запускаем цикл анализа

    // Через 2 секунды заканчиваем калибровку
    setTimeout(() => {
      setIsCalibrating(false);
      
      // Вычисляем средний шум
      const data = calibrationDataRef.current;
      if (data.length > 0) {
        const avgNoise = data.reduce((a, b) => a + b, 0) / data.length;
        // Ставим порог чуть выше среднего шума (+5 для надежности)
        setNoiseFloor(avgNoise + 5); 
        console.log("Калибровка завершена. Уровень шума:", avgNoise);
      }
    }, 2000);
  };

  const stopListening = () => {
    if (audioContextRef.current) audioContextRef.current.close();
    audioContextRef.current = null;
    cancelAnimationFrame(rafIdRef.current);
    setIsListening(false);
    setIsCalibrating(false);
    setVolume(0);
  };

  useEffect(() => () => stopListening(), []);

  return { 
    isListening, 
    isCalibrating, // Нужно, чтобы показать спиннер или текст "Тссс..."
    volume, 
    startCalibration, // Вызываем это вместо простого startListening
    stopListening, 
    error 
  };
};
