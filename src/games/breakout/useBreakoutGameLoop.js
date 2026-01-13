import { useState, useEffect, useRef } from 'react';
import { initializeGameState, updateGameState, renderGame } from './breakoutHelpers';
import { BREAKOUT_WIDTH, BREAKOUT_HEIGHT, GAME_STATES, HIGH_SCORES_KEY, MAX_HIGH_SCORES } from './breakoutConstants';

export const useBreakoutGameLoop = () => {
  const [gameData, setGameData] = useState(initializeGameState(1));
  const [highScores, setHighScores] = useState(() => loadHighScores());
  const keysRef = useRef({});
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  // Handle key events
  const handleKeyDown = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    keysRef.current[e.key] = true;

    if (e.key === ' ' || e.code === 'Space') {
      setGameData((prev) => {
        if (prev.gameStatus === GAME_STATES.MENU) {
          return { ...prev, gameStatus: GAME_STATES.PLAYING, ball: { ...prev.ball, active: true } };
        } else if (prev.gameStatus === GAME_STATES.PLAYING) {
          // If ball is inactive, activate it (ball was lost but lives remain)
          if (!prev.ball.active) {
            return { ...prev, ball: { ...prev.ball, active: true } };
          }
          // Otherwise pause
          return { ...prev, gameStatus: GAME_STATES.PAUSED };
        } else if (prev.gameStatus === GAME_STATES.PAUSED) {
          return { ...prev, gameStatus: GAME_STATES.PLAYING };
        } else if (prev.gameStatus === GAME_STATES.LEVEL_COMPLETE) {
          return initializeGameState(prev.level + 1);
        } else if (prev.gameStatus === GAME_STATES.GAME_OVER) {
          return initializeGameState(1);
        }
        return prev;
      });
    }

    if (e.key === 'p' || e.key === 'P') {
      setGameData((prev) => {
        if (prev.gameStatus === GAME_STATES.PLAYING) {
          return { ...prev, gameStatus: GAME_STATES.PAUSED };
        } else if (prev.gameStatus === GAME_STATES.PAUSED) {
          return { ...prev, gameStatus: GAME_STATES.PLAYING };
        }
        return prev;
      });
    }
  };

  const handleKeyUp = (e) => {
    keysRef.current[e.key] = false;
  };

  // Handle canvas click to start
  const handleCanvasClick = () => {
    setGameData((prev) => {
      if (prev.gameStatus === GAME_STATES.MENU) {
        return { ...prev, gameStatus: GAME_STATES.PLAYING, ball: { ...prev.ball, active: true } };
      }
      return prev;
    });
  };

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      setGameData((prev) => {
        let updated = prev;

        if (prev.gameStatus === GAME_STATES.PLAYING) {
          updated = updateGameState(prev, keysRef.current);
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
  }, []);

  // Save high score on game over
  useEffect(() => {
    if (gameData.gameStatus === GAME_STATES.GAME_OVER) {
      const updated = updateHighScores(gameData.score);
      setHighScores(updated);
    }
  }, [gameData.gameStatus, gameData.score]);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    canvasRef,
    gameData,
    highScores,
    handleCanvasClick,
    startNewGame: () => setGameData(initializeGameState(1)),
    startLevel: (level) => setGameData(initializeGameState(level))
  };
};

// High scores management
function loadHighScores() {
  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function updateHighScores(score) {
  const scores = loadHighScores();
  scores.push({ score, date: new Date().toISOString() });
  scores.sort((a, b) => b.score - a.score);
  const updated = scores.slice(0, MAX_HIGH_SCORES);
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
  return updated;
}
