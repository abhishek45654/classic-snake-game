import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacmanGameLoop } from './usePacmanGameLoop.js';
import { PACMAN_CANVAS_WIDTH, PACMAN_CANVAS_HEIGHT } from './pacmanConstants.js';

/**
 * PacmanGame.jsx - Main Pac-Man game component
 */
export default function PacmanGame() {
  const navigate = useNavigate();

  const {
    canvasRef,
    gameState,
    score,
    highScore,
    lives,
    startGame,
    handleKeyPress,
    restartGame,
    quitGame
  } = usePacmanGameLoop();

  const handleExit = () => {
    quitGame();
    navigate('/');
  };

  useEffect(() => {
    const handler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === 'menu') {
      startGame();
    }
  }, [gameState, startGame]);

  const handleQuitToMenu = () => {
    quitGame();
    setTimeout(handleExit, 300);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleExit}
            className="mb-4 text-gray-400 hover:text-white transition text-sm"
          >
            ← Back to Menu
          </button>
          <h1 className="text-5xl font-bold text-yellow-400 mb-2">👻 PAC-MAN 👻</h1>
        </div>

        {/* Game Container */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Game Canvas */}
          <div className="flex-1">
            <canvas
              ref={canvasRef}
              width={PACMAN_CANVAS_WIDTH}
              height={PACMAN_CANVAS_HEIGHT}
              className="border-4 border-yellow-500 rounded-lg shadow-2xl w-full bg-black"
            />
          </div>

          {/* Info Panel - Right Side */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Current Score */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Score</p>
              <p className="text-4xl font-bold text-yellow-400">{score}</p>
            </div>

            {/* High Score */}
            <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
              <p className="text-yellow-200 text-sm uppercase tracking-wider mb-2 font-bold">🏆 High Score</p>
              <p className="text-4xl font-bold text-yellow-300">{highScore}</p>
            </div>

            {/* Lives */}
            <div className="bg-red-900 rounded-lg p-6 border border-red-700">
              <p className="text-red-200 text-sm uppercase tracking-wide mb-2">Lives</p>
              <p className="text-4xl font-bold text-red-400">{'❤️'.repeat(lives)}</p>
            </div>

            {/* Game Status */}
            {gameState === 'gameOver' && (
              <div className="bg-red-700 rounded-lg p-6 border-2 border-red-500 text-center">
                <p className="text-white text-xl font-bold mb-4">GAME OVER!</p>
                <button
                  onClick={restartGame}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition"
                >
                  Play Again
                </button>
              </div>
            )}

            {gameState === 'paused' && (
              <div className="bg-blue-700 rounded-lg p-6 border-2 border-blue-500 text-center">
                <p className="text-white text-xl font-bold">PAUSED</p>
                <p className="text-blue-200 text-sm mt-2">Press SPACE to resume</p>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="bg-green-800 rounded-lg p-6 border border-green-700">
                <p className="text-green-200 text-sm uppercase tracking-wide">Status</p>
                <p className="text-xl font-bold text-green-400">Playing</p>
              </div>
            )}

            {/* Controls */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-8">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-3 font-bold">Controls</p>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>↑↓←→ or WASD - Move</li>
                <li>SPACE - Pause/Resume</li>
                <li>ENTER - Restart Game</li>
              </ul>
            </div>

            {/* Quit Button */}
            {(gameState === 'paused' || gameState === 'playing') && (
              <button
                onClick={handleQuitToMenu}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Quit to Menu
              </button>
            )}
          </div>
        </div>

        {/* How to Play - Below Game */}
        <div className="mt-8 w-full">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-4 font-bold">How to Play</p>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>🟡 Eat all the pellets to win</li>
              <li>⭐ Power-ups make ghosts edible for 8 seconds</li>
              <li>👻 Avoid the ghosts or eat them when powered up!</li>
              <li>❤️ You have 3 lives - lose them all and it's game over</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
