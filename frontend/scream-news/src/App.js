import React from 'react';
// Импортируем наш компонент. 
// Путь './ScreamScrollNews' означает, что файл лежит в той же папке.
import ScreamScrollNews from './ScreamScrollNews'; 

function App() {
  return (
    <div className="App">
      {/* Используем компонент здесь */}
      <ScreamScrollNews />
    </div>
  );
}

export default App;
