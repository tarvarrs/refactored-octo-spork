import React from 'react';
import './VolumeMeter.css';

const VolumeMeter = ({ volume = 0 }) => {
  // Нормализуем для CSS (не больше 100%)
  const safeVolume = Math.min(Math.max(volume, 0), 100);
  
  return (
    <div className="volume-meter-container">
      <div className="volume-label">
        <span>Микрофон</span>
        <span>{Math.round(safeVolume)}%</span>
      </div>
      <div className="meter-track">
        <div 
          className="meter-fill" 
          style={{ 
            width: `${safeVolume}%`,
            backgroundColor: safeVolume > 80 ? '#ff4444' : '#4caf50' 
          }}
        />
      </div>
      {safeVolume > 80 && <div className="scream-warning">😱 ААААА!!!</div>}
    </div>
  );
};

export default VolumeMeter;
