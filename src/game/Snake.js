import { GRID_SIZE } from '../utils/constants.js';
import { getRandomGridPosition, collidesWith, wrapAround } from '../utils/helpers.js';

/**
 * Snake.js - Handles all snake-related logic
 *
 * The snake is represented as an array of segment positions
 * where segments[0] is the head and segments[length-1] is the tail
 */

export class Snake {
  constructor() {
    // Initialize snake in the middle of the board with 3 segments
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);

    this.segments = [
      { x: centerX, y: centerY }, // Head
      { x: centerX - 1, y: centerY }, // Body
      { x: centerX - 2, y: centerY } // Tail
    ];
  }

  /**
   * Moves the snake in the given direction
   * Creates new head, shifts body, optionally removes tail (grows if food eaten)
   * Applies wrap-around to keep position within grid bounds
   *
   * @param {Object} direction - Direction vector {x, y}
   * @param {boolean} ateFood - Whether food was eaten this frame
   */
  move(direction, ateFood = false) {
    // Calculate new head position by adding direction to current head
    const head = this.segments[0];
    const newHead = {
      // Apply wrap-around to keep position within grid bounds
      x: wrapAround(head.x + direction.x),
      y: wrapAround(head.y + direction.y)
    };

    // Add new head to front
    this.segments.unshift(newHead);

    // Remove tail unless snake is growing (ate food)
    if (!ateFood) {
      this.segments.pop();
    }
  }

  /**
   * Gets the head position
   *
   * @returns {Object} Head position {x, y}
   */
  getHead() {
    return this.segments[0];
  }

  /**
   * Checks if snake collides with itself
   * Head (segments[0]) is checked against body (segments 1 onwards)
   *
   * @returns {boolean} True if self-collision detected
   */
  checkSelfCollision() {
    const head = this.getHead();
    const body = this.segments.slice(1); // All segments except head
    return collidesWith(head, body);
  }

  /**
   * Gets the length of the snake
   *
   * @returns {number} Number of segments
   */
  getLength() {
    return this.segments.length;
  }

  /**
   * Gets all snake segments (for rendering)
   *
   * @returns {Array} Array of position objects
   */
  getSegments() {
    return this.segments;
  }

  /**
   * Resets snake to initial state
   */
  reset() {
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);

    this.segments = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY }
    ];
  }
}
