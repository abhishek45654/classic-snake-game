import { COLORS } from './constants';

export function drawBackground(ctx, width, height, cellSize) {
  // Animated gradient background
  const gradient = ctx.createLinearGradient(0, 0, width * cellSize, height * cellSize);
  gradient.addColorStop(0, '#0f0f1e');
  gradient.addColorStop(0.5, '#1a0f2e');
  gradient.addColorStop(1, '#0f0f1e');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width * cellSize, height * cellSize);

  // Grid
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
  ctx.lineWidth = 0.5;

  for (let i = 0; i <= width; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, height * cellSize);
    ctx.stroke();
  }

  for (let i = 0; i <= height; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(width * cellSize, i * cellSize);
    ctx.stroke();
  }
}

export function drawParticles(ctx, particles, cellSize) {
  particles.forEach(p => {
    const alpha = (p.life / p.maxLife) * 0.8;
    ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x * cellSize, p.y * cellSize, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}
