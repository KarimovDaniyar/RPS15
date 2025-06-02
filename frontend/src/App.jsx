import OfflineGame from './pages/OfflineGame/OfflineGame';
import OnlineGame from './pages/OnlineGame/OnlineGame';
import Rules from './components/Rules/Rules';
import { useState } from 'react';
import './App.scss';

function App() {
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <div className="app-container">
        <div className="game-selection">
          <h1 className="game-title">Rock Paper Scissors</h1>
          <p className="game-subtitle">Choose your game mode</p>

          <div className="game-modes">
            <div className="game-mode-card" onClick={() => setMode('offline')}>
              <div className="mode-icon bot-icon">🤖</div>
              <h2>Play vs Bot</h2>
              <p>Challenge our AI opponent in a battle of wits!</p>
              <button className="mode-button">Start Game</button>
            </div>

            <div className="game-mode-card" onClick={() => setMode('online')}>
              <div className="mode-icon human-icon">👤</div>
              <h2>Play Online</h2>
              <p>Challenge real players from around the world!</p>
              <button className="mode-button">Start Game</button>
            </div>
          </div>

          <div className="rules-container">
            <Rules />
          </div>

          <div className="game-footer">
            <p>Choose from 15 unique moves! Rock, Paper, Scissors and more!</p>
            <a
              href="https://www.umop.com/rps15.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="attribution-link"
            >
              Original game by David C. Lovelace
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${mode}-mode`}>
      <header className="game-header">
        <h2 className="game-mode-title">
          {mode === 'offline' ? 'Playing vs Bot' : 'Online Match'}
        </h2>
        <div className="header-actions">
          <button className="back-button" onClick={() => setMode(null)}>
            ← Back to Menu
          </button>
          <Rules />
        </div>
      </header>

      {mode === 'offline' ? <OfflineGame /> : <OnlineGame />}
    </div>
  );
}

export default App;
