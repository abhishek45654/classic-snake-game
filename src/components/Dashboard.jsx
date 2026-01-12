/**
 * Dashboard.jsx - Main game menu with multiple game options
 */
export default function Dashboard({ onGameSelect }) {
  const games = [
    {
      id: 'snake',
      name: 'Snake',
      emoji: '🐍',
      description: 'Classic arcade snake game. Eat food, grow longer, avoid yourself!',
      color: 'from-green-600 to-green-700',
      borderColor: 'border-green-500'
    },
    {
      id: 'tetris',
      name: 'Tetris',
      emoji: '🧱',
      description: 'Stack falling blocks and complete lines. Strategic puzzle gaming!',
      color: 'from-blue-600 to-blue-700',
      borderColor: 'border-blue-500'
    }
    // Future games can be added here
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
            🎮 GAME ARCADE
          </h1>
          <p className="text-gray-400 text-lg">Select a game to play</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onGameSelect(game.id)}
              className={`p-8 text-left bg-gradient-to-br ${game.color} hover:shadow-2xl rounded-lg transition duration-300 transform hover:scale-105 border ${game.borderColor}`}
            >
              <div className="text-5xl mb-4">{game.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{game.name}</h2>
              <p className="text-gray-100 mb-4">{game.description}</p>
              <div className="inline-block px-4 py-2 bg-black bg-opacity-30 rounded-lg text-sm font-semibold text-white">
                Click to Play →
              </div>
            </button>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <p className="text-gray-400 mb-2">
            <strong>More games coming soon!</strong>
          </p>
          <p className="text-gray-500 text-sm">
            Flappy Bird, 2048, Tetris, and more arcade classics...
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">Built with React + Vite</p>
        </div>
      </div>
    </div>
  );
}
