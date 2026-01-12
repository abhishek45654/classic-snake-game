import { useState } from 'react';
import Dashboard from './components/Dashboard';
import GameSettings from './components/GameSettings';
import SnakeGame from './games/snake/SnakeGame';
import TetrisGame from './games/tetris/TetrisGame';

function App() {
  const [screen, setScreen] = useState('dashboard'); // dashboard, gameSettings, snake, tetris
  const [currentGame, setCurrentGame] = useState(null); // snake or tetris
  const [speedMode, setSpeedMode] = useState('static');

  const handleGameSelect = (gameId) => {
    setCurrentGame(gameId);
    setScreen('gameSettings');
  };

  const handleSpeedModeSelect = (mode) => {
    setSpeedMode(mode);
    setScreen('snake');
  };

  const handleTetrisStart = () => {
    setScreen('tetris');
  };

  const handleBackToDashboard = () => {
    setScreen('dashboard');
    setCurrentGame(null);
  };

  const handleBackToSettings = () => {
    setScreen('gameSettings');
  };

  const handleExitGame = () => {
    setScreen('dashboard');
    setCurrentGame(null);
  };

  return (
    <>
      {screen === 'dashboard' && (
        <Dashboard onGameSelect={handleGameSelect} />
      )}
      {screen === 'gameSettings' && (
        <GameSettings 
          gameId={currentGame}
          onPlay={currentGame === 'snake' ? handleSpeedModeSelect : handleTetrisStart}
          onBackToMenu={handleBackToDashboard}
        />
      )}
      {screen === 'snake' && (
        <SnakeGame 
          speedMode={speedMode}
          onExit={handleExitGame}
        />
      )}
      {screen === 'tetris' && (
        <TetrisGame 
          onExit={handleExitGame}
        />
      )}
    </>
  );
}

export default App;
