// Game board configuration
export const GRID_SIZE = 22; // Grid cells per dimension
export const CELL_SIZE = 30; // Pixels per grid cell

// Calculated canvas dimensions
export const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE; // 660px
export const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE; // 660px

// Game speed settings
export const BASE_SPEED = 100; // Base game loop interval in ms
export const MIN_SPEED = 50; // Minimum speed cap in ms
export const SPEED_INCREASE_RATE = 0.02; // Speed increase per point (2% per point)

// Game states
export const GAME_STATE = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  MENU: 'menu'
};

// Colors for rendering
export const COLORS = {
  SNAKE: '#4ade80', // Green for snake
  FOOD: '#f87171', // Red for food
  BACKGROUND: '#1f2937', // Dark background
  GRID: '#374151' // Grid lines (optional)
};

// Keyboard keys
export const KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  W: 'w',
  A: 'a',
  S: 's',
  D: 'd',
  SPACE: ' ',
  P: 'p'
};

// Direction vectors (normalized)
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 }
};
