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
    // Check collision with orb radius accounted for
    // Tile occupies [x, x+1] x [y, y+1]
    // Orb center is at (orb.x, orb.y) with radius orb.radius
    
    const tileLeft = this.x;
    const tileRight = this.x + 1;
    const tileTop = this.y;
    const tileBottom = this.y + 1;
    
    // Find closest point on tile to orb center
    const closestX = Math.max(tileLeft, Math.min(orb.x, tileRight));
    const closestY = Math.max(tileTop, Math.min(orb.y, tileBottom));
    
    // Calculate distance from orb center to closest point
    const dx = orb.x - closestX;
    const dy = orb.y - closestY;
    const distanceSquared = dx * dx + dy * dy;
    
    // Check if distance is less than orb radius
    return distanceSquared < (orb.radius * orb.radius);
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

        // Determine bounce direction based on which side of tile was hit
        const tileCenterX = tile.x + 0.5;
        const tileCenterY = tile.y + 0.5;
        const dx = orb.x - tileCenterX;
        const dy = orb.y - tileCenterY;
        
        // Bounce based on which axis has larger difference
        if (Math.abs(dx) > Math.abs(dy)) {
          // Hit from left or right
          orb.vx *= -1;
        } else {
          // Hit from top or bottom
          orb.vy *= -1;
        }
        
        // Move orb out of tile to prevent getting stuck
        if (Math.abs(dx) > Math.abs(dy)) {
          orb.x = dx > 0 ? tile.x + 1 + orb.radius : tile.x - orb.radius;
        } else {
          orb.y = dy > 0 ? tile.y + 1 + orb.radius : tile.y - orb.radius;
        }
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
