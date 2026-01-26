import { useState, useRef, useEffect } from 'react';
import Canvas from './Canvas';
import './genzgame.css';

export default function GenZGame({ onBack }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({
    score: 0,
    combo: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    isPaused: false,
  });

  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('genzgame_highscores');
    return saved ? JSON.parse(saved) : [];
  });

  const updateGameState = (newState) => {
    setGameState(prev => {
      if (typeof newState === 'function') {
        return newState(prev);
      }
      return { ...prev, ...newState };
    });
  };

  const handleGameOver = (finalScore) => {
    updateGameState({ gameOver: true });
    
    // Save high score
    const newScores = [
      { score: finalScore, date: new Date().toISOString() },
      ...highScores
    ].sort((a, b) => b.score - a.score).slice(0, 10);
    
    setHighScores(newScores);
    localStorage.setItem('genzgame_highscores', JSON.stringify(newScores));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      combo: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      isPaused: false,
    });
  };

  const togglePause = () => {
    updateGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="genzgame-container">
      <div className="genzgame-header">
        <button 
          onClick={onBack}
          className="back-btn"
        >
          ← Back
        </button>
        <h1 className="genzgame-title">GENZGAME</h1>
        <div className="genzgame-tagline">Bounce. Break. Flex.</div>
      </div>

      <div className="genzgame-content">
        <div className="genzgame-canvas-wrapper">
          <Canvas 
            ref={canvasRef}
            gameState={gameState}
            updateGameState={updateGameState}
            onGameOver={handleGameOver}
          />
          {gameState.isPaused && (
            <div className="pause-overlay">
              <div className="pause-text">PAUSED</div>
            </div>
          )}
        </div>

        <div className="genzgame-sidebar">
          <div className="stat-card">
            <div className="stat-label">SCORE</div>
            <div className="stat-value">{gameState.score}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">COMBO</div>
            <div className="stat-value combo">{gameState.combo}x</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">LIVES</div>
            <div className="stat-value">❤️ {gameState.lives}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">LEVEL</div>
            <div className="stat-value">{gameState.level}</div>
          </div>

          <div className="controls-card">
            <div className="controls-title">Controls</div>
            <div className="control-item">← → : Move Paddle</div>
            <div className="control-item">SPACE : Launch</div>
            <div className="control-item">P : Pause</div>
          </div>

          {highScores.length > 0 && (
            <div className="leaderboard-card">
              <div className="leaderboard-title">🏆 Top 10</div>
              <div className="leaderboard-list">
                {highScores.map((entry, idx) => (
                  <div key={idx} className="leaderboard-entry">
                    <span className="rank">#{idx + 1}</span>
                    <span className="score">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {gameState.gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-panel">
            <h2 className="game-over-title">GAME OVER</h2>
            <div className="game-over-score">
              <div className="score-label">Final Score</div>
              <div className="score-value">{gameState.score}</div>
            </div>
            
            {gameState.score > 0 && gameState.score === highScores[0]?.score && (
              <div className="new-high-score">🎉 NEW HIGH SCORE! 🎉</div>
            )}

            <div className="game-over-buttons">
              <button 
                onClick={resetGame}
                className="btn-play-again"
              >
                Play Again
              </button>
              <button 
                onClick={onBack}
                className="btn-back"
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
