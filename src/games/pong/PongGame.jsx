import { useState } from 'react';
import { usePongGameLoop } from './usePongGameLoop';
import { PONG_WIDTH, PONG_HEIGHT, GAME_STATES, DIFFICULTY_LEVELS } from './pongConstants';

export default function PongGame({ difficulty = 'medium' }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const { canvasRef, gameData } = usePongGameLoop({ difficulty: selectedDifficulty });

  // Show difficulty selection if game hasn't started
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <h1 className="text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            PONG
          </h1>
          <p className="text-center text-gray-400 mb-12">vs AI</p>

          {/* Difficulty Selection */}
          <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Select Difficulty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Easy */}
              <button
                onClick={() => {
                  setSelectedDifficulty(DIFFICULTY_LEVELS.EASY);
                  setGameStarted(true);
                }}
                className={`p-6 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                  selectedDifficulty === DIFFICULTY_LEVELS.EASY
                    ? 'bg-green-600 border-2 border-green-400 text-white'
                    : 'bg-gray-700 border-2 border-green-500 text-green-400 hover:bg-green-700'
                }`}
              >
                <div className="text-2xl mb-2">🟢</div>
                Easy
                <div className="text-xs mt-2 opacity-75">Slower AI, easier to control</div>
              </button>

              {/* Medium */}
              <button
                onClick={() => {
                  setSelectedDifficulty(DIFFICULTY_LEVELS.MEDIUM);
                  setGameStarted(true);
                }}
                className={`p-6 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                  selectedDifficulty === DIFFICULTY_LEVELS.MEDIUM
                    ? 'bg-yellow-600 border-2 border-yellow-400 text-white'
                    : 'bg-gray-700 border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-700'
                }`}
              >
                <div className="text-2xl mb-2">🟡</div>
                Medium
                <div className="text-xs mt-2 opacity-75">Balanced gameplay</div>
              </button>

              {/* Hard */}
              <button
                onClick={() => {
                  setSelectedDifficulty(DIFFICULTY_LEVELS.HARD);
                  setGameStarted(true);
                }}
                className={`p-6 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                  selectedDifficulty === DIFFICULTY_LEVELS.HARD
                    ? 'bg-red-600 border-2 border-red-400 text-white'
                    : 'bg-gray-700 border-2 border-red-500 text-red-400 hover:bg-red-700'
                }`}
              >
                <div className="text-2xl mb-2">🔴</div>
                Hard
                <div className="text-xs mt-2 opacity-75">Faster AI, challenging</div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="text-center text-gray-400">
            <p className="text-sm">Select a difficulty level to start playing</p>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="w-full max-w-6xl">
        {/* Header with difficulty display */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            PONG
          </h1>
          <button
            onClick={() => setGameStarted(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-semibold text-sm transition-colors"
          >
            Change Difficulty
          </button>
        </div>
        <p className="text-center text-gray-400 mb-6">
          vs AI - <span className="text-cyan-400 font-semibold">
            {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
          </span>
        </p>

        {/* Game Canvas */}
        <div className="flex justify-center mb-8 bg-black rounded-lg overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width={PONG_WIDTH}
            height={PONG_HEIGHT}
            className="block border-4 border-cyan-500"
          />
        </div>

        {/* Score Display */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            Player: <span className="text-green-400 font-bold text-lg">{gameData.score1}</span> | 
            Computer: <span className="text-cyan-400 font-bold text-lg">{gameData.score2}</span>
          </p>
        </div>

        {/* How to Play */}
        <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Controls</h3>
              <ul className="space-y-1 text-sm">
                <li><span className="text-cyan-400 font-semibold">W / ↑</span> - Move paddle up</li>
                <li><span className="text-cyan-400 font-semibold">S / ↓</span> - Move paddle down</li>
                <li><span className="text-cyan-400 font-semibold">SPACE</span> - Start/Pause/Resume</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Objective</h3>
              <ul className="space-y-1 text-sm">
                <li>• First to <span className="text-cyan-400 font-semibold">11 points</span> wins</li>
                <li>• Ball bounces off paddles and walls</li>
                <li>• Ball speed increases with each paddle hit</li>
                <li>• Hit ball at different heights for angle control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
