import { PACMAN_COLS, PACMAN_ROWS, DIRECTIONS, MAZE, initializePellets } from './pacmanConstants.js';

/**
 * Check if a position is a valid walkable tile
 */
export const isValidPosition = (x, y) => {
  if (x < 0 || x >= PACMAN_COLS || y < 0 || y >= PACMAN_ROWS) {
    return false;
  }
  return MAZE[y] && MAZE[y][x] === 0;
};

/**
 * Handle ghost movement with basic AI (random valid direction)
 */
export const getGhostNextMove = (ghostX, ghostY) => {
  const possibleDirections = [];
  
  Object.values(DIRECTIONS).forEach(direction => {
    const newX = ghostX + direction.x;
    const newY = ghostY + direction.y;
    if (isValidPosition(newX, newY)) {
      possibleDirections.push(direction);
    }
  });

  if (possibleDirections.length === 0) return null;
  return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
};

/**
 * Check if Pac-Man collides with any ghost
 */
export const checkGhostCollision = (pacmanPos, ghosts, isPowerUpMode) => {
  for (let i = 0; i < ghosts.length; i++) {
    const ghost = ghosts[i];
    if (pacmanPos.x === ghost.x && pacmanPos.y === ghost.y) {
      return isPowerUpMode ? i : true; // Return ghost index if power-up mode
    }
  }
  return false;
};

/**
 * Get the next valid position for Pac-Man
 */
export const getNextPosition = (currentPos, direction) => {
  const newX = currentPos.x + direction.x;
  const newY = currentPos.y + direction.y;
  
  if (isValidPosition(newX, newY)) {
    return { x: newX, y: newY };
  }
  
  return currentPos; // Stay in place if can't move
};

/**
 * Initialize game state
 */
export const initializeGame = () => {
  return {
    pacmanPos: { x: 1, y: 1 },
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
    ghosts: [
      { x: 10, y: 9, color: '#FF0000' },    // Red ghost
      { x: 10, y: 10, color: '#FFB8FF' },   // Pink ghost
      { x: 11, y: 9, color: '#00FFFF' },    // Cyan ghost
      { x: 11, y: 10, color: '#FFB847' }    // Orange ghost
    ],
    pellets: initializePellets(),
    score: 0,
    pelletsEaten: 0,
    isPowerUpMode: false,
    powerUpTime: 0,
    lives: 3,
    isGameOver: false
  };
};

/**
 * Render the game on canvas
 */
export const renderGame = (ctx, width, height, cellSize, state) => {
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // Draw maze walls
  ctx.fillStyle = '#0066FF';
  for (let y = 0; y < PACMAN_ROWS; y++) {
    for (let x = 0; x < PACMAN_COLS; x++) {
      if (MAZE[y] && MAZE[y][x] === 1) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw pellets
  Object.values(state.pellets).forEach(pellet => {
    if (pellet.isPowerUp) {
      // Power-ups: blinking large glowing circles
      const pulse = Math.sin(Date.now() / 200) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 215, 0, ${0.7 + pulse * 0.3})`; // Gold with glow
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(
        pellet.x * cellSize + cellSize / 2,
        pellet.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Regular pellets: small dots
      ctx.fillStyle = '#FFB897';
      ctx.beginPath();
      ctx.arc(
        pellet.x * cellSize + cellSize / 2,
        pellet.y * cellSize + cellSize / 2,
        2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  });

  // Draw ghosts
  state.ghosts.forEach(ghost => {
    ctx.fillStyle = state.isPowerUpMode ? '#1111FF' : ghost.color; // Blue when vulnerable
    ctx.fillRect(ghost.x * cellSize, ghost.y * cellSize, cellSize, cellSize);
  });

  // Draw Pac-Man
  if (state.isPowerUpMode) {
    // Powered-up: Blue with white border and glow
    ctx.fillStyle = '#1111FF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;
  } else {
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = 'rgba(255, 255, 0, 0.3)';
    ctx.shadowBlur = 8;
  }
  
  const pacX = state.pacmanPos.x * cellSize + cellSize / 2;
  const pacY = state.pacmanPos.y * cellSize + cellSize / 2;
  const mouthAngle = (Date.now() / 100) % Math.PI / 2; // Animated mouth
  
  // Calculate rotation based on direction
  let rotation = 0;
  if (state.direction === DIRECTIONS.RIGHT) rotation = 0;
  else if (state.direction === DIRECTIONS.DOWN) rotation = Math.PI / 2;
  else if (state.direction === DIRECTIONS.LEFT) rotation = Math.PI;
  else if (state.direction === DIRECTIONS.UP) rotation = (Math.PI * 3) / 2;
  
  ctx.save();
  ctx.translate(pacX, pacY);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.arc(0, 0, cellSize / 2 - 2, mouthAngle, Math.PI * 2 - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.fill();
  
  // Add white border if powered up
  if (state.isPowerUpMode) {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.shadowBlur = 0;
};
