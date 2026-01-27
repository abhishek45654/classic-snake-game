import { useEffect, useRef } from 'react';
import { Paddle } from './Paddle';
import { Orb } from './Orb';
import { TileManager } from './TileManager';
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, GAME_CONFIG, COLORS } from './constants';
import { drawBackground, drawParticles } from './Renderer';

export function useGameLoop(
  canvasRef,
  contextRef,
  gameState,
  updateGameState,
  onGameOver
) {
  const stateRef = useRef({
    paddle: null,
    orb: null,
    tileManager: null,
    particles: [],
    mouseX: GRID_WIDTH / 2,
    combo: 0,
    maxCombo: 0,
    lastTileHit: Date.now(),
  });

  // Keep gameState in a ref to avoid dependency issues
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Track previous game state to detect resets
  const prevGameStateRef = useRef({ level: 0, gameOver: true, score: -1 });

  // Track keyboard state
  const keysRef = useRef({});

  // Initialize game and handle resets
  useEffect(() => {
    const state = stateRef.current;
    const currentGameState = gameStateRef.current;
    const prev = prevGameStateRef.current;
    
    // Initialize if not already done
    if (!state.paddle) {
      state.paddle = new Paddle(GRID_WIDTH / 2, GRID_HEIGHT - 1.5);
      state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
      state.tileManager = new TileManager(GRID_WIDTH, GRID_HEIGHT, currentGameState.level);
      state.particles = [];
      state.combo = 0;
      state.maxCombo = 0;
    }
    
    // Detect game reset: gameOver goes from true to false, or level resets to 1 from higher
    const isReset = (prev.gameOver && !currentGameState.gameOver) || 
                    (prev.level > 1 && currentGameState.level === 1 && currentGameState.score === 0);
    
    if (isReset && state.paddle) {
      state.paddle = new Paddle(GRID_WIDTH / 2, GRID_HEIGHT - 1.5);
      state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
      state.tileManager = new TileManager(GRID_WIDTH, GRID_HEIGHT, 1);
      state.particles = [];
      state.combo = 0;
      state.maxCombo = 0;
      state.mouseX = GRID_WIDTH / 2;
    }
    
    // Update previous state
    prevGameStateRef.current = {
      level: currentGameState.level,
      gameOver: currentGameState.gameOver,
      score: currentGameState.score,
    };
  }, [gameState.level, gameState.gameOver, gameState.score]);

  // Mouse/Touch controls - only work over canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / CELL_SIZE;
      stateRef.current.mouseX = Math.max(0, Math.min(GRID_WIDTH, mouseX));
    };

    const handleMouseLeave = () => {
      // Keep paddle at last position when mouse leaves canvas
      // Don't reset to center
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = (touch.clientX - rect.left) / CELL_SIZE;
      stateRef.current.mouseX = Math.max(0, Math.min(GRID_WIDTH, touchX));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canvasRef]);

  // Keyboard input for paddle movement and orb launch
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = stateRef.current;
      const currentGameState = gameStateRef.current;
      
      // Only handle game controls if game is not over and not paused
      if (currentGameState.gameOver || currentGameState.isPaused) {
        // Let pause handler in Game.jsx handle P and space when paused
        return;
      }

      // Prevent default for game keys
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(e.key)) {
        e.preventDefault();
      }

      keysRef.current[e.key] = true;

      // Launch orb with space
      if (e.key === ' ' || e.code === 'Space') {
        if (!state.orb.launched) {
          state.orb.launch();
        }
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Update paddle position based on keys in game loop
    const updatePaddleFromKeys = () => {
      const state = stateRef.current;
      const keys = keysRef.current;
      const paddleSpeed = 0.15;

      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        state.mouseX = Math.max(0, state.mouseX - paddleSpeed);
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        state.mouseX = Math.min(GRID_WIDTH, state.mouseX + paddleSpeed);
      }
    };

    // Store the update function in stateRef so game loop can call it
    stateRef.current.updatePaddleFromKeys = updatePaddleFromKeys;

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stateRef.current.updatePaddleFromKeys = null;
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    let animationFrameId;

    const gameLoop = () => {
      const state = stateRef.current;
      const currentGameState = gameStateRef.current;

      if (!currentGameState.gameOver && !currentGameState.isPaused) {
        // Update paddle position from keyboard if handler exists
        if (state.updatePaddleFromKeys) {
          state.updatePaddleFromKeys();
        }
        
        // Update paddle position (from mouse or keyboard)
        state.paddle.x = state.mouseX;

        // Make orb follow paddle when not launched
        if (!state.orb.launched) {
          state.orb.x = state.paddle.x;
          state.orb.y = state.paddle.y - 1.5;
        }

        // Update orb position
        const prevOrbX = state.orb.x;
        const prevOrbY = state.orb.y;
        state.orb.update();

        // Paddle collision - check before and after movement
        if (state.orb.launched && state.orb.collidesWithPaddle(state.paddle)) {
          state.orb.bounceOffPaddle(state.paddle);
          state.combo = 0; // Reset combo on paddle hit
          updateGameState({ combo: 0 });
        }

        // Tile collisions - check after movement
        state.tileManager.checkCollisions(state.orb, (points, x, y) => {
          updateGameState(prev => ({
            score: prev.score + points * (1 + prev.combo * 0.1),
            combo: prev.combo + 1,
          }));
          
          // Add particles
          for (let i = 0; i < 5; i++) {
            state.particles.push({
              x: x + 0.5,
              y: y + 0.5,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              life: 0.5,
              maxLife: 0.5,
            });
          }
        });

        // Check level clear
        if (state.tileManager.isEmpty()) {
          updateGameState(prev => {
            const newLevel = prev.level + 1;
            // Update tile manager with new level
            state.tileManager = new TileManager(GRID_WIDTH, GRID_HEIGHT, newLevel);
            state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
            return {
              level: newLevel,
              score: prev.score + GAME_CONFIG.LEVEL_CLEAR_BONUS,
            };
          });
        }

        // Ball out of bounds
        if (state.orb.y > GRID_HEIGHT && state.orb.launched) {
          updateGameState(prev => {
            const newLives = prev.lives - 1;
            if (newLives <= 0) {
              onGameOver(prev.score);
            } else {
              // Reset orb to paddle position
              state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
            }
            return {
              lives: newLives,
            };
          });
        }
      }

      // Update particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life -= 0.016;
        return p.life > 0;
      });

      // Render
      drawBackground(ctx, GRID_WIDTH, GRID_HEIGHT, CELL_SIZE);
      drawParticles(ctx, state.particles, CELL_SIZE);
      state.tileManager.render(ctx, CELL_SIZE);
      state.paddle.render(ctx, CELL_SIZE);
      state.orb.render(ctx, CELL_SIZE);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [updateGameState, onGameOver]);
}