import { useEffect, useRef, useState, useCallback } from 'react';
import {
  TETRIS_COLS,
  TETRIS_ROWS,
  TETRIS_BASE_SPEED,
  TETRIS_MAX_SPEED,
  TETRIS_SPEED_INCREASE,
  TETRIS_CANVAS_WIDTH,
  TETRIS_CANVAS_HEIGHT,
  TETRIS_CELL_SIZE,
  TETRIS_COLORS,
  TETRIS_SCORES,
  LINE_CLEAR_ANIMATION_DURATION,
  LINE_CLEAR_BLINK_COUNT
} from './tetrisConstants.js';
import {
  getRandomTetromino,
  getNextTetromino,
  createPieceBag,
  rotateTetromino,
  canPlace,
  placePiece,
  clearLines,
  calculateTetrisSpeed,
  calculateScore,
  createEmptyBoard,
  isGameOver,
  getGhostPiece
} from './tetrisHelpers.js';

export const useTetrisGameLoop = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tetrisHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const gameStatusRef = useRef('menu');

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  const bagRef = useRef([]);

  const stateRef = useRef({
    board: createEmptyBoard(TETRIS_COLS, TETRIS_ROWS),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false,
    lastDropTime: Date.now(),
    dropSpeed: TETRIS_BASE_SPEED,
    clearedRows: [], // Rows being cleared (for animation)
    clearAnimationTime: 0, // Animation timer
    isSpeedBoosted: false // Down arrow boost
  });

  /**
   * Render game to canvas
   */
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // Clear canvas
    ctx.fillStyle = TETRIS_COLORS.BACKGROUND;
    ctx.fillRect(0, 0, TETRIS_CANVAS_WIDTH, TETRIS_CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = TETRIS_COLORS.GRID;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= TETRIS_COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TETRIS_CELL_SIZE, 0);
      ctx.lineTo(i * TETRIS_CELL_SIZE, TETRIS_CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= TETRIS_ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * TETRIS_CELL_SIZE);
      ctx.lineTo(TETRIS_CANVAS_WIDTH, i * TETRIS_CELL_SIZE);
      ctx.stroke();
    }

    // Draw placed blocks
    for (let row = 0; row < state.board.length; row++) {
      for (let col = 0; col < state.board[row].length; col++) {
        const color = state.board[row][col];
        if (color !== 0) {
          // Check if this row is being cleared (for animation)
          if (state.clearedRows.includes(row)) {
            // Flash disappearing effect
            const progress = state.clearAnimationTime / LINE_CLEAR_ANIMATION_DURATION; // 0 to 1
            
            // First half: bright white flash
            if (progress < 0.5) {
              const flashIntensity = 1 - (progress * 2); // 1 to 0
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = flashIntensity;
              ctx.fillRect(
                col * TETRIS_CELL_SIZE + 1,
                row * TETRIS_CELL_SIZE + 1,
                TETRIS_CELL_SIZE - 2,
                TETRIS_CELL_SIZE - 2
              );
              ctx.globalAlpha = 1;
            } else {
              // Second half: fade to transparent (disappear)
              const fadeOut = 1 - ((progress - 0.5) * 2); // 1 to 0
              ctx.fillStyle = color;
              ctx.globalAlpha = fadeOut;
              ctx.fillRect(
                col * TETRIS_CELL_SIZE + 1,
                row * TETRIS_CELL_SIZE + 1,
                TETRIS_CELL_SIZE - 2,
                TETRIS_CELL_SIZE - 2
              );
              ctx.globalAlpha = 1;
            }
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(
              col * TETRIS_CELL_SIZE + 1,
              row * TETRIS_CELL_SIZE + 1,
              TETRIS_CELL_SIZE - 2,
              TETRIS_CELL_SIZE - 2
            );
          }
        }
      }
    }

    // Draw ghost piece
    if (state.currentPiece && !state.gameOver && !state.paused && state.clearedRows.length === 0) {
      const ghostPiece = getGhostPiece(state.currentPiece, state.board);
      const { shape, x, y, color } = ghostPiece;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            ctx.fillRect(
              (x + col) * TETRIS_CELL_SIZE + 1,
              (y + row) * TETRIS_CELL_SIZE + 1,
              TETRIS_CELL_SIZE - 2,
              TETRIS_CELL_SIZE - 2
            );
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Draw current piece
    if (state.currentPiece && !state.gameOver && !state.paused && state.clearedRows.length === 0) {
      const { shape, x, y, color } = state.currentPiece;
      ctx.fillStyle = color;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            ctx.fillRect(
              (x + col) * TETRIS_CELL_SIZE + 1,
              (y + row) * TETRIS_CELL_SIZE + 1,
              TETRIS_CELL_SIZE - 2,
              TETRIS_CELL_SIZE - 2
            );
          }
        }
      }
    }
  };

  /**
   * Main game loop
   */
  const gameLoop = () => {
    const state = stateRef.current;
    const now = Date.now();

    // Handle line clearing animation
    if (state.clearedRows.length > 0) {
      state.clearAnimationTime += 16; // Approximate frame time
      
      if (state.clearAnimationTime >= LINE_CLEAR_ANIMATION_DURATION) {
        // Animation finished, clear the rows
        const { board: newBoard, linesCleared } = clearLines(state.board);
        state.board = newBoard;
        state.clearedRows = [];
        state.clearAnimationTime = 0;
      }
      render();
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (!state.gameOver && !state.paused && gameStatusRef.current === 'playing') {
      // Determine drop speed (with speed boost if down arrow held)
      const effectiveSpeed = state.isSpeedBoosted ? Math.max(50, state.dropSpeed - 500) : state.dropSpeed;

      // Time to drop piece
      if (now - state.lastDropTime >= effectiveSpeed) {
        // Try to move piece down
        if (canPlace(state.currentPiece, state.board, 0, 1)) {
          state.currentPiece.y += 1;
        } else {
          // Place piece on board
          state.board = placePiece(state.currentPiece, state.board);

          // Clear lines
          const { board: newBoard, linesCleared, completeRows } = clearLines(state.board);
          
          if (linesCleared > 0) {
            // Start animation for cleared rows
            state.board = newBoard;
            state.clearedRows = completeRows;
            state.clearAnimationTime = 0;

            const { score: newScore, level: newLevel } = calculateScore(
              linesCleared,
              state.score,
              state.level,
              TETRIS_SCORES
            );
            state.score = newScore;
            state.level = newLevel;
            state.lines += linesCleared;
            state.dropSpeed = calculateTetrisSpeed(
              state.level,
              TETRIS_BASE_SPEED,
              TETRIS_MAX_SPEED,
              TETRIS_SPEED_INCREASE
            );

            setScore(state.score);
            setLevel(state.level);
            setLines(state.lines);
          } else {
            // Get next piece immediately if no animation
            state.currentPiece = state.nextPiece || getNextTetromino(bagRef);
            state.nextPiece = getNextTetromino(bagRef);

            // Check if game is over
            if (isGameOver(state.currentPiece, state.board)) {
              state.gameOver = true;

              // Save high score
              const savedHighScore = localStorage.getItem('tetrisHighScore');
              const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
              if (state.score > currentHighScore) {
                localStorage.setItem('tetrisHighScore', state.score.toString());
                setHighScore(state.score);
              }

              setGameStatus('gameOver');
            }
          }
        }

        state.lastDropTime = now;
      }
    }

    render();
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  /**
   * Start the game
   */
  const startGame = useCallback(() => {
    bagRef.current = createPieceBag();
    const state = stateRef.current;
    state.board = createEmptyBoard(TETRIS_COLS, TETRIS_ROWS);
    state.currentPiece = getNextTetromino(bagRef);
    state.nextPiece = getNextTetromino(bagRef);
    state.score = 0;
    state.level = 1;
    state.lines = 0;
    state.gameOver = false;
    state.paused = false;
    state.lastDropTime = Date.now();
    state.dropSpeed = TETRIS_BASE_SPEED;

    setScore(0);
    setLevel(1);
    setLines(0);
    setGameStatus('playing');

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  /**
   * Handle key press
   */
  const handleKeyPress = useCallback((key) => {
    const state = stateRef.current;
    if (state.gameOver || !state.currentPiece) return;

    const piece = state.currentPiece;

    switch (key) {
      // Move left
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (canPlace(piece, state.board, -1, 0)) {
          piece.x -= 1;
        }
        break;

      // Move right
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (canPlace(piece, state.board, 1, 0)) {
          piece.x += 1;
        }
        break;

      // Rotate
      case 'ArrowUp':
      case 'w':
      case 'W':
        const rotated = rotateTetromino(piece);
        if (canPlace(rotated, state.board)) {
          state.currentPiece = rotated;
        }
        break;

      // Speed up - down arrow
      case 'ArrowDown':
      case 's':
      case 'S':
        state.isSpeedBoosted = true;
        break;

      // Hard drop
      case ' ':
        while (canPlace(piece, state.board, 0, 1)) {
          piece.y += 1;
        }
        state.lastDropTime = Date.now();
        break;

      // Pause
      case 'p':
      case 'P':
        if (gameStatusRef.current === 'playing') {
          state.paused = true;
          setGameStatus('paused');
        } else if (gameStatusRef.current === 'paused') {
          state.paused = false;
          setGameStatus('playing');
        }
        break;

      default:
        break;
    }
  }, []);

  /**
   * Handle key release
   */
  const handleKeyUp = useCallback((key) => {
    const state = stateRef.current;
    if (key === 'ArrowDown' || key === 's' || key === 'S') {
      state.isSpeedBoosted = false;
    }
  }, []);
  const resumeGame = useCallback(() => {
    const state = stateRef.current;
    state.paused = false;
    setGameStatus('playing');
  }, []);

  /**
   * Quit game
   */
  const quitGame = useCallback(() => {
    const state = stateRef.current;
    state.gameOver = true;
    setGameStatus('gameOver');
  }, []);

  /**
   * Restart game
   */
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
    level,
    lines,
    highScore,
    startGame,
    handleKeyPress,
    handleKeyUp,
    restartGame,
    resumeGame,
    quitGame
  };
};
