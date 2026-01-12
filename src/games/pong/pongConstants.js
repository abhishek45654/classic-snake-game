// Pong Game Constants

// Board dimensions
export const PONG_WIDTH = 1000;
export const PONG_HEIGHT = 600;

// Ball properties
export const BALL_RADIUS = 8;
export const INITIAL_BALL_SPEED = 5;
export const MAX_BALL_SPEED = 12;

// Paddle properties
export const PADDLE_WIDTH = 12;
export const PADDLE_HEIGHT = 100;
export const PADDLE_SPEED = 7;
export const PADDLE_MARGIN = 20; // Distance from edge

// Game settings
export const WINNING_SCORE = 11;
export const NET_WIDTH = 2;
export const NET_DASH_HEIGHT = 10;
export const NET_GAP = 10;

// Colors
export const COLORS = {
  background: '#0f0f1e',
  primary: '#00ff88',
  secondary: '#00ccff',
  accent: '#ff00ff',
  ball: '#ffff00',
  text: '#ffffff',
  paddle1: '#00ff88',
  paddle2: '#00ccff',
  net: '#666666'
};

// Game states
export const GAME_STATES = {
  INITIAL: 'initial',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const DIFFICULTY_SETTINGS = {
  easy: {
    name: 'Easy',
    aiSpeed: 4,
    ballSpeed: 4,
    ballAcceleration: 1.02
  },
  medium: {
    name: 'Medium',
    aiSpeed: 6,
    ballSpeed: 5,
    ballAcceleration: 1.04
  },
  hard: {
    name: 'Hard',
    aiSpeed: 7,
    ballSpeed: 6,
    ballAcceleration: 1.06
  }
};
