import { HashRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import GameSettings from './components/GameSettings';
import SnakeGame from './games/snake/SnakeGame';
import TetrisGame from './games/tetris/TetrisGame';
import PacmanGame from './games/pacman/PacmanGame';
import PongGame from './games/pong/PongGame';
import BreakoutGame from './games/breakout/BreakoutGame';
import GenZGame from './games/genzgame/Game';

// Wrapper component for SnakeGame to handle query parameters
function SnakeGameWrapper({ speedMode, onSpeedModeSelect }) {
  const [searchParams] = useSearchParams();
  const modeFromUrl = searchParams.get('mode');
  const finalMode = modeFromUrl || speedMode || 'static';

  return <SnakeGame speedMode={finalMode} onSpeedModeSelect={onSpeedModeSelect} />;
}

// App content component - uses hooks inside Router context
function AppContent() {
  const [speedMode, setSpeedMode] = useState('static');

  const handleSpeedModeSelect = (mode) => {
    setSpeedMode(mode);
  };

  return (
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

      {/* Pac-Man Game Route - Direct access */}
      <Route 
        path="/game/pacman" 
        element={<PacmanGame />} 
      />

      {/* Pong Game Route - Direct access */}
      <Route 
        path="/game/pong" 
        element={<PongGame />} 
      />

      {/* Breakout Game Route - Direct access */}
      <Route 
        path="/game/breakout" 
        element={<BreakoutGame />} 
      />

      {/* GENZGAME Route - Direct access */}
      <Route 
        path="/game/genzgame" 
        element={<GenZGame onBack={() => window.location.hash = '/'} />} 
      />

      {/* Fallback - Redirect unknown routes to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
