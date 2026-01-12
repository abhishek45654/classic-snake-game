import { useRef, useState, useCallback, useEffect } from 'react';
import {
  PACMAN_CANVAS_WIDTH,
  PACMAN_CANVAS_HEIGHT,
  PACMAN_CELL_SIZE,
  BASE_SPEED,
  GHOST_SPEED,
  DIRECTIONS,
  POWER_UP_DURATION,
  PACMAN_ROWS,
  PACMAN_COLS,
  GAME_STATES
} from './pacmanConstants.js';
import {
  initializeGame,
  getNextPosition,
  getGhostNextMove,
  checkGhostCollision,
  renderGame,
  isValidPosition
} from './pacmanHelpers.js';

export const usePacmanGameLoop = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pacmanHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [lives, setLives] = useState(3);
  const [gameData, setGameData] = useState(null);
  
  const gameDataRef = useRef(initializeGame());
  const lastPacmanMoveRef = useRef(0);
  const lastGhostMoveRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Handle keyboard input
  const handleKeyPress = useCallback((key) => {
    if (!gameDataRef.current) return;

    const directionMap = {
      'ArrowUp': DIRECTIONS.UP,
      'ArrowDown': DIRECTIONS.DOWN,
      'ArrowLeft': DIRECTIONS.LEFT,
      'ArrowRight': DIRECTIONS.RIGHT,
      'w': DIRECTIONS.UP,
      'W': DIRECTIONS.UP,
      's': DIRECTIONS.DOWN,
      'S': DIRECTIONS.DOWN,
      'a': DIRECTIONS.LEFT,
      'A': DIRECTIONS.LEFT,
      'd': DIRECTIONS.RIGHT,
      'D': DIRECTIONS.RIGHT
    };

    if (directionMap[key]) {
      gameDataRef.current.nextDirection = directionMap[key];
    }

    if (key === ' ') {
      if (gameState === 'playing') {
        setGameState('paused');
      } else if (gameState === 'paused') {
        setGameState('playing');
      }
    }

    if (key === 'Enter' && (gameState === 'gameOver' || gameState === 'menu')) {
      startGame();
    }
  }, [gameState]);

  const startGame = useCallback(() => {
    gameDataRef.current = initializeGame();
    setScore(0);
    setLives(3);
    setGameState('playing');
    lastPacmanMoveRef.current = Date.now();
    lastGhostMoveRef.current = Date.now();
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const quitGame = useCallback(() => {
    setGameState('menu');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'paused') return;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const ctx = canvas.getContext('2d');
      const now = Date.now();

      // Pac-Man movement
      if (gameState === 'playing' && now - lastPacmanMoveRef.current > BASE_SPEED) {
        const nextPos = getNextPosition(gameDataRef.current.pacmanPos, gameDataRef.current.nextDirection);
        const currentPos = getNextPosition(gameDataRef.current.pacmanPos, gameDataRef.current.direction);

        if (nextPos.x !== gameDataRef.current.pacmanPos.x || nextPos.y !== gameDataRef.current.pacmanPos.y) {
          gameDataRef.current.direction = gameDataRef.current.nextDirection;
          gameDataRef.current.pacmanPos = nextPos;
        } else if (currentPos.x !== gameDataRef.current.pacmanPos.x || currentPos.y !== gameDataRef.current.pacmanPos.y) {
          gameDataRef.current.pacmanPos = currentPos;
        }

        // Check pellet collision
        const pelletKey = `${gameDataRef.current.pacmanPos.x},${gameDataRef.current.pacmanPos.y}`;
        if (gameDataRef.current.pellets[pelletKey]) {
          const pellet = gameDataRef.current.pellets[pelletKey];
          const points = pellet.isPowerUp ? 50 : 10;
          setScore(prev => {
            const newScore = prev + points;
            if (newScore > highScore) {
              localStorage.setItem('pacmanHighScore', newScore);
              setHighScore(newScore);
            }
            return newScore;
          });

          if (pellet.isPowerUp) {
            gameDataRef.current.isPowerUpMode = true;
            gameDataRef.current.powerUpTime = now;
          }

          delete gameDataRef.current.pellets[pelletKey];
          gameDataRef.current.pelletsEaten++;

          // Check win condition
          if (gameDataRef.current.pelletsEaten === 0) {
            setGameState('gameOver');
          }
        }

        // Check power-up timeout
        if (gameDataRef.current.isPowerUpMode && now - gameDataRef.current.powerUpTime > POWER_UP_DURATION) {
          gameDataRef.current.isPowerUpMode = false;
        }

        lastPacmanMoveRef.current = now;
      }

      // Ghost movement
      if (gameState === 'playing' && now - lastGhostMoveRef.current > GHOST_SPEED) {
        gameDataRef.current.ghosts.forEach(ghost => {
          const move = getGhostNextMove(ghost.x, ghost.y);
          if (move) {
            ghost.x += move.x;
            ghost.y += move.y;
          }
        });

        // Check ghost collision
        const collision = checkGhostCollision(
          gameDataRef.current.pacmanPos,
          gameDataRef.current.ghosts,
          gameDataRef.current.isPowerUpMode
        );

        if (collision === true) {
          // Hit by ghost
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
            } else {
              gameDataRef.current.pacmanPos = { x: 1, y: 1 };
              gameDataRef.current.direction = DIRECTIONS.RIGHT;
              gameDataRef.current.nextDirection = DIRECTIONS.RIGHT;
            }
            return newLives;
          });
        } else if (typeof collision === 'number') {
          // Eat ghost in power-up mode
          const ghostIndex = collision;
          gameDataRef.current.ghosts[ghostIndex] = { x: 10, y: 9 + Math.floor(ghostIndex / 2), color: gameDataRef.current.ghosts[ghostIndex].color };
          setScore(prev => {
            const newScore = prev + 200;
            if (newScore > highScore) {
              localStorage.setItem('pacmanHighScore', newScore);
              setHighScore(newScore);
            }
            return newScore;
          });
        }

        lastGhostMoveRef.current = now;
      }

      // Render
      renderGame(ctx, PACMAN_CANVAS_WIDTH, PACMAN_CANVAS_HEIGHT, PACMAN_CELL_SIZE, gameDataRef.current);

      setGameData({ ...gameDataRef.current });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, highScore]);

  return {
    canvasRef,
    gameState,
    score,
    highScore,
    lives,
    startGame,
    restartGame,
    handleKeyPress,
    quitGame,
    pelletsRemaining: gameData?.pelletsEaten || 0
  };
};
