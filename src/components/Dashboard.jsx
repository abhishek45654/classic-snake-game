/**
 * Dashboard.jsx - Main game menu with multiple game options
 */
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

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
    },
    {
      id: 'pacman',
      name: 'Pac-Man',
      emoji: '👻',
      description: 'Navigate the maze, eat pellets, and avoid the ghosts!',
      color: 'from-yellow-600 to-yellow-700',
      borderColor: 'border-yellow-500'
    },
    {
      id: 'pong',
      name: 'Pong',
      emoji: '🏓',
      description: 'Classic Pong vs AI. Reach 11 points to win the match!',
      color: 'from-cyan-600 to-blue-600',
      borderColor: 'border-cyan-500'
    },
    {
      id: 'breakout',
      name: 'Neon Brickfall',
      emoji: '💥',
      description: 'Modern breakout game. Shatter tiles with your glowing orb!',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500'
    },
    {
      id: 'genzgame',
      name: 'GENZGAME',
      emoji: '✨',
      description: 'Bounce. Break. Flex. Modern arcade paddle-and-orb chaos!',
      color: 'from-pink-600 to-cyan-600',
      borderColor: 'border-pink-500'
    }
    // Future games can be added here
  ];

  const handleGameSelect = (gameId) => {
    if (gameId === 'snake') {
      navigate('/game/snake/settings');
    } else if (gameId === 'tetris') {
      navigate('/game/tetris');
    } else if (gameId === 'pacman') {
      navigate('/game/pacman');
    } else if (gameId === 'pong') {
      navigate('/game/pong');
    } else if (gameId === 'breakout') {
      navigate('/game/breakout');
    } else if (gameId === 'genzgame') {
      navigate('/game/genzgame');
    }
  };

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
              onClick={() => handleGameSelect(game.id)}
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
            Flappy Bird, 2048, Pac-Man, and more arcade classics...
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">Built with React + Vite + React Router</p>
        </div>
      </div>
    </div>
  );
}
