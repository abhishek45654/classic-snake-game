export const GRID_WIDTH = 12;
export const GRID_HEIGHT = 16;
export const CELL_SIZE = 40;

export const COLORS = {
  BACKGROUND: '#0f0f1e',
  ACCENT_1: '#a78bfa', // Purple
  ACCENT_2: '#06b6d4', // Cyan
  ACCENT_3: '#ec4899', // Hot Pink
  ACCENT_4: '#84cc16', // Lime
  TILE_SOFT: '#8b5cf6',
  TILE_HARD: '#d946ef',
  TILE_PULSE: '#06b6d4',
  ORB: '#fbbf24',
  PADDLE: 'rgba(167, 139, 250, 0.8)',
  PARTICLE: '#a78bfa'
};

export const GAME_CONFIG = {
  PADDLE_WIDTH: 3,
  PADDLE_HEIGHT: 0.5,
  ORB_RADIUS: 0.4,
  BASE_BALL_SPEED: 0.15,  // Reduced from 5 to reasonable speed
  MAX_BALL_SPEED: 0.25,    // Reduced from 12
  LIVES: 3,
  SOFT_TILE_POINTS: 100,
  HARD_TILE_POINTS: 200,
  PULSE_TILE_POINTS: 300,
  LEVEL_CLEAR_BONUS: 1000,
  POWER_DROP_POINTS: 150,
  LIFE_SAVED_POINTS: 250,
};
