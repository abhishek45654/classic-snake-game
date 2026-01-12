import { GRID_SIZE, DIRECTIONS, KEYS } from './constants.js';

/**
 * Normalizes a position to wrap around the grid (torus topology)
 * When snake exits one side, it enters the opposite side
 *
 * @param {number} value - Position value (x or y)
 * @param {number} gridSize - Size of the grid
 * @returns {number} Wrapped position value
 */
export const wrapAround = (value, gridSize = GRID_SIZE) => {
  return ((value % gridSize) + gridSize) % gridSize;
};

/**
 * Checks if two positions are equal
 *
 * @param {Object} pos1 - Position object with x, y
 * @param {Object} pos2 - Position object with x, y
 * @returns {boolean} True if positions are equal
 */
export const positionsEqual = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

/**
 * Generates a random grid-aligned position
 *
 * @param {number} gridSize - Size of the grid
 * @returns {Object} Random position with x, y coordinates
 */
export const getRandomGridPosition = (gridSize = GRID_SIZE) => {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
};

/**
 * Checks if a position collides with any position in an array
 * Used for snake self-collision detection
 *
 * @param {Object} position - Position to check
 * @param {Array} positions - Array of positions to check against
 * @returns {boolean} True if collision detected
 */
export const collidesWith = (position, positions) => {
  return positions.some(pos => positionsEqual(position, pos));
};

/**
 * Maps keyboard input to direction vector
 * Handles both arrow keys and WASD
 *
 * @param {string} key - Keyboard key pressed
 * @returns {Object|null} Direction vector or null if not a direction key
 */
export const keyToDirection = (key) => {
  // Arrow keys must be checked as-is (not lowercase)
  // Only WASD keys should be lowercased
  const lowerKey = key.toLowerCase();
  
  switch (key) {
    case KEYS.ARROW_UP:
      return DIRECTIONS.UP;
    case KEYS.ARROW_DOWN:
      return DIRECTIONS.DOWN;
    case KEYS.ARROW_LEFT:
      return DIRECTIONS.LEFT;
    case KEYS.ARROW_RIGHT:
      return DIRECTIONS.RIGHT;
    default:
      break;
  }
  
  // Check WASD keys (case-insensitive)
  switch (lowerKey) {
    case KEYS.W:
      return DIRECTIONS.UP;
    case KEYS.S:
      return DIRECTIONS.DOWN;
    case KEYS.A:
      return DIRECTIONS.LEFT;
    case KEYS.D:
      return DIRECTIONS.RIGHT;
    default:
      return null;
  }
};

/**
 * Prevents reverse direction movement
 * (e.g., can't go left if currently moving right)
 *
 * @param {Object} currentDirection - Current direction vector
 * @param {Object} newDirection - Proposed new direction
 * @returns {Object} Validated direction (either newDirection or currentDirection)
 */
export const isValidDirectionChange = (currentDirection, newDirection) => {
  // Prevent moving in exact opposite direction
  if (
    currentDirection.x === -newDirection.x &&
    currentDirection.y === -newDirection.y
  ) {
    return currentDirection;
  }
  return newDirection;
};

/**
 * Calculates progressive game speed based on score
 * Uses exponential curve for smooth difficulty increase
 *
 * @param {number} score - Current game score
 * @param {number} baseSpeed - Base game loop interval
 * @param {number} speedIncreaseRate - Rate of speed increase per point
 * @param {number} minSpeed - Minimum speed cap
 * @returns {number} Calculated interval in milliseconds
 */
export const calculateGameSpeed = (
  score,
  baseSpeed,
  speedIncreaseRate,
  minSpeed
) => {
  // Speed formula: baseSpeed * (1 - speedIncreaseRate)^score
  // This creates a smooth, asymptotic curve that never gets too fast
  const calculatedSpeed = baseSpeed * Math.pow(1 - speedIncreaseRate, score);
  return Math.max(calculatedSpeed, minSpeed);
};

/**
 * Gets localStorage value with type safety
 *
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getStorageValue = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * Sets localStorage value safely
 *
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export const setStorageValue = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage: ${key}`, error);
  }
};
