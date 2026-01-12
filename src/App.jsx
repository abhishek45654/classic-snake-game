import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GameSettings from './components/GameSettings';
import SnakeGame from './games/snake/SnakeGame';
import TetrisGame from './games/tetris/TetrisGame';

// Wrapper component for SnakeGame to handle query parameters
function SnakeGameWrapper({ speedMode, onSpeedModeSelect }) {
  const [searchParams] = useSearchParams();
  const modeFromUrl = searchParams.get('mode');
  const finalMode = modeFromUrl || speedMode || 'static';

  return <SnakeGame speedMode={finalMode} onSpeedModeSelect={onSpeedModeSelect} />;
}

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

        {/* Snake Game Settings Route - Optional (redirects to game) */}
        <Route 
          path="/game/snake/settings" 
          element={<GameSettings onSpeedModeSelect={handleSpeedModeSelect} />} 
        />

        {/* Snake Game Route - Can be accessed directly with optional ?mode=speedMode parameter */}
        <Route 
          path="/game/snake" 
          element={<SnakeGameWrapper speedMode={speedMode} onSpeedModeSelect={handleSpeedModeSelect} />} 
        />

        {/* Tetris Game Route - Direct access */}
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
