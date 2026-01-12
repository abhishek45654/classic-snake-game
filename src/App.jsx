import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import GameSettings from './components/GameSettings';
import SnakeGame from './games/snake/SnakeGame';
import TetrisGame from './games/tetris/TetrisGame';

function App() {
  const [speedMode, setSpeedMode] = useState('static');

  const handleSpeedModeSelect = (mode) => {
    setSpeedMode(mode);
  };

  return (
    <Router basename="/classic-snake-game">
      <Routes>
        {/* Dashboard - Home Page */}
        <Route path="/" element={<Dashboard />} />

        {/* Snake Game Settings Route */}
        <Route 
          path="/game/snake/settings" 
          element={<GameSettings onSpeedModeSelect={handleSpeedModeSelect} />} 
        />

        {/* Snake Game Route */}
        <Route 
          path="/game/snake" 
          element={<SnakeGame speedMode={speedMode} />} 
        />

        {/* Tetris Game Route - No settings needed */}
        <Route 
          path="/game/tetris" 
          element={<TetrisGame />} 
        />

        {/* Fallback - Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
