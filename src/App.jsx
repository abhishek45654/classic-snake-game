import { useState } from 'react';
import Dashboard from './components/Dashboard';
import GameSettings from './components/GameSettings';
import SnakeGame from './games/snake/SnakeGame';

function App() {
  const [screen, setScreen] = useState('dashboard'); // dashboard, gameSettings, snake
  const [speedMode, setSpeedMode] = useState('static');

  const handleGameSelect = (gameId) => {
    if (gameId === 'snake') {
      setScreen('gameSettings');
    }
  };

  const handleSpeedModeSelect = (mode) => {
    setSpeedMode(mode);
    setScreen('snake');
  };

  const handleBackToDashboard = () => {
    setScreen('dashboard');
  };

  const handleBackToSettings = () => {
    setScreen('gameSettings');
  };

  const handleExitGame = () => {
    setScreen('dashboard');
  };

  return (
    <>
      {screen === 'dashboard' && (
        <Dashboard onGameSelect={handleGameSelect} />
      )}
      {screen === 'gameSettings' && (
        <GameSettings 
          onPlay={handleSpeedModeSelect}
          onBackToMenu={handleBackToDashboard}
        />
      )}
      {screen === 'snake' && (
        <SnakeGame 
          speedMode={speedMode}
          onExit={handleExitGame}
        />
      )}
    </>
  );
}

export default App;
