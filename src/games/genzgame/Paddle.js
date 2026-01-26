import { COLORS, GAME_CONFIG } from './constants';

export class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONFIG.PADDLE_WIDTH;
    this.height = GAME_CONFIG.PADDLE_HEIGHT;
  }

  render(ctx, cellSize) {
    const x = this.x * cellSize;
    const y = this.y * cellSize;
    const w = this.width * cellSize;
    const h = this.height * cellSize;

    // Glassmorphism effect
    ctx.fillStyle = COLORS.PADDLE;
    ctx.shadowColor = 'rgba(167, 139, 250, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);

    ctx.strokeStyle = 'rgba(167, 139, 250, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    
    ctx.shadowColor = 'transparent';
  }
}
