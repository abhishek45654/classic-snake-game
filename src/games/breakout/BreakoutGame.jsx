import { useNavigate } from 'react-router-dom';
import { useBreakoutGameLoop } from './useBreakoutGameLoop';
import { BREAKOUT_WIDTH, BREAKOUT_HEIGHT, GAME_STATES } from './breakoutConstants';
import { useState } from 'react';

export default function BreakoutGame() {
  const navigate = useNavigate();
  const { canvasRef, gameData, highScores, handleCanvasClick, startNewGame } = useBreakoutGameLoop();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleBackToMenu = () => {
    navigate('/');
  };

  const handleRestart = () => {
    startNewGame();
  };

  if (showHowToPlay) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setShowHowToPlay(false)}
            className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-semibold transition-colors"
          >
            ← Back to Game
          </button>

          <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            How to Play
          </h1>

          <div className="space-y-8">
            {/* Objective */}
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Objective</h2>
              <p className="text-gray-300">
                Clear all energy tiles by bouncing the glowing orb with your paddle. Do not let the orb fall below the paddle!
              </p>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Controls</h2>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-green-400 font-semibold">← / →</span> - Move paddle left/right</li>
                <li><span className="text-green-400 font-semibold">SPACE</span> - Start/Pause/Resume</li>
                <li><span className="text-green-400 font-semibold">P</span> - Toggle pause</li>
                <li><span className="text-green-400 font-semibold">Click Canvas</span> - Start game</li>
              </ul>
            </div>

            {/* Scoring Rules */}
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Scoring</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Standard brick: <span className="text-yellow-400 font-semibold">+100 points</span></li>
                <li>• Reinforced brick: <span className="text-yellow-400 font-semibold">+200 points per hit</span></li>
                <li>• Special brick: <span className="text-yellow-400 font-semibold">+300 points</span></li>
                <li>• Level complete bonus: <span className="text-yellow-400 font-semibold">+1000 points</span></li>
                <li>• Life bonus: <span className="text-yellow-400 font-semibold">+250 per remaining life</span></li>
              </ul>
            </div>

            {/* Combo System */}
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Combo System</h2>
              <p className="text-gray-300 mb-3">
                Your combo multiplier increases with consecutive brick hits. Hitting bricks without touching the paddle increases your multiplier up to 5x!
              </p>
              <p className="text-gray-400 text-sm">
                Combo resets when the ball touches your paddle or is lost.
              </p>
            </div>

            {/* Power-ups */}
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Power-Ups</h2>
              <p className="text-gray-300 mb-4">
                Power-ups drop randomly from destroyed bricks. Catch them with your paddle to activate:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><span className="text-green-400 font-semibold">Expand Paddle</span> - Increase paddle size</li>
                <li><span className="text-green-400 font-semibold">Multi Ball</span> - Launch additional balls</li>
                <li><span className="text-green-400 font-semibold">Slow Motion</span> - Reduce ball speed temporarily</li>
                <li><span className="text-green-400 font-semibold">Shield</span> - Protect against one ball loss</li>
                <li><span className="text-green-400 font-semibold">Laser</span> - Destroy bricks directly</li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Pro Tips</h2>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Hit the ball at different points on the paddle to control its angle</li>
                <li>• Build up your combo for higher scores</li>
                <li>• Each level increases in difficulty</li>
                <li>• Reinforce bricks require multiple hits - plan your shots!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowHowToPlay(false)}
            className="mt-8 w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToMenu}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-semibold text-sm transition-colors"
          >
            ← Back to Menu
          </button>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Neon Brickfall
          </h1>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-semibold text-sm transition-colors"
          >
            How to Play ?
          </button>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-8 bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-cyan-500">
          <canvas
            ref={canvasRef}
            width={BREAKOUT_WIDTH}
            height={BREAKOUT_HEIGHT}
            onClick={handleCanvasClick}
            className="block cursor-pointer"
          />
        </div>

        {/* Game Info Bar */}
        <div className="flex justify-between items-center mb-8 bg-gray-800 border-2 border-cyan-500 rounded-lg p-4">
          <div className="text-center flex-1">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-yellow-400 font-bold text-2xl">{gameData.score}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-gray-400 text-sm">Level</p>
            <p className="text-cyan-400 font-bold text-2xl">{gameData.level}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-gray-400 text-sm">Lives</p>
            <p className="text-red-400 font-bold text-2xl">❤️ × {gameData.lives}</p>
          </div>
        </div>

        {/* Ball Lost Message */}
        {gameData.gameStatus === GAME_STATES.PLAYING && !gameData.ball.active && gameData.lives > 0 && (
          <div className="text-center mb-8 p-4 bg-blue-900 border-2 border-blue-400 rounded-lg">
            <p className="text-blue-200 text-lg font-semibold">Ball Lost! Press SPACE to continue</p>
          </div>
        )}

        {/* Game Status */}
        {gameData.gameStatus === GAME_STATES.GAME_OVER && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over!</h2>
            <p className="text-gray-300 mb-4">
              Final Score: <span className="text-yellow-400 font-bold text-2xl">{gameData.score}</span>
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {gameData.gameStatus === GAME_STATES.LEVEL_COMPLETE && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Level Complete!</h2>
            <p className="text-gray-300 mb-4">
              Current Score: <span className="text-yellow-400 font-bold text-2xl">{gameData.score}</span>
            </p>
            <p className="text-gray-400 mb-6 text-sm">Press SPACE to continue to the next level</p>
          </div>
        )}

        {/* High Scores */}
        <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Top Scores</h2>
          {highScores.length > 0 ? (
            <div className="space-y-2">
              {highScores.map((hs, idx) => (
                <div key={idx} className="flex justify-between text-gray-300">
                  <span>#{idx + 1}</span>
                  <span className="text-yellow-400 font-semibold">{hs.score}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(hs.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No high scores yet. Start playing!</p>
          )}
        </div>

        {/* How to Play */}
        <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Objective</h3>
              <p className="text-sm mb-4">
                Clear all energy tiles by bouncing the glowing orb with your paddle. Do not let the orb fall below the paddle!
              </p>

              <h3 className="text-lg font-semibold text-green-400 mb-2">Controls</h3>
              <ul className="space-y-1 text-sm mb-4">
                <li><span className="text-cyan-400 font-semibold">← / →</span> - Move paddle</li>
                <li><span className="text-cyan-400 font-semibold">SPACE</span> - Start/Pause</li>
                <li><span className="text-cyan-400 font-semibold">P</span> - Toggle pause</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Scoring</h3>
              <ul className="space-y-1 text-sm mb-4">
                <li>• Standard: <span className="text-yellow-400">+100</span></li>
                <li>• Reinforced: <span className="text-yellow-400">+200 per hit</span></li>
                <li>• Special: <span className="text-yellow-400">+300</span></li>
                <li>• Level clear: <span className="text-yellow-400">+1000</span></li>
              </ul>

              <h3 className="text-lg font-semibold text-green-400 mb-2">Combo System</h3>
              <p className="text-sm">Hit bricks without touching the paddle to build up your combo multiplier (max 5x)!</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Power-Ups</h3>
            <p className="text-sm text-gray-400">
              Expand Paddle • Multi Ball • Slow Motion • Shield • Laser
            </p>
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="mt-4 w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold transition-colors text-sm"
          >
            View Full Guide
          </button>
        </div>
      </div>
    </div>
  );
}
