import { TETROMINOS, TETROMINO_TYPES } from './tetrisConstants.js';

/**
 * Create a piece bag (ensures each piece appears once before repeating)
 */
export const createPieceBag = () => {
  const bag = [...TETROMINO_TYPES].sort(() => Math.random() - 0.5);
  return bag;
};

/**
 * Get next tetromino piece from bag
 */
export const getNextTetromino = (bagRef) => {
  // Create new bag if empty
  if (bagRef.current.length === 0) {
    bagRef.current = createPieceBag();
  }

  const type = bagRef.current.shift();
  return {
    type,
    shape: TETROMINOS[type].shape.map(row => [...row]), // Deep copy
    color: TETROMINOS[type].color,
    x: 3,
    y: 0,
    rotation: 0
  };
};

/**
 * Get a random tetromino piece (fallback)
 */
export const getRandomTetromino = () => {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  return {
    type,
    shape: TETROMINOS[type].shape.map(row => [...row]), // Deep copy
    color: TETROMINOS[type].color,
    x: 3,
    y: 0,
    rotation: 0
  };
};

/**
 * Rotate a tetromino 90 degrees clockwise
 */
export const rotateTetromino = (piece) => {
  const { shape } = piece;
  const n = shape.length;
  const m = shape[0].length;
  const rotated = Array(m).fill(null).map(() => Array(n));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      rotated[j][n - 1 - i] = shape[i][j];
    }
  }

  return {
    ...piece,
    shape: rotated
  };
};

/**
 * Check if piece can be placed at position
 */
export const canPlace = (piece, board, offsetX = 0, offsetY = 0) => {
  const { shape, x, y } = piece;
  const COLS = board[0].length;
  const ROWS = board.length;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardX = x + col + offsetX;
        const boardY = y + row + offsetY;

        // Check bounds
        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
          return false;
        }

        // Check collision with existing blocks
        if (boardY >= 0 && board[boardY][boardX] !== 0) {
          return false;
        }
      }
    }
  }

  return true;
};

/**
 * Place piece on board
 */
export const placePiece = (piece, board) => {
  const newBoard = board.map(row => [...row]);
  const { shape, x, y, color } = piece;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0 && boardY < newBoard.length) {
          newBoard[boardY][boardX] = color;
        }
      }
    }
  }

  return newBoard;
};

/**
 * Clear completed lines and return number of lines cleared
 */
export const clearLines = (board) => {
  // Find complete rows (rows where all cells are filled - not 0)
  const completeRows = [];
  for (let row = 0; row < board.length; row++) {
    const isComplete = board[row].every(cell => cell !== 0);
    if (isComplete) {
      completeRows.push(row);
    }
  }

  // If no complete rows, return as is
  if (completeRows.length === 0) {
    return { board, linesCleared: 0, completeRows: [] };
  }

  // Remove complete rows
  const newBoard = board.filter((row, index) => !completeRows.includes(index));

  // Add empty rows at top
  for (let i = 0; i < completeRows.length; i++) {
    newBoard.unshift(Array(board[0].length).fill(0));
  }

  return { board: newBoard, linesCleared: completeRows.length, completeRows };
};

/**
 * Calculate game speed based on level
 */
export const calculateTetrisSpeed = (level, baseSpeed, maxSpeed, speedIncrease) => {
  return Math.max(baseSpeed - level * speedIncrease, maxSpeed);
};

/**
 * Calculate score and level based on lines cleared
 */
export const calculateScore = (linesCleared, currentScore, currentLevel, scores) => {
  let addedScore = 0;

  if (linesCleared === 1) addedScore = scores.SINGLE_LINE;
  else if (linesCleared === 2) addedScore = scores.DOUBLE_LINE;
  else if (linesCleared === 3) addedScore = scores.TRIPLE_LINE;
  else if (linesCleared === 4) addedScore = scores.TETRIS_LINE;

  const newScore = currentScore + addedScore;
  const newLevel = Math.floor(newScore / 1000); // Level up every 1000 points

  return { score: newScore, level: newLevel };
};

/**
 * Initialize empty game board
 */
export const createEmptyBoard = (cols, rows) => {
  return Array(rows).fill(null).map(() => Array(cols).fill(0));
};

/**
 * Check if game is over (piece can't be placed at top)
 */
export const isGameOver = (piece, board) => {
  return !canPlace(piece, board);
};

/**
 * Get ghost piece (preview of where piece will land)
 */
export const getGhostPiece = (piece, board) => {
  let ghostY = piece.y;

  while (canPlace(piece, board, 0, ghostY - piece.y + 1)) {
    ghostY++;
  }

  return {
    ...piece,
    y: ghostY,
    isGhost: true
  };
};
