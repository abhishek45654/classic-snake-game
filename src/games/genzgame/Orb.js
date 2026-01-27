import { COLORS, GAME_CONFIG, GRID_HEIGHT, GRID_WIDTH } from './constants';

export class Orb {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = GAME_CONFIG.ORB_RADIUS;
    this.launched = vy !== 0;
    this.trail = [];
  }

  launch() {
    if (!this.launched) {
      this.vy = -GAME_CONFIG.BASE_BALL_SPEED;
      this.vx = 0; // Start with no horizontal velocity
      this.launched = true;
    }
  }

  update() {
    if (!this.launched) return;

    this.x += this.vx;
    this.y += this.vy;

    // Wall bouncing
    if (this.x - this.radius < 0 || this.x + this.radius > GRID_WIDTH) {
      this.vx *= -1;
      this.x = Math.max(this.radius, Math.min(GRID_WIDTH - this.radius, this.x));
    }

    if (this.y - this.radius < 0) {
      this.vy *= -1;
      this.y = Math.max(this.radius, this.y);
    }

    // Speed cap
    const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    if (speed > GAME_CONFIG.MAX_BALL_SPEED) {
      this.vx = (this.vx / speed) * GAME_CONFIG.MAX_BALL_SPEED;
      this.vy = (this.vy / speed) * GAME_CONFIG.MAX_BALL_SPEED;
    }

    // Trail
    if (this.trail.length > 10) this.trail.shift();
    this.trail.push({ x: this.x, y: this.y });
  }

  collidesWithPaddle(paddle) {
    const paddleLeft = paddle.x - paddle.width / 2;
    const paddleRight = paddle.x + paddle.width / 2;
    const paddleTop = paddle.y - paddle.height / 2;
    const paddleBottom = paddle.y + paddle.height / 2;

    return (
      this.x + this.radius > paddleLeft &&
      this.x - this.radius < paddleRight &&
      this.y + this.radius > paddleTop &&
      this.y - this.radius < paddleBottom
    );
  }

  bounceOffPaddle(paddle) {
    const hitPos = (this.x - (paddle.x - paddle.width / 2)) / paddle.width;
    const angle = (hitPos - 0.5) * Math.PI * 0.5;
    const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    
    // Ensure minimum speed
    const minSpeed = GAME_CONFIG.BASE_BALL_SPEED;
    const currentSpeed = Math.max(speed, minSpeed);
    
    this.vx = Math.sin(angle) * currentSpeed;
    this.vy = -Math.abs(Math.cos(angle) * currentSpeed);
    
    // Position orb above paddle
    this.y = paddle.y - paddle.height / 2 - this.radius;
    
    // Ensure orb doesn't go through paddle
    if (this.y > paddle.y - paddle.height / 2) {
      this.y = paddle.y - paddle.height / 2 - this.radius;
    }
  }

  render(ctx, cellSize) {
    // Trail
    this.trail.forEach((point, idx) => {
      const alpha = (idx / this.trail.length) * 0.3;
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x * cellSize, point.y * cellSize, this.radius * cellSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Main orb
    ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
    ctx.shadowBlur = 15;
    const gradient = ctx.createRadialGradient(
      this.x * cellSize, this.y * cellSize, 0,
      this.x * cellSize, this.y * cellSize, this.radius * cellSize
    );
    gradient.addColorStop(0, '#fcd34d');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x * cellSize, this.y * cellSize, this.radius * cellSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowColor = 'transparent';
  }
}
