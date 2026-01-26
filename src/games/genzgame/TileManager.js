import { COLORS, GAME_CONFIG } from './constants';

class Tile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'soft', 'hard', 'pulse'
    this.hits = type === 'hard' ? 2 : 1;
    this.pulse = 0;
    this.destroyed = false;
  }

  collidesWith(orb) {
    return (
      orb.x < this.x + 1 && orb.x > this.x &&
      orb.y < this.y + 1 && orb.y > this.y
    );
  }

  hit() {
    this.hits--;
    if (this.hits <= 0) {
      this.destroyed = true;
    }
  }

  update() {
    if (this.type === 'pulse') {
      this.pulse += 0.05;
    }
  }

  render(ctx, cellSize) {
    const x = this.x * cellSize;
    const y = this.y * cellSize;
    const size = cellSize;

    let color = COLORS.TILE_SOFT;
    if (this.type === 'hard') color = COLORS.TILE_HARD;
    if (this.type === 'pulse') color = COLORS.TILE_PULSE;

    const pulse = this.type === 'pulse' ? Math.sin(this.pulse) * 0.1 : 0;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillRect(x + pulse * cellSize, y + pulse * cellSize, size - pulse * cellSize * 2, size - pulse * cellSize * 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + pulse * cellSize, y + pulse * cellSize, size - pulse * cellSize * 2, size - pulse * cellSize * 2);

    ctx.shadowColor = 'transparent';
  }
}

export class TileManager {
  constructor(width, height, level) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.generateLevel(level);
  }

  generateLevel(level) {
    this.tiles = [];
    const tileCount = 10 + level * 2;
    const types = ['soft', 'hard', 'pulse'];

    for (let i = 0; i < tileCount; i++) {
      let x, y, overlaps;
      do {
        overlaps = false;
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * (this.height * 0.5));

        overlaps = this.tiles.some(t => t.x === x && t.y === y);
      } while (overlaps);

      const type = types[Math.floor(Math.random() * types.length)];
      this.tiles.push(new Tile(x, y, type));
    }
  }

  checkCollisions(orb, onHit) {
    this.tiles.forEach(tile => {
      if (!tile.destroyed && tile.collidesWith(orb)) {
        const points =
          tile.type === 'soft' ? GAME_CONFIG.SOFT_TILE_POINTS :
          tile.type === 'hard' ? GAME_CONFIG.HARD_TILE_POINTS :
          GAME_CONFIG.PULSE_TILE_POINTS;

        tile.hit();
        onHit(points, tile.x, tile.y);

        // Bounce
        orb.vy *= -1;
      }
    });
  }

  isEmpty() {
    return this.tiles.every(t => t.destroyed);
  }

  render(ctx, cellSize) {
    this.tiles.forEach(tile => {
      tile.update();
      if (!tile.destroyed) {
        tile.render(ctx, cellSize);
      }
    });
  }
}
