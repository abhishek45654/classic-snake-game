import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BASE_SPEED,
  MIN_SPEED,
  SPEED_INCREASE_RATE,
  DIRECTIONS,
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CELL_SIZE,
  COLORS
} from '../utils/constants.js';
import { calculateGameSpeed, wrapAround } from '../utils/helpers.js';

/**
 * useGameLoop - Direct, simple game loop implementation
 * Handles all game logic and rendering in a single RAF-based loop
 * No complex refs or callbacks - pure functional game loop
 */
export const useGameLoop = () => {
  const canvasRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [finalScore, setFinalScore] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0); // 0.5x to 2.0x
  const [isSpeedLocked, setIsSpeedLocked] = useState(false); // Lock speed during game

  // Track gameStatus in ref for use in event handlers
  const gameStatusRef = useRef('menu');
  const speedMultiplierRef = useRef(1.0);
  const isSpeedLockedRef = useRef(false);
  
  // Update refs whenever state changes
  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    isSpeedLockedRef.current = isSpeedLocked;
  }, [isSpeedLocked]);

  // Game state - mutable ref for game loop
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }], // head, body, tail
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 }, // RIGHT
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameOver: false,
    paused: false,
    lastTickTime: Date.now(),
    tickDuration: BASE_SPEED
  });

  const rafRef = useRef(null);

  // Spawn food at random location not on snake
  const spawnFood = () => {
    const snake = stateRef.current.snake;
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
    stateRef.current.food = food;
  };

  // Main game tick - updates game logic
  const updateGame = () => {
    const state = stateRef.current;

    if (state.gameOver || state.paused) return;

    // Prevent reversing direction (180 degree turn)
    const isReversingDirection = state.nextDirection.x === -state.direction.x && 
                                  state.nextDirection.y === -state.direction.y;
    
    if (!isReversingDirection) {
      state.direction = { x: state.nextDirection.x, y: state.nextDirection.y };
    }

    // Calculate new head position
    const head = state.snake[0];
    const newHead = {
      x: wrapAround(head.x + state.direction.x),
      y: wrapAround(head.y + state.direction.y)
    };

    // Check food collision BEFORE moving
    const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;

    // Check self collision BEFORE moving
    // Only check body segments (exclude head at index 0)
    for (let i = 1; i < state.snake.length; i++) {
      if (newHead.x === state.snake[i].x && newHead.y === state.snake[i].y) {
        state.gameOver = true;
        
        // Save high score if current score is better
        const savedHighScore = localStorage.getItem('snakeHighScore');
        const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
        
        if (state.score > currentHighScore) {
          localStorage.setItem('snakeHighScore', state.score.toString());
          // Update React state so UI reflects new high score
          setHighScore(state.score);
        }
        return;
      }
    }

    // NOW move the snake
    // Add new head
    state.snake.unshift(newHead);

    // Remove tail if didn't eat food (this allows growth)
    if (!ateFood) {
      state.snake.pop();
    }

    // Handle food eaten
    if (ateFood) {
      state.score += 1;
      spawnFood();

      // Update speed
      const newSpeed = calculateGameSpeed(
        state.score,
        BASE_SPEED,
        SPEED_INCREASE_RATE,
        MIN_SPEED
      );
      state.tickDuration = newSpeed;
    }
  };

  // Render game to canvas
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // Clear canvas
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw food
    ctx.fillStyle = COLORS.FOOD;
    ctx.fillRect(
      state.food.x * CELL_SIZE,
      state.food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    // Draw snake
    state.snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;

      if (index === 0) {
        // Head
        ctx.fillStyle = COLORS.SNAKE;
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        ctx.fillStyle = '#86efac';
        ctx.fillRect(x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
      } else {
        // Body
        ctx.fillStyle = COLORS.SNAKE;
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    });
  };

  // Main game loop using RAF
  const gameLoop = () => {
    const state = stateRef.current;
    const now = Date.now();

    // Update game at controlled interval based on score
    if (now - state.lastTickTime >= state.tickDuration) {
      updateGame();
      state.lastTickTime = now;

      // Update React state for UI display
      setScore(state.score);
      if (state.gameOver) {
        setFinalScore(state.score);
        setGameStatus('gameOver');
      }
    }

    // Always render current state
    render();

    // Continue loop
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const increaseSpeed = useCallback(() => {
    if (isSpeedLockedRef.current || gameStatusRef.current !== 'playing') return;
    
    const newMultiplier = Math.min(speedMultiplierRef.current + 0.1, 2.0); // Max 2.0x
    setSpeedMultiplier(newMultiplier);
    
    // Update actual tick duration in game state
    const state = stateRef.current;
    state.tickDuration = BASE_SPEED / newMultiplier;
  }, []);

  const decreaseSpeed = useCallback(() => {
    if (isSpeedLockedRef.current || gameStatusRef.current !== 'playing') return;
    
    const newMultiplier = Math.max(speedMultiplierRef.current - 0.1, 0.5); // Min 0.5x
    setSpeedMultiplier(newMultiplier);
    
    // Update actual tick duration in game state
    const state = stateRef.current;
    state.tickDuration = BASE_SPEED / newMultiplier;
  }, []);

  const toggleSpeedLock = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    
    const newLockStatus = !isSpeedLockedRef.current;
    setIsSpeedLocked(newLockStatus);
  }, []);

  const quitGame = useCallback(() => {
    const state = stateRef.current;
    state.gameOver = true;
    setGameStatus('gameOver');
    setFinalScore(state.score);
    setSpeedMultiplier(1.0);
    setIsSpeedLocked(false);
  }, []);

  const startGame = useCallback(() => {
    const state = stateRef.current;
    state.snake = [{ x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9, y: 11 }]; // Centered on 22x22 grid
    state.direction = { x: 1, y: 0 }; // RIGHT
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    state.gameOver = false;
    state.paused = false;
    state.lastTickTime = Date.now();
    state.tickDuration = BASE_SPEED;

    // Reset speed controls when starting new game
    setSpeedMultiplier(1.0);
    setIsSpeedLocked(false);

    spawnFood();
    setScore(0);
    setGameStatus('playing');

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const handleKeyPress = useCallback((key) => {
    const state = stateRef.current;
    if (state.gameOver) return;

    // Arrow keys
    if (key === 'ArrowUp') state.nextDirection = { x: 0, y: -1 };
    else if (key === 'ArrowDown') state.nextDirection = { x: 0, y: 1 };
    else if (key === 'ArrowLeft') state.nextDirection = { x: -1, y: 0 };
    else if (key === 'ArrowRight') state.nextDirection = { x: 1, y: 0 };
    // WASD
    else if (key.toLowerCase() === 'w') state.nextDirection = { x: 0, y: -1 };
    else if (key.toLowerCase() === 's') state.nextDirection = { x: 0, y: 1 };
    else if (key.toLowerCase() === 'a') state.nextDirection = { x: -1, y: 0 };
    else if (key.toLowerCase() === 'd') state.nextDirection = { x: 1, y: 0 };
    // Pause - use gameStatusRef instead of gameStatus closure
    else if (key === ' ' || key.toLowerCase() === 'p') {
      if (gameStatusRef.current === 'playing') {
        state.paused = true;
        setGameStatus('paused');
      } else if (gameStatusRef.current === 'paused') {
        state.paused = false;
        setGameStatus('playing');
      }
    }
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    gameStatus,
    score,
    highScore,
    finalScore,
    startGame,
    handleKeyPress,
    restartGame,
    speedMultiplier,
    isSpeedLocked,
    increaseSpeed,
    decreaseSpeed,
    toggleSpeedLock,
    quitGame
  };
};
