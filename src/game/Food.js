import { GRID_SIZE } from '../utils/constants.js';
import { getRandomGridPosition, collidesWith } from '../utils/helpers.js';

/**
 * Food.js - Handles food spawning logic
 */

export class Food {
  constructor(snakeSegments = []) {
    this.position = this.getValidRandomPosition(snakeSegments);
  }

  /**
   * Generates a random position that doesn't collide with snake
   *
   * @param {Array} snakeSegments - Array of snake segment positions
   * @returns {Object} Valid random position {x, y}
   */
  getValidRandomPosition(snakeSegments) {
    let newPosition;

    // Keep generating until we find a position not occupied by snake
    do {
      newPosition = getRandomGridPosition(GRID_SIZE);
    } while (collidesWith(newPosition, snakeSegments));

    return newPosition;
  }

  /**
   * Gets the current food position
   *
   * @returns {Object} Food position {x, y}
   */
  getPosition() {
    return this.position;
  }

  /**
   * Spawns new food at a random valid position
   *
   * @param {Array} snakeSegments - Array of snake segment positions
   */
  spawn(snakeSegments) {
    this.position = this.getValidRandomPosition(snakeSegments);
  }

  /**
   * Resets food to a new random position
   *
   * @param {Array} snakeSegments - Array of snake segment positions
   */
  reset(snakeSegments) {
    this.spawn(snakeSegments);
  }
}
