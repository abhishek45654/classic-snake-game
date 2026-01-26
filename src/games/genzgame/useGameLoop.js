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

  // Initialize game
  useEffect(() => {
    const state = stateRef.current;
    if (!state.paddle) {
      state.paddle = new Paddle(GRID_WIDTH / 2, GRID_HEIGHT - 1.5);
      state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
      state.tileManager = new TileManager(GRID_WIDTH, GRID_HEIGHT, gameState.level);
      state.particles = [];
      state.combo = 0;
      state.maxCombo = 0;
    }
  }, []);

  // Mouse/Touch controls
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / CELL_SIZE;
      stateRef.current.mouseX = Math.max(0, Math.min(GRID_WIDTH, mouseX));
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const touchX = (touch.clientX - rect.left) / CELL_SIZE;
      stateRef.current.mouseX = Math.max(0, Math.min(GRID_WIDTH, touchX));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = stateRef.current;
      if (e.key === ' ') {
        e.preventDefault();
        if (!state.orb.launched) {
          state.orb.launch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    let animationFrameId;

    const gameLoop = () => {
      const state = stateRef.current;

      if (!gameState.gameOver && !gameState.isPaused) {
        // Update paddle position
        state.paddle.x = state.mouseX;

        // Update orb
        state.orb.update();

        // Paddle collision
        if (state.orb.launched && state.orb.collidesWithPaddle(state.paddle)) {
          state.orb.bounceOffPaddle(state.paddle);
          state.combo = 0; // Reset combo on paddle hit
          updateGameState({ combo: 0 });
        }

        // Tile collisions
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
          updateGameState(prev => ({
            level: prev.level + 1,
            score: prev.score + GAME_CONFIG.LEVEL_CLEAR_BONUS,
          }));
          state.tileManager = new TileManager(GRID_WIDTH, GRID_HEIGHT, gameState.level + 1);
          state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
        }

        // Ball out of bounds
        if (state.orb.y > GRID_HEIGHT) {
          updateGameState(prev => ({
            lives: prev.lives - 1,
          }));

          if (gameState.lives <= 1) {
            onGameOver(gameState.score);
          } else {
            state.orb = new Orb(GRID_WIDTH / 2, GRID_HEIGHT - 3, 0, 0);
          }
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
  }, [gameState, updateGameState, onGameOver]);
}
