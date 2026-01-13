import {
  BREAKOUT_WIDTH,
  BREAKOUT_HEIGHT,
  BALL_RADIUS,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_MARGIN_BOTTOM,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_PADDING,
  BRICK_COLS,
  BRICK_ROWS,
  BRICK_TYPES,
  INITIAL_BALL_SPEED,
  MAX_BALL_SPEED,
  GAME_STATES,
  SCORES,
  COMBO_SETTINGS,
  COLORS,
  POWERUP_TYPES
} from './breakoutConstants';

// Initialize game state
export const initializeGameState = (level = 1) => {
  return {
    ball: {
      x: BREAKOUT_WIDTH / 2,
      y: BREAKOUT_HEIGHT - 100,
      vx: INITIAL_BALL_SPEED,
      vy: -INITIAL_BALL_SPEED,
      active: false
    },
    paddle: {
      x: BREAKOUT_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: BREAKOUT_HEIGHT - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    },
    bricks: generateBricks(level),
    score: 0,
    combo: 1,
    lives: 3,
    level: level,
    gameStatus: GAME_STATES.MENU,
    particles: [],
    powerups: [],
    activePowerups: {}
  };
};

// Generate bricks layout
const generateBricks = (level) => {
  const bricks = [];
  const startX = (BREAKOUT_WIDTH - (BRICK_COLS * BRICK_WIDTH + (BRICK_COLS - 1) * BRICK_PADDING)) / 2;
  const startY = 40;

  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      let type = BRICK_TYPES.STANDARD;
      
      // Add some variety based on level
      if (level >= 2 && Math.random() < 0.3) {
        type = BRICK_TYPES.REINFORCED;
      }
      if (level >= 3 && Math.random() < 0.1) {
        type = BRICK_TYPES.SPECIAL;
      }

      bricks.push({
        x: startX + col * (BRICK_WIDTH + BRICK_PADDING),
        y: startY + row * (BRICK_HEIGHT + BRICK_PADDING),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        type: type,
        health: type === BRICK_TYPES.REINFORCED ? 2 : 1,
        destroyed: false
      });
    }
  }

  return bricks;
};

// Update game state
export const updateGameState = (gameData, keys) => {
  const newState = JSON.parse(JSON.stringify(gameData));
  const { ball, paddle, bricks, particles, powerups } = newState;

  if (gameData.gameStatus !== GAME_STATES.PLAYING) {
    return newState;
  }

  // Move paddle
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    paddle.x = Math.max(0, paddle.x - PADDLE_SPEED);
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    paddle.x = Math.min(BREAKOUT_WIDTH - paddle.width, paddle.x + PADDLE_SPEED);
  }

  // Update ball position
  if (ball.active) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top and side walls
    if (ball.x - BALL_RADIUS < 0 || ball.x + BALL_RADIUS > BREAKOUT_WIDTH) {
      ball.vx *= -1;
      ball.x = Math.max(BALL_RADIUS, Math.min(BREAKOUT_WIDTH - BALL_RADIUS, ball.x));
    }

    if (ball.y - BALL_RADIUS < 0) {
      ball.vy *= -1;
      ball.y = BALL_RADIUS;
    }

    // Ball collision with paddle
    if (
      ball.y + BALL_RADIUS > paddle.y &&
      ball.y - BALL_RADIUS < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.vy = Math.abs(ball.vy) * -1;
      ball.y = paddle.y - BALL_RADIUS;

      // Add angle based on contact point
      const contactPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.vx = contactPoint * 6;

      // Increase speed slightly
      const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
      if (speed < MAX_BALL_SPEED) {
        ball.vx = (ball.vx / speed) * Math.min(speed * 1.02, MAX_BALL_SPEED);
        ball.vy = (ball.vy / speed) * Math.min(speed * 1.02, MAX_BALL_SPEED);
      }

      // Reset combo
      newState.combo = 1;
    }

    // Ball collision with bricks
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      if (brick.destroyed) continue;

      if (
        ball.x > brick.x &&
        ball.x < brick.x + brick.width &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.height
      ) {
        // Destroy brick
        brick.health--;
        if (brick.health <= 0) {
          brick.destroyed = true;
          
          // Add score
          const baseScore = brick.type === BRICK_TYPES.STANDARD ? SCORES.STANDARD_BRICK :
                           brick.type === BRICK_TYPES.REINFORCED ? SCORES.REINFORCED_BRICK :
                           SCORES.SPECIAL_BRICK;
          newState.score += Math.floor(baseScore * newState.combo);

          // Increase combo
          newState.combo = Math.min(newState.combo + 0.2, COMBO_SETTINGS.MAX);

          // Create particles
          createDestructionParticles(particles, brick.x + brick.width / 2, brick.y + brick.height / 2);

          // Random powerup drop
          if (Math.random() < 0.15) {
            const powerupTypesList = Object.values(POWERUP_TYPES);
            const randomPowerup = powerupTypesList[Math.floor(Math.random() * powerupTypesList.length)];
            powerups.push({
              x: brick.x + brick.width / 2,
              y: brick.y + brick.height / 2,
              type: randomPowerup,
              vy: 2
            });
          }
        }

        // Bounce ball
        ball.vy *= -1;
        ball.y = ball.vy > 0 ? brick.y - BALL_RADIUS : brick.y + brick.height + BALL_RADIUS;
        break;
      }
    }

    // Ball out of bounds
    if (ball.y > BREAKOUT_HEIGHT) {
      newState.lives--;
      if (newState.lives <= 0) {
        newState.gameStatus = GAME_STATES.GAME_OVER;
      } else {
        ball.x = BREAKOUT_WIDTH / 2;
        ball.y = BREAKOUT_HEIGHT - 100;
        ball.vx = INITIAL_BALL_SPEED;
        ball.vy = -INITIAL_BALL_SPEED;
        ball.active = false;
      }
    }
  }

  // Update particles
  newState.particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life--;
    return p.life > 0;
  });

  // Update powerups
  newState.powerups = powerups.filter(p => {
    p.y += p.vy;
    
    // Check collision with paddle
    if (
      p.x > paddle.x &&
      p.x < paddle.x + paddle.width &&
      p.y > paddle.y &&
      p.y < paddle.y + paddle.height
    ) {
      activatePowerup(newState, p.type);
      return false;
    }

    return p.y < BREAKOUT_HEIGHT;
  });

  // Check level complete
  if (bricks.every(b => b.destroyed)) {
    newState.gameStatus = GAME_STATES.LEVEL_COMPLETE;
    newState.score += SCORES.LEVEL_COMPLETE + (newState.lives * SCORES.LIFE_BONUS);
  }

  return newState;
};

// Create particle effect
const createDestructionParticles = (particles, x, y) => {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * 3,
      vy: Math.sin(angle) * 3,
      life: 30,
      size: 4
    });
  }
};

// Activate powerup
const activatePowerup = (gameData, type) => {
  gameData.score += SCORES.POWERUP;
  gameData.activePowerups[type] = Date.now();

  if (type === 'expandPaddle') {
    gameData.paddle.width = Math.min(gameData.paddle.width + 30, 180);
  } else if (type === 'slowMotion') {
    // Handled in render
  } else if (type === 'shield') {
    gameData.activePowerups.shield = 300; // frames
  }
};

// Render game
export const renderGame = (ctx, gameData) => {
  const { ball, paddle, bricks, particles, powerups, score, lives, combo, level, gameStatus } = gameData;

  // Clear canvas
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT);

  // Draw grid background
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= BREAKOUT_WIDTH; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, BREAKOUT_HEIGHT);
    ctx.stroke();
  }

  // Draw bricks
  for (const brick of bricks) {
    if (brick.destroyed) continue;

    // Color based on type and health
    let color = COLORS.brickStandard;
    if (brick.type === 'reinforced') {
      color = brick.health > 1 ? COLORS.brickReinforced : COLORS.brickStandard;
    } else if (brick.type === 'special') {
      color = COLORS.brickSpecial;
    }

    // Draw brick with glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    // Draw health indicator if reinforced
    if (brick.type === 'reinforced' && brick.health > 1) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(brick.health, brick.x + brick.width / 2, brick.y + brick.height / 2 + 3);
    }
  }

  ctx.shadowColor = 'transparent';

  // Draw paddle
  ctx.shadowColor = COLORS.paddle;
  ctx.shadowBlur = 15;
  ctx.fillStyle = COLORS.paddle;
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
  ctx.fill();

  // Draw ball
  ctx.shadowColor = COLORS.ball;
  ctx.shadowBlur = 20;
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Draw particles
  for (const p of particles) {
    ctx.fillStyle = `rgba(0, 255, 136, ${p.life / 30})`;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }

  // Draw powerups
  for (const p of powerups) {
    ctx.fillStyle = COLORS.brickSpecial;
    ctx.fillRect(p.x - 8, p.y - 8, 16, 16);
  }

  // Draw HUD
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = COLORS.text;
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Lives: ${lives}`, 20, 60);
  ctx.textAlign = 'right';
  ctx.fillText(`Level: ${level}`, BREAKOUT_WIDTH - 20, 30);
  ctx.fillText(`Combo: ${combo.toFixed(1)}x`, BREAKOUT_WIDTH - 20, 60);

  // Draw pause/menu text
  if (gameStatus === GAME_STATES.MENU || gameStatus === GAME_STATES.PAUSED) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT);
    ctx.fillStyle = COLORS.glow;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    if (gameStatus === GAME_STATES.MENU) {
      ctx.fillText('Click to Start', BREAKOUT_WIDTH / 2, BREAKOUT_HEIGHT / 2 - 40);
      ctx.font = '16px Arial';
      ctx.fillText('or Press SPACE', BREAKOUT_WIDTH / 2, BREAKOUT_HEIGHT / 2);
    } else {
      ctx.fillText('PAUSED', BREAKOUT_WIDTH / 2, BREAKOUT_HEIGHT / 2);
    }
  }
};
