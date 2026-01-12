import {
  PONG_WIDTH,
  PONG_HEIGHT,
  BALL_RADIUS,
  INITIAL_BALL_SPEED,
  MAX_BALL_SPEED,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_MARGIN,
  WINNING_SCORE,
  GAME_STATES,
  COLORS,
  NET_WIDTH,
  NET_DASH_HEIGHT,
  NET_GAP,
  DIFFICULTY_SETTINGS
} from './pongConstants';

// Initialize game state
export const initializeGameState = (difficulty = 'medium') => {
  return {
    ball: {
      x: PONG_WIDTH / 2,
      y: PONG_HEIGHT / 2,
      vx: INITIAL_BALL_SPEED,
      vy: INITIAL_BALL_SPEED
    },
    paddle1: {
      x: PADDLE_MARGIN,
      y: PONG_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    },
    paddle2: {
      x: PONG_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
      y: PONG_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    },
    score1: 0,
    score2: 0,
    gameStatus: GAME_STATES.INITIAL,
    difficulty: difficulty
  };
};

// Update game state
export const updateGameState = (gameData, keys, difficulty = 'medium') => {
  const newState = JSON.parse(JSON.stringify(gameData));
  const { ball, paddle1, paddle2 } = newState;
  const diffSettings = DIFFICULTY_SETTINGS[difficulty];

  // Move paddles
  if (keys['w'] || keys['W'] || keys['ArrowUp']) {
    paddle1.y = Math.max(0, paddle1.y - 7);
  }
  if (keys['s'] || keys['S'] || keys['ArrowDown']) {
    paddle1.y = Math.min(PONG_HEIGHT - paddle1.height, paddle1.y + 7);
  }

  // AI for paddle 2 (computer opponent) - difficulty based
  const paddle2Center = paddle2.y + paddle2.height / 2;
  const ballCenter = ball.y;
  const aiSpeed = diffSettings.aiSpeed;
  const aiReactionZone = 35 + (5 - diffSettings.aiSpeed) * 10; // Easier levels have larger reaction zone

  if (paddle2Center < ballCenter - aiReactionZone) {
    paddle2.y = Math.min(PONG_HEIGHT - paddle2.height, paddle2.y + aiSpeed);
  } else if (paddle2Center > ballCenter + aiReactionZone) {
    paddle2.y = Math.max(0, paddle2.y - aiSpeed);
  }

  // Update ball position
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Ball collision with top and bottom walls
  if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > PONG_HEIGHT) {
    ball.vy *= -1;
    ball.y = Math.max(BALL_RADIUS, Math.min(PONG_HEIGHT - BALL_RADIUS, ball.y));
  }

  // Ball collision with paddle 1
  if (
    ball.x - BALL_RADIUS < paddle1.x + paddle1.width &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + paddle1.height
  ) {
    ball.vx = Math.abs(ball.vx); // Ensure ball moves right
    ball.x = paddle1.x + paddle1.width + BALL_RADIUS;

    // Add angle based on where ball hits paddle
    const hitPos = (ball.y - (paddle1.y + paddle1.height / 2)) / (paddle1.height / 2);
    ball.vy += hitPos * 3;

    // Increase speed slightly on each paddle hit based on difficulty
    const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
    const maxSpeed = MAX_BALL_SPEED + (difficulty === 'hard' ? 2 : 0);
    if (speed < maxSpeed) {
      const acceleration = diffSettings.ballAcceleration;
      ball.vx = (ball.vx / speed) * Math.min(speed * acceleration, maxSpeed);
      ball.vy = (ball.vy / speed) * Math.min(speed * acceleration, maxSpeed);
    }
  }

  // Ball collision with paddle 2
  if (
    ball.x + BALL_RADIUS > paddle2.x &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + paddle2.height
  ) {
    ball.vx = -Math.abs(ball.vx); // Ensure ball moves left
    ball.x = paddle2.x - BALL_RADIUS;

    // Add angle based on where ball hits paddle
    const hitPos = (ball.y - (paddle2.y + paddle2.height / 2)) / (paddle2.height / 2);
    ball.vy += hitPos * 3;

    // Increase speed slightly on each paddle hit
    const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
    if (speed < MAX_BALL_SPEED) {
      ball.vx = (ball.vx / speed) * Math.min(speed + 0.5, MAX_BALL_SPEED);
      ball.vy = (ball.vy / speed) * Math.min(speed + 0.5, MAX_BALL_SPEED);
    }
  }

  // Ball out of bounds - scoring
  if (ball.x < 0) {
    newState.score2++;
    resetBall(newState, -1);
  }
  if (ball.x > PONG_WIDTH) {
    newState.score1++;
    resetBall(newState, 1);
  }

  // Check for winning condition
  if (newState.score1 >= WINNING_SCORE || newState.score2 >= WINNING_SCORE) {
    newState.gameStatus = GAME_STATES.GAME_OVER;
  }

  return newState;
};

// Reset ball after scoring
const resetBall = (gameState, direction) => {
  gameState.ball.x = PONG_WIDTH / 2;
  gameState.ball.y = PONG_HEIGHT / 2;
  gameState.ball.vx = direction * INITIAL_BALL_SPEED;
  gameState.ball.vy = (Math.random() - 0.5) * INITIAL_BALL_SPEED;
};

// Render game
export const renderGame = (ctx, gameData) => {
  const { ball, paddle1, paddle2, score1, score2, gameStatus } = gameData;

  // Clear background with gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, PONG_HEIGHT);
  gradient.addColorStop(0, '#0a0a15');
  gradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, PONG_WIDTH, PONG_HEIGHT);

  // Draw center net
  ctx.strokeStyle = COLORS.net;
  ctx.setLineDash([NET_DASH_HEIGHT, NET_GAP]);
  ctx.lineWidth = NET_WIDTH;
  ctx.beginPath();
  ctx.moveTo(PONG_WIDTH / 2, 0);
  ctx.lineTo(PONG_WIDTH / 2, PONG_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles with glow
  drawPaddleWithGlow(ctx, paddle1, COLORS.paddle1);
  drawPaddleWithGlow(ctx, paddle2, COLORS.paddle2);

  // Draw ball with glow
  drawBallWithGlow(ctx, ball.x, ball.y, BALL_RADIUS, COLORS.ball);

  // Draw scores
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(score1, PONG_WIDTH / 4, 70);
  ctx.fillText(score2, (PONG_WIDTH * 3) / 4, 70);

  // Draw game status messages
  if (gameStatus === GAME_STATES.INITIAL) {
    drawCenteredText(ctx, 'PRESS SPACE TO START', PONG_HEIGHT / 2 - 40, 32);
    drawCenteredText(ctx, 'W/S or ↑/↓ to move', PONG_HEIGHT / 2 + 40, 20);
  }

  if (gameStatus === GAME_STATES.PAUSED) {
    drawCenteredText(ctx, 'PAUSED', PONG_HEIGHT / 2, 48);
    drawCenteredText(ctx, 'Press SPACE to resume', PONG_HEIGHT / 2 + 60, 20);
  }

  if (gameStatus === GAME_STATES.GAME_OVER) {
    const winner = score1 >= WINNING_SCORE ? 'PLAYER WINS!' : 'COMPUTER WINS!';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, PONG_WIDTH, PONG_HEIGHT);
    drawCenteredText(ctx, winner, PONG_HEIGHT / 2 - 40, 48);
    drawCenteredText(ctx, 'Press SPACE to play again', PONG_HEIGHT / 2 + 60, 24);
  }
};

// Helper to draw paddle with glow effect
const drawPaddleWithGlow = (ctx, paddle, color) => {
  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Inner light
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(paddle.x + 2, paddle.y + 5, paddle.width - 4, paddle.height - 10);

  ctx.shadowColor = 'transparent';
};

// Helper to draw ball with glow effect
const drawBallWithGlow = (ctx, x, y, radius, color) => {
  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner bright spot
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - radius / 2, y - radius / 2, radius / 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';
};

// Helper to draw centered text
const drawCenteredText = (ctx, text, y, fontSize) => {
  ctx.fillStyle = COLORS.primary;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, PONG_WIDTH / 2, y);
};
