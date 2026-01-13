// Breakout Game Constants - Neon Brickfall

// Canvas dimensions
export const BREAKOUT_WIDTH = 800;
export const BREAKOUT_HEIGHT = 600;

// Ball properties
export const BALL_RADIUS = 8;
export const INITIAL_BALL_SPEED = 5;
export const MAX_BALL_SPEED = 12;

// Paddle properties
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 15;
export const PADDLE_SPEED = 8;
export const PADDLE_MARGIN_BOTTOM = 20;

// Brick properties
export const BRICK_WIDTH = 70;
export const BRICK_HEIGHT = 20;
export const BRICK_PADDING = 10;
export const BRICK_ROWS = 4;
export const BRICK_COLS = 10;

// Brick types
export const BRICK_TYPES = {
  STANDARD: 'standard',
  REINFORCED: 'reinforced',
  SPECIAL: 'special'
};

// Colors (Neon theme)
export const COLORS = {
  background: '#0a0e27',
  paddle: '#00ff88',
  ball: '#ffff00',
  brickStandard: '#00ccff',
  brickReinforced: '#ff00ff',
  brickSpecial: '#ff6600',
  brickDestructed: '#ff0088',
  text: '#ffffff',
  glow: '#00ff88'
};

// Game states
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  LEVEL_COMPLETE: 'levelComplete'
};

// Scoring
export const SCORES = {
  STANDARD_BRICK: 100,
  REINFORCED_BRICK: 200,
  SPECIAL_BRICK: 300,
  LEVEL_COMPLETE: 1000,
  LIFE_BONUS: 250,
  POWERUP: 150
};

// Combo multiplier settings
export const COMBO_SETTINGS = {
  MIN: 1,
  MAX: 5,
  INCREMENT_INTERVAL: 3 // Every 3 hits
};

// Power-up types
export const POWERUP_TYPES = {
  EXPAND_PADDLE: 'expandPaddle',
  MULTI_BALL: 'multiBall',
  SLOW_MOTION: 'slowMotion',
  SHIELD: 'shield',
  LASER: 'laser'
};

// High score storage key
export const HIGH_SCORES_KEY = 'neon_brickfall_highscores';
export const MAX_HIGH_SCORES = 10;

// Levels configuration
export const LEVELS = {
  1: {
    name: 'Level 1',
    ballSpeed: 5,
    lives: 3,
    brickLayout: 'standard'
  },
  2: {
    name: 'Level 2',
    ballSpeed: 6,
    lives: 3,
    brickLayout: 'mixed'
  },
  3: {
    name: 'Level 3',
    ballSpeed: 7,
    lives: 2,
    brickLayout: 'challenging'
  },
  4: {
    name: 'Level 4',
    ballSpeed: 8,
    lives: 2,
    brickLayout: 'hardcore'
  }
};
