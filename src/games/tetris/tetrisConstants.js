// Tetris game board dimensions
export const TETRIS_COLS = 12;  // Increased from 10
export const TETRIS_ROWS = 24;  // Increased from 20
export const TETRIS_CELL_SIZE = 25; // Slightly reduced to fit larger board
export const TETRIS_CANVAS_WIDTH = TETRIS_COLS * TETRIS_CELL_SIZE; // 300px
export const TETRIS_CANVAS_HEIGHT = TETRIS_ROWS * TETRIS_CELL_SIZE; // 600px

// Game speeds (ms per move down)
export const TETRIS_BASE_SPEED = 800; // Reduced from 1000
export const TETRIS_MAX_SPEED = 100;   // Reduced from 200 (faster max)
export const TETRIS_SPEED_INCREASE = 40; // Speed increase per level

// Tetromino pieces (7 types)
export const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0' // Cyan
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#f0f000' // Yellow
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#a000f0' // Purple
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00f000' // Green
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#f00000' // Red
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#0000f0' // Blue
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#f0a000' // Orange
  }
};

export const TETROMINO_TYPES = Object.keys(TETROMINOS);

// Game states
export const GAME_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  MENU: 'menu'
};

// Animation timing
export const LINE_CLEAR_ANIMATION_DURATION = 400; // ms for line clearing effect
export const LINE_CLEAR_BLINK_COUNT = 4; // Number of blinks before clearing

// Scoring rules
export const TETRIS_SCORES = {
  SINGLE_LINE: 100,
  DOUBLE_LINE: 300,
  TRIPLE_LINE: 500,
  TETRIS_LINE: 800 // All 4 lines at once
};

// Colors
export const TETRIS_COLORS = {
  BACKGROUND: '#0a0e27',
  GRID: '#1a1f3a',
  GHOST: '#666666',
  TEXT_PRIMARY: '#e0e0e0',
  TEXT_SECONDARY: '#888888'
};
