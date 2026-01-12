import { useEffect } from 'react';
import { useGameLoop } from './useGameLoop.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants.js';

/**
 * Game.jsx - Main game component
 * Uses simplified game loop that handles everything directly
 */
export default function Game() {
  const {
    canvasRef,
    gameStatus,
    score,
    highScore,
    finalScore,
    startGame,
    handleKeyPress,
    restartGame,
    speedMultiplier,
    isSpeedLocked,
    increaseSpeed,
    decreaseSpeed,
    toggleSpeedLock,
    quitGame
  } = useGameLoop();

  // Handle keyboard input
  useEffect(() => {
    const handler = (e) => {
      // Prevent page scroll for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  // Start game on mount
  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-400 mb-2">🐍 SNAKE</h1>
          <p className="text-gray-400">Classic arcade game with a modern twist</p>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Score</p>
            <p className="text-3xl font-bold text-green-400">{score}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm uppercase tracking-wide">High Score</p>
            <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
          </div>
        </div>

        {/* Speed Control Panel */}
        {(gameStatus === 'playing' || gameStatus === 'paused') && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Game Speed</p>
                <p className="text-2xl font-bold text-blue-400">{speedMultiplier.toFixed(1)}x</p>
                <p className="text-xs text-gray-500 mt-1">0.5x - 2.0x</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseSpeed}
                  disabled={isSpeedLocked || gameStatus === 'paused'}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  −
                </button>
                <button
                  onClick={increaseSpeed}
                  disabled={isSpeedLocked || gameStatus === 'paused'}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  +
                </button>
                <button
                  onClick={toggleSpeedLock}
                  disabled={gameStatus === 'paused'}
                  className={`font-bold py-2 px-4 rounded transition duration-200 ${
                    isSpeedLocked
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                >
                  {isSpeedLocked ? '🔒 Locked' : '🔓 Lock'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-700 rounded-lg shadow-xl"
          />
        </div>

        {/* Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {(gameStatus === 'playing' || gameStatus === 'menu') && (
            <div className="text-center">
              <p className="text-gray-300 text-lg mb-4">
                {gameStatus === 'menu' ? '🎮 Ready to Play?' : '▶️ PLAYING'}
              </p>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Controls</p>
                <p className="text-gray-300">
                  <span className="font-mono text-green-400">↑ ↓ ← →</span> or{' '}
                  <span className="font-mono text-green-400">WASD</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  <span className="font-mono text-green-400">SPACE</span> or{' '}
                  <span className="font-mono text-green-400">P</span> to pause
                </p>
              </div>
              {gameStatus === 'playing' && (
                <button
                  onClick={quitGame}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                  Quit Game
                </button>
              )}
            </div>
          )}

          {gameStatus === 'paused' && (
            <div className="text-center">
              <p className="text-yellow-400 text-2xl font-bold mb-4">⏸️ PAUSED</p>
              <p className="text-gray-400 mb-4">Press SPACE or P to resume</p>
              <button
                onClick={quitGame}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
              >
                Quit Game
              </button>
            </div>
          )}

          {gameStatus === 'gameOver' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-4">GAME OVER</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Final Score</p>
                  <p className="text-2xl font-bold text-red-400">{finalScore}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Best Score</p>
                  <p className="text-2xl font-bold text-yellow-400">{highScore}</p>
                </div>
              </div>
              <button
                onClick={() => restartGame()}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-300 font-semibold mb-2">How to Play</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use arrow keys or WASD to move the snake</li>
            <li>• Eat the red food to grow and score points</li>
            <li>• The snake wraps around screen edges</li>
            <li>• Don't hit yourself! That's game over</li>
            <li>• Game speed increases as you score more points</li>
            <li>• Use + and − buttons to adjust speed (0.5x to 2.0x)</li>
            <li>• Click Lock to freeze speed (prevents further changes)</li>
            <li>• Speed lock resets when game ends</li>
            <li>• Your high score is saved automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
