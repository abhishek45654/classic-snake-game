import { useState, useEffect, useRef } from 'react';
import { initializeGameState, updateGameState, renderGame } from './pongHelpers';
import { PONG_WIDTH, PONG_HEIGHT, GAME_STATES, DIFFICULTY_SETTINGS } from './pongConstants';

export const usePongGameLoop = ({ difficulty = 'medium' } = {}) => {
  const [gameData, setGameData] = useState(() => initializeGameState(difficulty));
  const keysRef = useRef({});
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  // Handle key events
  const handleKeyDown = (e) => {
    // Prevent scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', ' '].includes(e.key) || e.code === 'Space') {
      e.preventDefault();
    }

    keysRef.current[e.key] = true;

    if (e.key === ' ' || e.code === 'Space') {
      setGameData((prev) => {
        if (prev.gameStatus === GAME_STATES.INITIAL) {
          return { ...prev, gameStatus: GAME_STATES.PLAYING };
        } else if (prev.gameStatus === GAME_STATES.PLAYING) {
          return { ...prev, gameStatus: GAME_STATES.PAUSED };
        } else if (prev.gameStatus === GAME_STATES.PAUSED) {
          return { ...prev, gameStatus: GAME_STATES.PLAYING };
        } else if (prev.gameStatus === GAME_STATES.GAME_OVER) {
          return initializeGameState(difficulty);
        }
        return prev;
      });
    }
  };

  const handleKeyUp = (e) => {
    keysRef.current[e.key] = false;
  };

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      setGameData((prev) => {
        let updated = prev;

        if (prev.gameStatus === GAME_STATES.PLAYING) {
          updated = updateGameState(prev, keysRef.current, difficulty);
        }

        // Render
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          renderGame(ctx, updated);
        }

        return updated;
      });

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [difficulty]);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [difficulty]);

  return { canvasRef, gameData };
};
