import { useEffect } from 'react';
import { useTetrisGameLoop } from './useTetrisGameLoop.js';
import { TETRIS_CANVAS_WIDTH, TETRIS_CANVAS_HEIGHT } from './tetrisConstants.js';

/**
 * TetrisGame.jsx - Tetris game component
 */
export default function TetrisGame({ onExit }) {
  const {
    canvasRef,
    gameStatus,
    score,
    level,
    lines,
    highScore,
    startGame,
    handleKeyPress,
    handleKeyUp,
    restartGame,
    resumeGame,
    quitGame
  } = useTetrisGameLoop();

  // Handle keyboard input
  useEffect(() => {
    const downHandler = (e) => {
      // Prevent page scroll for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      handleKeyPress(e.key);
    };

    const upHandler = (e) => {
      handleKeyUp(e.key);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [handleKeyPress, handleKeyUp]);

  // Start game on mount
  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onExit}
            className="mb-4 text-gray-400 hover:text-white transition text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-bold text-blue-400 mb-2">🧱 TETRIS</h1>
          <p className="text-gray-400">Classic falling blocks puzzle game</p>
        </div>

        {/* Main Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="flex justify-center bg-gray-800 rounded-lg p-4 border border-gray-700">
              <canvas
                ref={canvasRef}
                width={TETRIS_CANVAS_WIDTH}
                height={TETRIS_CANVAS_HEIGHT}
                className="border-2 border-gray-700 rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Game Info Panel */}
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Current Score</p>
              <p className="text-4xl font-bold text-blue-400">{score}</p>
            </div>

            {/* High Score */}
            <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
              <p className="text-yellow-200 text-sm uppercase tracking-wider mb-2 font-bold">🏆 High Score</p>
              <p className="text-4xl font-bold text-yellow-300">{highScore}</p>
              <p className="text-xs text-yellow-100 mt-2">Your best game</p>
            </div>

            {/* Level */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Level</p>
              <p className="text-4xl font-bold text-yellow-400">{level}</p>
              <p className="text-xs text-gray-500 mt-2">Speed increases per level</p>
            </div>

            {/* Lines */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Lines</p>
              <p className="text-4xl font-bold text-green-400">{lines}</p>
              <p className="text-xs text-gray-500 mt-2">Completed rows</p>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          {(gameStatus === 'playing' || gameStatus === 'menu') && (
            <div className="text-center">
              <p className="text-gray-300 text-lg mb-4">
                {gameStatus === 'menu' ? '🎮 Ready to Play?' : '▶️ PLAYING'}
              </p>
              <div className="grid grid-cols-2 gap-4 text-left text-sm mb-4">
                <div>
                  <p className="text-gray-400 mb-2">Movement</p>
                  <p className="text-gray-300">
                    <span className="font-mono text-blue-400">← →</span> Move<br/>
                    <span className="font-mono text-blue-400">↑</span> Rotate<br/>
                    <span className="font-mono text-blue-400">↓</span> Speed Up
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Actions</p>
                  <p className="text-gray-300">
                    <span className="font-mono text-blue-400">SPACE</span> Hard Drop<br/>
                    <span className="font-mono text-blue-400">P</span> Pause<br/>
                    <span className="font-mono text-orange-400">✨</span> Smart pieces
                  </p>
                </div>
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
              <p className="text-gray-400 mb-4">Press P to resume</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resumeGame}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                  Resume
                </button>
                <button
                  onClick={quitGame}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                  Quit
                </button>
              </div>
            </div>
          )}

          {gameStatus === 'gameOver' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-6">GAME OVER</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Final Score</p>
                  <p className="text-2xl font-bold text-blue-400">{score}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Level Reached</p>
                  <p className="text-2xl font-bold text-yellow-400">{level}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Lines Cleared</p>
                  <p className="text-2xl font-bold text-green-400">{lines}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">Best Score: {highScore}</p>
              <button
                onClick={restartGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-300 font-semibold mb-3">How to Play</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use arrow keys to move pieces left and right</li>
            <li>• Press UP arrow or W to rotate pieces</li>
            <li>• Press SPACE to drop pieces instantly (hard drop)</li>
            <li>• Complete horizontal lines to clear them and score points</li>
            <li>• Earn more points by clearing multiple lines at once</li>
            <li>• The game gets faster as you advance to higher levels</li>
            <li>• Game ends when blocks reach the top of the board</li>
            <li>• Your high score is saved automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
