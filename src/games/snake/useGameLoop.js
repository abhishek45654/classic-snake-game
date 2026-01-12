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
} from '../../utils/constants.js';
import { calculateGameSpeed, wrapAround } from '../../utils/helpers.js';

/**
 * useGameLoop - Direct, simple game loop implementation
 * Handles all game logic and rendering in a single RAF-based loop
 * speedMode: 'static' | 'incremental' | 'progressive'
 */
export const useGameLoop = ({ speedMode = 'static' }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [finalScore, setFinalScore] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [isSpeedLocked, setIsSpeedLocked] = useState(false);

  const gameStatusRef = useRef('menu');
  const speedMultiplierRef = useRef(1.0);
  const isSpeedLockedRef = useRef(false);
  const speedModeRef = useRef(speedMode);
  
  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    isSpeedLockedRef.current = isSpeedLocked;
  }, [isSpeedLocked]);

  useEffect(() => {
    speedModeRef.current = speedMode;
  }, [speedMode]);

  const stateRef = useRef({
    snake: [{ x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9, y: 11 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameOver: false,
    paused: false,
    lastTickTime: Date.now(),
    tickDuration: BASE_SPEED
  });

  const spawnFood = () => {
    const state = stateRef.current;
    let food;
    let isOnSnake = true;

    while (isOnSnake) {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      isOnSnake = state.snake.some(segment => segment.x === food.x && segment.y === food.y);
    }

    state.food = food;
  };

  const updateGame = () => {
    const state = stateRef.current;

    if (state.gameOver || state.paused) return;

    const isReversingDirection = state.nextDirection.x === -state.direction.x && 
                                  state.nextDirection.y === -state.direction.y;
    
    if (!isReversingDirection) {
      state.direction = { x: state.nextDirection.x, y: state.nextDirection.y };
    }

    const head = state.snake[0];
    const newHead = {
      x: wrapAround(head.x + state.direction.x),
      y: wrapAround(head.y + state.direction.y)
    };

    const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;

    for (let i = 1; i < state.snake.length; i++) {
      if (newHead.x === state.snake[i].x && newHead.y === state.snake[i].y) {
        state.gameOver = true;
        
        const savedHighScore = localStorage.getItem('snakeHighScore');
        const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
        
        if (state.score > currentHighScore) {
          localStorage.setItem('snakeHighScore', state.score.toString());
          setHighScore(state.score);
        }
        return;
      }
    }

    state.snake.unshift(newHead);

    if (!ateFood) {
      state.snake.pop();
    }

    if (ateFood) {
      state.score += 1;
      spawnFood();

      // Apply speed change based on speedMode
      if (speedModeRef.current === 'incremental') {
        const newSpeed = calculateGameSpeed(
          state.score,
          BASE_SPEED,
          SPEED_INCREASE_RATE,
          MIN_SPEED
        );
        state.tickDuration = newSpeed;
      }
      // For 'static' and 'progressive', tickDuration remains unchanged
      // 'progressive' would be handled by manual controls only
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = COLORS.FOOD;
    ctx.fillRect(
      state.food.x * CELL_SIZE,
      state.food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    state.snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;

      if (index === 0) {
        ctx.fillStyle = COLORS.SNAKE;
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        ctx.fillStyle = '#86efac';
        ctx.fillRect(x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
      } else {
        ctx.fillStyle = COLORS.SNAKE;
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    });
  };

  const gameLoop = () => {
    const state = stateRef.current;
    const now = Date.now();

    if (now - state.lastTickTime >= state.tickDuration) {
      updateGame();
      state.lastTickTime = now;

      setScore(state.score);
      if (state.gameOver) {
        setFinalScore(state.score);
        setGameStatus('gameOver');
      }
    }

    render();
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const increaseSpeed = useCallback(() => {
    if (isSpeedLockedRef.current || gameStatusRef.current !== 'playing') return;
    
    const newMultiplier = Math.min(speedMultiplierRef.current + 0.1, 2.0);
    setSpeedMultiplier(newMultiplier);
    
    const state = stateRef.current;
    state.tickDuration = BASE_SPEED / newMultiplier;
  }, []);

  const decreaseSpeed = useCallback(() => {
    if (isSpeedLockedRef.current || gameStatusRef.current !== 'playing') return;
    
    const newMultiplier = Math.max(speedMultiplierRef.current - 0.1, 0.5);
    setSpeedMultiplier(newMultiplier);
    
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
    state.snake = [{ x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9, y: 11 }];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    state.gameOver = false;
    state.paused = false;
    state.lastTickTime = Date.now();
    state.tickDuration = BASE_SPEED;

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

    if (key === 'ArrowUp') state.nextDirection = { x: 0, y: -1 };
    else if (key === 'ArrowDown') state.nextDirection = { x: 0, y: 1 };
    else if (key === 'ArrowLeft') state.nextDirection = { x: -1, y: 0 };
    else if (key === 'ArrowRight') state.nextDirection = { x: 1, y: 0 };
    else if (key.toLowerCase() === 'w') state.nextDirection = { x: 0, y: -1 };
    else if (key.toLowerCase() === 's') state.nextDirection = { x: 0, y: 1 };
    else if (key.toLowerCase() === 'a') state.nextDirection = { x: -1, y: 0 };
    else if (key.toLowerCase() === 'd') state.nextDirection = { x: 1, y: 0 };
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
    quitGame,
    speedMode
  };
};
