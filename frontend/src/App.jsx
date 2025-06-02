import OfflineGame from './pages/OfflineGame/OfflineGame';
import OnlineGame from './pages/OnlineGame/OnlineGame';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Rules from './components/Rules/Rules';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.scss';

function AppContent() {
  const [mode, setMode] = useState(null);
  const { currentUser, logout } = useAuth();

  const renderHome = () => {
    if (mode) {
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

    return (
      <div className="app-container">
        <header className="app-header">
          <nav className="main-nav">
            {currentUser ? (
              <>
                <span className="welcome-text">Welcome, {currentUser.username}</span>
                <button className="nav-button" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </nav>
        </header>

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

            <div className="game-mode-card" onClick={() => currentUser ? setMode('online') : alert('Please login to play online')}>
              <div className="mode-icon human-icon">👤</div>
              <h2>Play Online</h2>
              <p>Challenge real players from around the world!</p>
              <button className="mode-button" disabled={!currentUser}>
                {currentUser ? 'Start Game' : 'Login Required'}
              </button>
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
  };

  return (
    <Routes>
      <Route path="/" element={renderHome()} />
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
