import { useEffect, useRef, forwardRef } from 'react';
import { useGameLoop } from './useGameLoop';
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE } from './constants';

const Canvas = forwardRef(({ gameState, updateGameState, onGameOver }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = GRID_WIDTH * CELL_SIZE;
    canvas.height = GRID_HEIGHT * CELL_SIZE;

    const context = canvas.getContext('2d');
    contextRef.current = context;

    // Enable antialiasing
    if (context) {
      context.imageSmoothingEnabled = true;
    }
  }, []);

  useGameLoop(
    canvasRef,
    contextRef,
    gameState,
    updateGameState,
    onGameOver
  );

  return (
    <canvas 
      ref={canvasRef}
      className="genzgame-canvas"
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
