/**
 * GameSettings.jsx - Speed mode selection for Snake game
 */
export default function GameSettings({ onPlay, onBackToMenu }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBackToMenu}
            className="mb-6 text-gray-400 hover:text-white transition text-sm"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-green-400 mb-2">🐍 SNAKE</h1>
          <p className="text-gray-400">Choose Speed Mode</p>
        </div>

        {/* Speed Mode Selection */}
        <div className="space-y-4 bg-gray-800 rounded-lg p-8 border border-gray-700">
          {/* Static Mode */}
          <button
            onClick={() => onPlay('static')}
            className="w-full p-6 text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition duration-200 transform hover:scale-105 border border-blue-500"
          >
            <h3 className="text-xl font-bold text-white mb-2">⏱️ Static Speed</h3>
            <p className="text-blue-100 text-sm">
              Snake maintains a constant speed throughout the game. No automatic speed increases. Adjust speed manually with +/- buttons.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-blue-500 rounded text-xs font-semibold text-white">
                Steady & Predictable
              </span>
            </div>
          </button>

          {/* Incremental Mode */}
          <button
            onClick={() => onPlay('incremental')}
            className="w-full p-6 text-left bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition duration-200 transform hover:scale-105 border border-purple-500"
          >
            <h3 className="text-xl font-bold text-white mb-2">📈 Incremental Speed</h3>
            <p className="text-purple-100 text-sm">
              Speed increases gradually with each food eaten. The higher your score, the faster the game gets. Classic arcade difficulty!
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-purple-500 rounded text-xs font-semibold text-white">
                Progressive Challenge
              </span>
            </div>
          </button>

          {/* Progressive Mode */}
          <button
            onClick={() => onPlay('progressive')}
            className="w-full p-6 text-left bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition duration-200 transform hover:scale-105 border border-red-500"
          >
            <h3 className="text-xl font-bold text-white mb-2">⚡ Progressive Speed</h3>
            <p className="text-red-100 text-sm">
              Like incremental mode, but you also control speed manually. Speed increases with score AND you can fine-tune with +/- buttons. Maximum control!
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-red-500 rounded text-xs font-semibold text-white">
                Full Control & Challenge
              </span>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="mt-12 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-gray-300 font-semibold mb-3">About Speed Modes</h3>
          <p className="text-gray-400 text-sm mb-3">
            <strong>Static:</strong> Best for relaxed play and learning controls.
          </p>
          <p className="text-gray-400 text-sm mb-3">
            <strong>Incremental:</strong> Classic snake experience with automatic difficulty scaling.
          </p>
          <p className="text-gray-400 text-sm">
            <strong>Progressive:</strong> Expert mode with both automatic and manual speed control.
          </p>
        </div>
      </div>
    </div>
  );
}
