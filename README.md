# 🐍 Snake Game - React + Vite

A modern, full-featured implementation of the classic Snake arcade game built with **React**, **Vite**, **Tailwind CSS**, and **HTML Canvas**. Fully functional, responsive, and ready to play.

## ✨ Features

- **Classic Snake Gameplay**
  - Smooth, responsive controls (Arrow Keys + WASD)
  - Snake grows when eating food
  - Progressive difficulty (speed increases with score)
  - Self-collision detection (game over)

- **Smart Board Mechanics**
  - Unbounded grid with wrap-around edges (torus topology)
  - Exiting one side seamlessly enters the opposite side
  - No walls or boundaries
  - Perfect grid alignment

- **Game Loop Architecture**
  - Decoupled game tick (variable speed) from render loop (60 FPS)
  - Smooth performance without stuttering
  - Smooth speed progression curve (exponential)
  - Prevents reverse-direction movement

- **Score & Persistence**
  - Live score during gameplay
  - High score saved to `localStorage`
  - Score persists across page refreshes
  - Displays final score on game over

- **Player Controls**
  - **Movement:** `↑ ↓ ← →` (Arrow Keys) or `W A S D` (WASD)
  - **Pause/Resume:** `SPACE` or `P` key
  - **Restart:** Click "Play Again" button after game over
  - Responsive to rapid input

- **Modern UI**
  - Clean, dark flat design using Tailwind CSS
  - Responsive canvas scaling
  - Polished game over screen
  - Real-time score updates
  - Accessibility-friendly

- **Desktop Optimized**
  - Automatically scales to fit laptop screens
  - Centered canvas with proper aspect ratio
  - Minimal dependencies
  - Fast development and production builds

## 🎮 How to Play

### Rules

1. **Objective:** Eat food (red squares) to grow and increase your score
2. **Movement:** Use arrow keys or WASD to control the snake's direction
3. **Growth:** Each food eaten adds one segment to the snake's tail
4. **Wrap-Around:** The snake wraps around screen edges (no walls)
5. **Game Over:** Touching the snake's own body ends the game
6. **Speed:** The game gradually speeds up as your score increases

### Controls

| Action | Key(s) |
|--------|--------|
| Move Up | `↑` or `W` |
| Move Down | `↓` or `S` |
| Move Left | `←` or `A` |
| Move Right | `→` or `D` |
| Pause / Resume | `SPACE` or `P` |
| Restart | Click "Play Again" button |

### Tips

- The game starts automatically when loaded
- You can't move directly backwards (prevents instant death)
- Speed increases smoothly as you score (not jarringly)
- Use the wrap-around edges strategically
- Watch your score climb as difficulty increases

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm (or yarn/pnpm)

### Installation

```bash
# Clone or navigate to the project directory
cd snake-game-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will automatically open in your default browser at `http://localhost:5173`.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` directory, ready to deploy.

## 🌐 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment (Recommended)
The app automatically deploys when you push to the `master` or `main` branch:

1. Go to repository **Settings → Pages**
2. Under "Build and deployment", select source: **GitHub Actions**
3. Click Save
4. Push your code to master/main branch
5. The workflow automatically builds and deploys
6. Visit: `https://<your-username>.github.io/snake-game-react/`

### Manual Deployment with gh-pages
```bash
# Deploy to GitHub Pages
npm run deploy
```

Then configure your repository:
1. Go to **Settings → Pages**
2. Select source: **gh-pages** branch, **root** folder
3. Click Save

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📁 Project Structure

```
snake-game-react/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
├── README.md                    # This file
├── src/
│   ├── main.jsx                 # React app entry
│   ├── App.jsx                  # Root component
│   ├── game/
│   │   ├── Game.jsx             # Main game component & UI
│   │   ├── Board.jsx            # Canvas rendering component
│   │   ├── Snake.js             # Snake class (logic)
│   │   ├── Food.js              # Food class (logic)
│   │   └── useGameLoop.js       # Custom game loop hook
│   ├── styles/
│   │   └── index.css            # Tailwind + custom styles
│   └── utils/
│       ├── constants.js         # Game constants & config
│       └── helpers.js           # Utility functions
└── dist/                        # Production build (after npm run build)
```

## 🏗️ Architecture Overview

### Separation of Concerns

- **Game Logic** (`Snake.js`, `Food.js`): Pure game state management
- **Game Loop** (`useGameLoop.js`): Orchestrates ticks and updates
- **Rendering** (`Board.jsx`): Canvas drawing logic
- **UI** (`Game.jsx`): React state, input handling, UI display
- **Utilities** (`constants.js`, `helpers.js`): Shared functions

### Game Loop Design

```
requestAnimationFrame (60 FPS)
    ↓
    → Update UI (score, status)
    → Render canvas
    ↓
setInterval (Variable Speed)
    ↓
    → Process movement
    → Check collisions
    → Spawn food
    → Update score
    → Adjust speed
```

The **rendering loop** runs at constant 60 FPS for smooth visuals.
The **game tick** runs at variable speed based on score for difficulty scaling.

## 🎯 Core Game Logic

### Snake Movement

The snake is represented as an array of segments. Movement works as follows:

1. Calculate new head position based on current direction
2. Add new head to front of segment array
3. Remove tail segment (unless food was eaten)
4. If food eaten, tail stays (snake grows)

**Wrap-Around Math:**
```javascript
const wrapAround = (value, gridSize) => {
  return ((value % gridSize) + gridSize) % gridSize;
};
```
This handles negative wrapping correctly (exits left → enters right).

### Collision Detection

1. **Self-Collision:** Head checked against all body segments
2. **Food Collision:** Head position compared with food position
3. **No Wall Collision:** Edges wrap instead of blocking

### Speed Progression

Speed increases exponentially with score:

```javascript
speed = baseSpeed × (1 - increaseRate)^score
speed = 100ms × (1 - 0.02)^score
```

This creates a smooth curve that:
- Starts at 100ms (10 moves per second)
- Asymptotically approaches 50ms (20 moves per second)
- Feels challenging but fair

### High Score Persistence

```javascript
// Save to localStorage
localStorage.setItem('snakeHighScore', score.toString());

// Retrieve on game start
const highScore = localStorage.getItem('snakeHighScore') || 0;
```

## 🧠 Key Implementation Details

### useGameLoop Hook

This custom React hook encapsulates all game state and logic:

- **Game State Ref:** Mutable state tied to the game loop (not re-renders)
- **Direction Validation:** Prevents reverse-direction instant death
- **Tick Interval:** Dynamically adjusts speed based on score
- **Animation Frame:** Decoupled from game tick for smooth rendering
- **Event Cleanup:** Properly clears intervals and RAF on unmount

### Canvas Rendering

- **Efficient:** Only redraws what changed each frame
- **Grid-Aligned:** All entities snap to grid cells
- **Visual Polish:** Head highlight, slight body styling, dark background
- **No Flickering:** Double-buffer effect via requestAnimationFrame

### Input Handling

- Keyboard events mapped to direction vectors
- Prevents simultaneous key presses from conflicting
- Pause state tracked separately from movement

## 🔧 Customization & Extension

### Add Mobile/Touch Controls

In `src/game/Game.jsx`, add touch event listeners:

```javascript
const handleTouchStart = (e) => {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;
  
  // Determine swipe direction based on touch position
  // Update direction accordingly
};

window.addEventListener('touchstart', handleTouchStart);
```

### Add Sound Effects

Install a sound library like `howler.js`:

```bash
npm install howler
```

Then in `useGameLoop.js`:

```javascript
import { Howl } from 'howler';

const eatSound = new Howl({
  src: ['path/to/eat.mp3']
});

// In gameTick when food is eaten:
if (ateFood) {
  eatSound.play();
}
```

### Add Game Levels

Modify constants in `src/utils/constants.js`:

```javascript
const LEVELS = {
  EASY: { baseSpeed: 150, speedIncrease: 0.01 },
  MEDIUM: { baseSpeed: 100, speedIncrease: 0.02 },
  HARD: { baseSpeed: 75, speedIncrease: 0.03 }
};
```

Then pass selected level to `useGameLoop`.

### Add Obstacles

Create an `Obstacles.js` class similar to `Food.js`:

```javascript
export class Obstacles {
  constructor(layout) {
    this.positions = layout; // Static or generated
  }
  
  collidesWith(position) {
    return this.positions.some(pos => positionsEqual(position, pos));
  }
}
```

Add collision check in `gameTick`:

```javascript
if (obstacles.collidesWith(newHead)) {
  state.gameOver = true;
}
```

### Customize Colors

Edit `COLORS` in `src/utils/constants.js`:

```javascript
export const COLORS = {
  SNAKE: '#4ade80',      // Change to any hex color
  FOOD: '#f87171',
  BACKGROUND: '#1f2937',
  GRID: '#374151'
};
```

### Adjust Game Speed

Edit `src/utils/constants.js`:

```javascript
export const BASE_SPEED = 100;            // Start speed (ms)
export const MIN_SPEED = 50;              // Max speed cap
export const SPEED_INCREASE_RATE = 0.02;  // 2% faster per point
```

Lower `BASE_SPEED` = harder starting difficulty.
Lower `SPEED_INCREASE_RATE` = slower difficulty curve.

### Change Board Size

Edit `src/utils/constants.js`:

```javascript
export const GRID_SIZE = 20;  // 20x20 grid
export const CELL_SIZE = 30;  // 30 pixels per cell
```

This creates a 600×600px canvas. Adjust both for different sizes.

## 🧪 Testing Locally

### Development

```bash
npm run dev
```

Hot Module Replacement (HMR) enabled for instant feedback.

### Production Build Test

```bash
npm run build
npm run preview
```

Simulates the production environment locally.

## 📦 Dependencies

- **react** (18.2+): UI framework
- **react-dom** (18.2+): DOM rendering
- **vite** (5.0+): Build tool & dev server
- **tailwindcss** (3.3+): CSS framework
- **postcss** (8.4+): CSS processing
- **autoprefixer** (10.4+): CSS vendor prefixes

All are bundled in `package.json`.

## 🌐 Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires ES6+ support and Canvas API.

## 📝 License

Feel free to use this code for personal, educational, or commercial projects.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

First build with `npm run build`, then deploy the `dist/` folder.

### Deploy to GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/snake-game-react/',  // Your repo name
  // ... rest of config
});
```

2. Build and push:
```bash
npm run build
# Commit and push dist/ folder or use GitHub Actions
```

## 🐛 Troubleshooting

### Game doesn't start or display

- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache and refresh
- Try a different browser

### Canvas appears blank

- Verify `canvas` element is in the DOM
- Check that `canvasRef.current` is not null
- Ensure canvas dimensions are set (see `CANVAS_WIDTH`, `CANVAS_HEIGHT`)

### Keyboard input not responding

- Make sure the game window has focus
- Check that event listeners are attached
- Verify keyboard keys match constants in `constants.js`

### Game runs slow or stutters

- Close other browser tabs/applications
- Check browser DevTools Performance tab
- Reduce grid size or cell size if needed
- Try a different browser

### High score not saving

- Check if localStorage is enabled in browser
- Verify no browser extensions are blocking it
- Check browser console for storage errors
- Try an incognito/private window

## 🎓 Learning Resources

This project demonstrates:
- **React Hooks:** `useState`, `useEffect`, `useRef`, custom hooks
- **Canvas API:** 2D rendering, grid-based graphics
- **Game Dev:** Game loops, collision detection, difficulty scaling
- **Performance:** Separating render from game tick logic
- **State Management:** Using refs for mutable game state
- **Tailwind CSS:** Modern utility-first styling

Perfect for learning React game development concepts!

## 🔗 Related Resources

- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

---

**Enjoy the game! 🎮**

Questions or suggestions? Feel free to fork and enhance this project!
