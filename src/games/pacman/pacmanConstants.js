// Pac-Man Game Constants

// Canvas Settings
export const PACMAN_CANVAS_WIDTH = 880;
export const PACMAN_CANVAS_HEIGHT = 880;
export const PACMAN_CELL_SIZE = 40;
export const PACMAN_COLS = PACMAN_CANVAS_WIDTH / PACMAN_CELL_SIZE;  // 22
export const PACMAN_ROWS = PACMAN_CANVAS_HEIGHT / PACMAN_CELL_SIZE;  // 22

// Game States
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

// Game Configuration
export const BASE_SPEED = 150; // ms per move
export const GHOST_SPEED = 200; // ms per ghost move
export const GHOST_COUNT = 4;

// Direction Constants
export const DIRECTIONS = {
  UP: { x: 0, y: -1, key: 'ArrowUp' },
  DOWN: { x: 0, y: 1, key: 'ArrowDown' },
  LEFT: { x: -1, y: 0, key: 'ArrowLeft' },
  RIGHT: { x: 1, y: 0, key: 'ArrowRight' }
};

// Ghost Colors
export const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB847'];

// Power-up Duration
export const POWER_UP_DURATION = 8000; // 8 seconds

// Maze tiles
export const MAZE = [
  // Create a standard Pac-Man style maze
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,1,0,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Initialize pellets at all walkable positions
export const initializePellets = () => {
  const pellets = {};
  for (let y = 0; y < PACMAN_ROWS; y++) {
    for (let x = 0; x < PACMAN_COLS; x++) {
      if (MAZE[y] && MAZE[y][x] === 0) {
        pellets[`${x},${y}`] = { x, y, isPowerUp: Math.random() < 0.02 }; // 2% power-ups
      }
    }
  }
  return pellets;
};
